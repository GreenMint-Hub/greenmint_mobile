import Colors from '@/constants/Colors';
import { NFT } from '@/types';
import { formatDistanceToNow } from '@/utils/date';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Card from './Card';

interface NFTCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const isLocked = !nft.earnedDate;

  return (
    <Card variant="outlined" style={styles.card}>
      <Image source={{ uri: nft.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{nft.title}</Text>
        <Text style={styles.description}>{nft.description}</Text>
        {!isLocked && (
          <Text style={styles.earnedDate}>
            Earned {formatDistanceToNow(new Date(nft.earnedDate))}
          </Text>
        )}
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
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 8,
  },
  earnedDate: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
});