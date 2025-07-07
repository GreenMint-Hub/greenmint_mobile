import { UserProfile } from '@/types';
import { ACTIVITIES } from './activities';
import { CHALLENGES } from './challenges';
import { NFTS } from './nfts';

export const USER: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  ecoPoints: 1250,
  totalCO2Saved: 125,
  level: 5,
  joinDate: new Date(Date.now() - 86400000 * 30).toISOString(),
  activities: ACTIVITIES,
  challenges: CHALLENGES.filter(c => c.active || c.completed),
  nfts: NFTS.filter(nft => nft.earnedDate),
};