import { UserActivity, Feedback, Message } from './types';
import { PROMPTS, replacePlaceholders } from './prompts';

// Gemini API Service class (only realistic feedback)
export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Only realistic/strict feedback
  async analyzeRealisticFeedback(activities: UserActivity[]): Promise<Feedback> {
    const activityData = activities.map(a => {
      if (a.type === 'steps') {
        return `${a.date}: ${a.count} steps`;
      } else {
        return `${a.date}: ${a.action} ${a.value} times`;
      }
    }).join('\n');
    const prompt = replacePlaceholders(PROMPTS.REALISTIC_FEEDBACK, {
      ACTIVITY_DATA: activityData
    });
    return this.callGeminiAPI(prompt);
  }

  // Persona + chat log analysis
  async analyzePersonaChat(persona: object, chatLog: Message[]): Promise<Feedback> {
    const personaJson = JSON.stringify(persona, null, 2);
    const chatLogText = chatLog
      .filter(msg => msg.isUser)
      .map(msg => `User: ${msg.text}`)
      .join('\n');
    const prompt = replacePlaceholders(PROMPTS.PERSONA_CHAT_ANALYSIS, {
      PERSONA_JSON: personaJson,
      CHAT_LOG: chatLogText,
    });
    return this.callGeminiAPI(prompt);
  }

  // Gemini API call (only for realistic feedback)
  public async callGeminiAPI(prompt: string): Promise<Feedback> {
    const today = new Date();
    try {
      // Try different Gemini model endpoints
      const endpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.apiKey}`
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: this.getSystemMessage() + '\n\n' + prompt
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 400,
              }
            }),
          });
          
          if (response.ok) {
            break; // Success, exit loop
          }
        } catch (error) {
          lastError = error;
          console.log(`Failed with endpoint: ${endpoint}`);
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`API call failed: ${response?.status} - ${response?.statusText} - Last error: ${lastError}`);
      }
      
      const data = await response.json();
      const geminiResponse = data.candidates[0].content.parts[0].text;
      return {
        date: today.toISOString().slice(0, 10),
        summary: geminiResponse,
      };
    } catch (error) {
      console.error('Gemini API call failed:', error);
      return {
        date: today.toISOString().slice(0, 10),
        summary: 'Unable to get feedback. Please try again later.',
      };
    }
  }

  // Only one system message needed
  private getSystemMessage(): string {
    return 'You are an expert who gives realistic and strict feedback on user health and environmental activities.';
  }
} 