import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { EcoActivity, Challenge, NFT, UserProfile } from '@/types';
import { API_CONFIG } from '@/constants/api';

const API_URL = API_CONFIG.API_URL;

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearStore: () => void;
  loadUserData: () => Promise<void>;
  addActivity: (activity: Omit<EcoActivity, 'id'>) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
  updateChallengeProgress: (challengeId: string, progress: number) => Promise<void>;
  addNFT: (nft: Omit<NFT, 'id'>) => Promise<void>;
  claimReward: (reward: number) => Promise<void>;
  mintNFT: (nftData: any) => Promise<void>;
  connectWallet: (address: string) => Promise<void>;
  getWalletStatus: () => Promise<any>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      token: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Attempting to login with:', { email, password: '***' });
          console.log('API URL:', `${API_URL}/auth/login`);
          const res = await axios.post(`${API_URL}/auth/login`, { email, password });
          console.log('Login successful:', res.data);
          set({
            user: {
              id: res.data.user._id,
              email: res.data.user.email,
              role: res.data.user.role,
              name: res.data.user.username || res.data.user.name || '',
              // ...add other fields as needed
            },
            token: res.data.accessToken,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Login failed:', error);
          console.error('Error response:', error.response?.data);
          set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
          throw error;
        }
      },
      
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Attempting to register with:', { username, email, password: '***' });
          console.log('API URL:', `${API_URL}/auth/register`);
          const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
          console.log('Registration successful:', res.data);
          set({
            user: {
              id: res.data.user._id,
              email: res.data.user.email,
              role: res.data.user.role,
              name: res.data.user.username || res.data.user.name || '',
              // ...add other fields as needed
            },
            token: res.data.accessToken,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Registration failed:', error);
          console.error('Error response:', error.response?.data);
          set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, token: null, error: null });
      },
      
      clearStore: () => {
        set({ user: null, token: null, error: null, isLoading: false });
        AsyncStorage.removeItem('user-storage');
      },
      
      loadUserData: async () => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          const res = await axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: res.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to load user data', isLoading: false });
        }
      },
      
      addActivity: async (activityData) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          
          const res = await axios.post(`${API_URL}/activity/log`, activityData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          await get().loadUserData();
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to add activity', isLoading: false });
        }
      },
      
      joinChallenge: async (challengeId) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          await axios.post(`${API_URL}/challenges/${challengeId}/join`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to join challenge', isLoading: false });
        }
      },
      
      updateChallengeProgress: async (challengeId, progress) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          
          await axios.patch(`${API_URL}/challenges/${challengeId}/progress`, { progress }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          await get().loadUserData();
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to update challenge progress', isLoading: false });
        }
      },
      
      addNFT: async (nftData) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          
          await axios.post(`${API_URL}/nft/mint`, nftData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          await get().loadUserData();
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to add NFT', isLoading: false });
        }
      },

      claimReward: async (reward) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          
          const res = await axios.post(`${API_URL}/blockchain/claim-reward`, { reward }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          set({ isLoading: false });
          return res.data;
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to claim reward', isLoading: false });
        }
      },

      mintNFT: async (nftData) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          
          const res = await axios.post(`${API_URL}/blockchain/mint-nft`, nftData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          set({ isLoading: false });
          return res.data;
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to mint NFT', isLoading: false });
        }
      },

      connectWallet: async (address) => {
        set({ isLoading: true, error: null });
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          
          const res = await axios.post(`${API_URL}/blockchain/connect-wallet`, { address }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          set({ isLoading: false });
          return res.data;
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to connect wallet', isLoading: false });
        }
      },

      getWalletStatus: async () => {
        try {
          const { token } = get();
          if (!token) throw new Error('No token');
          
          const res = await axios.get(`${API_URL}/blockchain/wallet-status`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          return res.data;
        } catch (error: any) {
          return { connected: false, message: 'Failed to get wallet status' };
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 