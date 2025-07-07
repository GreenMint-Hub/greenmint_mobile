import { NFT } from '@/types';

export const NFTS: NFT[] = [
  {
    id: '1',
    title: 'Green Pioneer',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Earned for completing 10 eco-friendly activities',
    earnedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    tokenId: '0x123456789',
  },
  {
    id: '2',
    title: 'Energy Saver',
    image: 'https://images.unsplash.com/photo-1548611716-3000b3f54cca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Reduced energy consumption by 20%',
    earnedDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    tokenId: '0x987654321',
  },
  {
    id: '3',
    title: 'Locked',
    image: 'https://images.unsplash.com/photo-1550684848-86a5d8727436?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    description: 'Save 50kg CO2 to unlock',
    earnedDate: '',
    tokenId: '',
  },
];