import { create } from 'zustand';
import { MarketplaceItem } from '@/types';
import { API_CONFIG } from '@/constants/api';
import { useUserStore } from './userStore';
import { MARKETPLACE_ITEMS } from '@/mocks/marketplace';

interface MarketplaceState {
  items: MarketplaceItem[];
  filteredItems: MarketplaceItem[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  setCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  addItem: (item: Omit<MarketplaceItem, 'id'>) => Promise<void>;
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  items: [],
  filteredItems: [],
  selectedCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_CONFIG.API_URL}/marketplace`);
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace items');
      }
      const items = await response.json();
      
      // If no items from API, use mock data
      const finalItems = items && items.length > 0 ? items : MARKETPLACE_ITEMS;
      
      set({ 
        items: finalItems,
        filteredItems: finalItems,
        isLoading: false 
      });
    } catch (error) {
      // On error, use mock data
      set({ 
        items: MARKETPLACE_ITEMS,
        filteredItems: MARKETPLACE_ITEMS,
        isLoading: false 
      });
    }
  },
  
  setCategory: (category) => {
    const { items, searchQuery } = get();
    
    let filtered = items;
    
    // Apply category filter if selected
    if (category) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Apply search filter if there's a query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    set({ 
      selectedCategory: category,
      filteredItems: filtered
    });
  },
  
  setSearchQuery: (query) => {
    const { items, selectedCategory } = get();
    
    let filtered = items;
    
    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    // Apply search filter if there's a query
    if (query) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    set({ 
      searchQuery: query,
      filteredItems: filtered
    });
  },
  
  addItem: async (itemData) => {
    set({ isLoading: true, error: null });
    try {
      // Get token from user store
      const { token } = useUserStore.getState();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_CONFIG.API_URL}/marketplace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error('Failed to add marketplace item');
      }

      const newItem = await response.json();
      
      // Refresh the items list
      const { fetchItems } = get();
      await fetchItems();
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to add marketplace item', isLoading: false });
    }
  },
}));