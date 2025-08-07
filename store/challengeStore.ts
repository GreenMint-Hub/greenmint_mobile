import { create } from 'zustand';
import { CHALLENGES } from '@/mocks/challenges';
import { Challenge } from '@/types';

interface ChallengeStore {
  challenges: Challenge[];
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  upcomingChallenges: Challenge[];
  isLoading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
  updateProgress: (challengeId: string, progress: number) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
}

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
  challenges: [],
  activeChallenges: [],
  completedChallenges: [],
  upcomingChallenges: [],
  isLoading: false,
  error: null,
  fetchChallenges: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const activeChallenges = CHALLENGES.filter(c => c.active);
      const completedChallenges = CHALLENGES.filter(c => c.completed);
      const upcomingChallenges = CHALLENGES.filter(c => !c.active && !c.completed);
      set({
        challenges: CHALLENGES,
        activeChallenges,
        completedChallenges,
        upcomingChallenges,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch challenges', isLoading: false });
    }
  },
  
  updateProgress: async (challengeId: string, progress: number) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { challenges } = get();
      
      // Update the challenge progress
      const updatedChallenges = challenges.map(c => {
        if (c.id === challengeId) {
          const updatedProgress = Math.min(c.progress + progress, 100);
          const completed = updatedProgress >= 100;
          
          return { 
            ...c, 
            progress: updatedProgress,
            completed,
            active: !completed,
          };
        }
        return c;
      });
      
      // Filter updated challenges by status
      const activeChallenges = updatedChallenges.filter(c => c.active);
      const completedChallenges = updatedChallenges.filter(c => c.completed);
      const upcomingChallenges = updatedChallenges.filter(c => !c.active && !c.completed);
      
      set({ 
        challenges: updatedChallenges,
        activeChallenges,
        completedChallenges,
        upcomingChallenges,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to update challenge progress', isLoading: false });
    }
  },

  joinChallenge: async (challengeId: string) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to join challenge', isLoading: false });
    }
  },
}));

