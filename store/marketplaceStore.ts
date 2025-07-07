import { create } from 'zustand';
import { MARKETPLACE_ITEMS } from '@/mocks/marketplace';
import { MarketplaceItem } from '@/types';

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
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        items: MARKETPLACE_ITEMS,
        filteredItems: MARKETPLACE_ITEMS,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch marketplace items', isLoading: false });
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
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { items, selectedCategory, searchQuery } = get();
      
      const newItem: MarketplaceItem = {
        id: Date.now().toString(),
        ...itemData,
      };
      
      const updatedItems = [newItem, ...items];
      
      let filtered = updatedItems;
      
      // Apply category filter if selected
      if (selectedCategory) {
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }
      
      // Apply search filter if there's a query
      if (searchQuery) {
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      set({ 
        items: updatedItems,
        filteredItems: filtered,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to add marketplace item', isLoading: false });
    }
  },
}));