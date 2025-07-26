
import MarketplaceItem from '@/components/MarketplaceItem';
import Colors from '@/constants/Colors';
import { useMarketplaceStore } from '@/store/marketplaceStore';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import { Filter, Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ethers } from 'ethers';
import { getMarketplaceListings } from '../../utils/contractHelpers';


export default function MarketScreen() {
  const router = useRouter();
  const { items, filteredItems, fetchItems, setSearchQuery } = useMarketplaceStore();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('Buy');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'Buy') {
      setLoading(true);
      setError(null);
      const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY'); // Replace with your RPC
      getMarketplaceListings(provider)
        .then(setListings)
        .catch(() => setError('Failed to fetch listings'))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleSearch = (text: string) => {
    setLocalSearchQuery(text);
  };

  const navigateToItemDetails = (itemId: string) => {
    router.push({
      pathname: '/marketplace/details',
      params: { id: itemId }
    });
  };

  const categories = ['ALL', 'SHOES', 'Jacket', 'Mat', 'Shirt'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GreenMint</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{user?.ecoPoints || 0} EcoPoints</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search marketplace"
            value={localSearchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={Colors.textLight}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Buy' && styles.activeTab]}
          onPress={() => setActiveTab('Buy')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'Buy' && styles.activeTabText
            ]}
          >
            Buy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Sell' && styles.activeTab]}
          onPress={() => setActiveTab('Sell')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'Sell' && styles.activeTabText
            ]}
          >
            Sell
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity 
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.itemsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 32 }} />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={listings.filter(item => {
              // Filter by search and category
              const matchesSearch = localSearchQuery === '' || (item.ipfsDescription?.toLowerCase().includes(localSearchQuery.toLowerCase()));
              const matchesCategory = selectedCategory === 'ALL' || (item.ipfsDescription?.toLowerCase().includes(selectedCategory.toLowerCase()));
              return matchesSearch && matchesCategory;
            })}
            renderItem={({ item }) => (
              <MarketplaceItem 
                item={{
                  id: item.listingId?.toString() ?? '',
                  title: item.ipfsDescription ?? 'No Title',
                  price: Number(ethers.formatEther(item.price ?? '0')),
                  image: '', // Optionally fetch from IPFS if available
                  co2Saved: 0,
                  condition: item.isActive ? 'Active' : 'Inactive',
                  seller: item.seller,
                }}
                onPress={() => navigateToItemDetails(item.listingId?.toString() ?? '')}
              />
            )}
            keyExtractor={(item) => item.listingId?.toString() ?? ''}
            numColumns={2}
            columnWrapperStyle={styles.itemsRow}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No items found. Try adjusting your search or filters.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
  },
  pointsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsText: {
    color: Colors.white,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  tabText: {
    color: Colors.textLight,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
  },
  categoriesContainer: {
    maxHeight: 40,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.text,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: Colors.white,
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  itemsRow: {
    justifyContent: 'space-between',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: Colors.textLight,
  },
});