import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Message } from '../types';
import { GeminiService } from '../gptService';
import personaProfessor from '../persona_50_60_professor.json';

export default function ChatbotModal() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Hello! I'm your eco-friendly AI assistant. Ask me anything about sustainability, environmental tips, or get feedback on your eco-actions!",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackSummary, setShowFeedbackSummary] = useState(false);
  const [isListOpen, setIsListOpen] = useState(true);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [analyzeFeedback, setAnalyzeFeedback] = useState('');
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  // Replace with your actual API key
  const apiKey = 'AIzaSyCyiqzOqCghRXwTrfuhf7F8Ho_dB8KQ6AA';

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    if (!apiKey) {
      Alert.alert('Error', 'API key not configured');
      return;
    }
    
    setIsLoading(true);
    const geminiService = new GeminiService(apiKey);
    
    try {
      const result = await geminiService.callGeminiAPI(chatInput);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: result.summary,
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Sorry, I couldn't process your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = () => {
    setShowFeedbackSummary(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eco AI Assistant</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Feedback Button */}
      {!showFeedbackSummary && (
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={handleFeedback}
        >
          <Image source={require('../assets/images/an_icon.png')} style={styles.feedbackIcon} />
        </TouchableOpacity>
      )}

      {/* Feedback Summary Screen */}
      {showFeedbackSummary ? (
        <View style={styles.feedbackContainer}>
          {/* Main Card */}
          <View style={styles.mainCard}>
            <Image 
              source={require('../assets/images/an_icon.png')} 
              style={styles.cardBackgroundIcon} 
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Wasted Energy</Text>
                  <Text style={styles.cardSubtitle}>CO₂ generated: 10kg</Text>
                  <Text style={styles.cardDescription}>
                    you wasted more energy than 25% of people
                  </Text>
                </View>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>Aug. 4 - Aug.8</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => setIsListOpen(prev => !prev)}
              >
                <Text style={styles.moreText}>more</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Activity List */}
          {isListOpen && (
            <View style={styles.activityList}>
              {[1, 2, 3, 4].map((_, idx) => (
                <View key={idx} style={styles.activityItem}>
                  <Image 
                    source={require('../assets/images/an_icon.png')} 
                    style={styles.activityIcon} 
                  />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Left your device on</Text>
                    <Text style={styles.activitySubtitle}>CO₂ generated: 2.5kg</Text>
                  </View>
                  <Text style={styles.activityTime}>Today</Text>
                </View>
              ))}
            </View>
          )}

          {/* Bottom Buttons */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => setShowFeedbackSummary(false)}
            >
              <Image 
                source={require('../assets/images/an_icon.png')} 
                style={styles.buttonIcon} 
              />
              <Text style={styles.chatButtonText}>chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={async () => {
                setShowAnalyzeModal(true);
                setAnalyzeLoading(true);
                setAnalyzeError('');
                setAnalyzeFeedback('');
                try {
                  const geminiService = new GeminiService(apiKey);
                  const result = await geminiService.analyzePersonaChat(personaProfessor.persona, messages);
                  setAnalyzeFeedback(result.summary);
                } catch (e) {
                  setAnalyzeError('Failed to get feedback.');
                } finally {
                  setAnalyzeLoading(false);
                }
              }}
            >
              <Text style={styles.analyzeButtonText}>ANALYZE</Text>
            </TouchableOpacity>
          </View>

          {/* Analyze Modal */}
          {showAnalyzeModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>overall comment</Text>
                <View style={styles.modalContent}>
                  {analyzeLoading ? (
                    <Text style={styles.loadingText}>Analyzing...</Text>
                  ) : analyzeError ? (
                    <Text style={styles.errorText}>{analyzeError}</Text>
                  ) : (
                    <ScrollView style={styles.feedbackScroll}>
                      <Text style={styles.feedbackText}>
                        {analyzeFeedback || 'No feedback available.'}
                      </Text>
                    </ScrollView>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowAnalyzeModal(false)}
                >
                  <Text style={styles.modalButtonText}>Back to tracking</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        /* Chat Interface */
        <>
          <View style={styles.chatContainer}>
            <ScrollView style={styles.messagesContainer}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    msg.isUser ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.isUser ? styles.userMessageText : styles.botMessageText
                  ]}>
                    {msg.text}
                  </Text>
                </View>
              ))}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Generating answer...</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputField}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Ask me about eco-friendly tips..."
                placeholderTextColor={Colors.textLight}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={sendMessage}
              >
                <Image 
                  source={require('../assets/images/se_icon.png')} 
                  style={styles.sendIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  feedbackButton: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  feedbackIcon: {
    width: 32,
    height: 32,
  },
  feedbackContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    marginTop: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardBackgroundIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: 60,
    height: 60,
    opacity: 0.12,
  },
  cardContent: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 1,
  },
  cardSubtitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 1,
  },
  cardDescription: {
    color: '#eafff3',
    fontSize: 11,
    marginTop: 4,
  },
  dateBadge: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
    marginTop: 2,
  },
  dateText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  moreButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  moreText: {
    color: Colors.white,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  activityList: {
    marginTop: 18,
    marginBottom: 100,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  activitySubtitle: {
    color: Colors.primary,
    fontSize: 13,
    marginTop: 2,
  },
  activityTime: {
    color: '#888',
    fontSize: 13,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    height: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  chatButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  analyzeButton: {
    flex: 2,
    marginLeft: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
    height: 320,
    zIndex: 100,
  },
  modal: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  modalContent: {
    flex: 1,
    width: '100%',
  },
  feedbackScroll: {
    maxHeight: 200,
  },
  feedbackText: {
    color: Colors.white,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  loadingText: {
    color: Colors.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  errorText: {
    color: Colors.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 8,
  },
  modalButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.backgroundLight,
    marginLeft: '20%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    marginRight: '20%',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: Colors.text,
  },
  botMessageText: {
    color: Colors.white,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 8,
  },
  sendButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 32,
    height: 32,
  },
});
