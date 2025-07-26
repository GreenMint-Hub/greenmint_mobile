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
  // Add more actions as needed
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
}));
