import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ethers } from 'ethers';
import { getMarketplaceListings } from '../../utils/contractHelpers';

export default function MarketplaceScreen() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY'); // Replace with your RPC
    getMarketplaceListings(provider)
      .then(setListings)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Marketplace Listings</Text>
      <FlatList
        data={listings}
        keyExtractor={item => item.listingId.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16, padding: 12, borderWidth: 1, borderRadius: 8 }}>
            <Text>Listing ID: {item.listingId}</Text>
            <Text>Price: {ethers.formatEther(item.price)} ETH</Text>
            {/* Add more fields as needed */}
          </View>
        )}
      />
    </View>
  );
}