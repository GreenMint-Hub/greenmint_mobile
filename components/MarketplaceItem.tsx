import Colors from '@/constants/Colors';
import { MarketplaceItem as MarketplaceItemType } from '@/types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import Card from './Card';

interface MarketplaceItemProps {
  item: MarketplaceItemType;
  onPress: () => void;
}

export default function MarketplaceItem({ item, onPress }: MarketplaceItemProps) {
  return (
    <Card variant="outlined" style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.co2Badge}>
          <Text style={styles.co2Text}>-{item.co2Saved}kg CO₂</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
          <Text style={styles.condition}>{item.condition}</Text>
        </View>
        <Button 
          title="View Details" 
          variant="primary" 
          size="small" 
          onPress={onPress} 
          style={styles.button}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  co2Badge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  co2Text: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  condition: {
    fontSize: 12,
    color: Colors.textLight,
  },
  button: {
    width: '100%',
  },
});