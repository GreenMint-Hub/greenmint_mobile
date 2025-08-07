export type EcoActivity = {
  id: string;
  type: 'walking' | 'cycling' | 'publicTransport' | 'recycling' | 'energySaving' | 'plantBasedMeal' | 'secondHandPurchase';
  title: string;
  description: string;
  date: string;
  co2Saved: number;
  points: number;
  verified: boolean;
  status?: 'pending' | 'verified' | 'rejected' | 'voting';
  user?: { name: string };
  votes?: { userId: string; value: 'yes' | 'no' | 'fake' | 'spam' }[];
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
  _id?: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  image: string;
  co2Saved: number;
  condition: string;
  seller: string;
  sellerId?: string;
  isActive?: boolean;
  isSold?: boolean;
  soldAt?: string;
  buyerId?: string;
  createdAt?: string;
  updatedAt?: string;
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
  email: string;
  role: 'user' | 'admin';
  name: string;
  avatar?: string;
  ecoPoints: number;
  totalCO2Saved: number;
  level: number;
  joinDate: string;
  activities: EcoActivity[];
  challenges: Challenge[];
  nfts: NFT[];
};