import { Notification } from '@/types';

export const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Challenge Available',
    message: 'Zero Waste Week challenge is now available!',
    date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: false,
    type: 'challenge',
  },
  {
    id: '2',
    title: 'Item Sold',
    message: 'Your Vintage Denim Jacket has been sold for $45',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: false,
    type: 'marketplace',
  },
  {
    id: '3',
    title: 'Achievement Unlocked',
    message: 'You earned the Green Pioneer NFT!',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    read: true,
    type: 'achievement',
  },
  {
    id: '4',
    title: 'Challenge Completed',
    message: 'You completed the Meatless Monday challenge!',
    date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    read: true,
    type: 'challenge',
  },
];