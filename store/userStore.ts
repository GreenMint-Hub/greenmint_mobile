import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER } from '@/mocks/user';
import { EcoActivity, Challenge, NFT, UserProfile } from '@/types';

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserData: () => Promise<void>;
  addActivity: (activity: Omit<EcoActivity, 'id'>) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
  updateChallengeProgress: (challengeId: string, progress: number) => Promise<void>;
  addNFT: (nft: Omit<NFT, 'id'>) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll just simulate a login with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (email === 'demo@example.com' && password === 'password') {
            set({ user: USER, isLoading: false });
          } else {
            set({ error: 'Invalid email or password', isLoading: false });
          }
        } catch (error) {
          set({ error: 'Login failed', isLoading: false });
        }
      },
      
      logout: () => {
        set({ user: null, error: null });
      },
      
      loadUserData: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ user: USER, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to load user data', isLoading: false });
        }
      },
      
      addActivity: async (activityData) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          const newActivity: EcoActivity = {
            id: Date.now().toString(),
            ...activityData,
            date: new Date().toISOString(),
            verified: false,
          };
          
          const updatedUser = {
            ...user,
            activities: [newActivity, ...user.activities],
            totalCO2Saved: user.totalCO2Saved + activityData.co2Saved,
            ecoPoints: user.ecoPoints + activityData.points,
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to add activity', isLoading: false });
        }
      },
      
      joinChallenge: async (challengeId) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Find the challenge in the mock data
          const challengeToJoin = user.challenges.find(c => c.id === challengeId);
          if (!challengeToJoin) throw new Error('Challenge not found');
          
          // Update the challenge to active
          const updatedChallenges = user.challenges.map(c => 
            c.id === challengeId ? { ...c, active: true } : c
          );
          
          const updatedUser = {
            ...user,
            challenges: updatedChallenges,
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to join challenge', isLoading: false });
        }
      },
      
      updateChallengeProgress: async (challengeId, progress) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          // Update the challenge progress
          const updatedChallenges = user.challenges.map(c => {
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
          
          const updatedUser = {
            ...user,
            challenges: updatedChallenges,
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to update challenge progress', isLoading: false });
        }
      },
      
      addNFT: async (nftData) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user } = get();
          if (!user) throw new Error('User not logged in');
          
          const newNFT: NFT = {
            id: Date.now().toString(),
            ...nftData,
            earnedDate: new Date().toISOString(),
          };
          
          const updatedUser = {
            ...user,
            nfts: [newNFT, ...user.nfts],
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to add NFT', isLoading: false });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);