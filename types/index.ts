// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
export type EcoActivity = {
  id: string;
  type: 'cycling' | 'publicTransport' | 'recycling' | 'energySaving' | 'plantBasedMeal' | 'secondHandPurchase';
  title: string;
  description: string;
  date: string;
  co2Saved: number;
  points: number;
  verified: boolean;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  participants: number;
  co2Potential: number;
  progress: number;
  reward: string;
  completed: boolean;
  active: boolean;
};

export type NFT = {
  id: string;
  title: string;
  image: string;
  description: string;
  earnedDate: string;
  tokenId: string;
};

export type MarketplaceItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  co2Saved: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  seller: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'challenge' | 'marketplace' | 'achievement' | 'system';
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  ecoPoints: number;
  totalCO2Saved: number;
  level: number;
  joinDate: string;
  activities: EcoActivity[];
  challenges: Challenge[];
  nfts: NFT[];
};