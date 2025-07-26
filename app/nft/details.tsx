import Button from '@/components/Button';
import Card from '@/components/Card';
import Colors from '@/constants/Colors';
import { NFTS } from '@/mocks/nfts';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import { Award } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NFTDetailsScreen() {
  const router = useRouter();
  const { user } = useUserStore();

  // All hooks are above this line!

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My NFT Rewards</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Collection</Text>
        <Text style={styles.sectionDescription}>
          NFTs earned through eco-friendly activities
        </Text>
        
        <View style={styles.nftGrid}>
          {NFTS.map((nft) => (
            <Card key={nft.id} style={styles.nftCard}>
              <Image source={{ uri: nft.image }} style={styles.nftImage} />
              <View style={styles.nftContent}>
                <Text style={styles.nftTitle}>{nft.title}</Text>
                <Text style={styles.nftDescription}>{nft.description}</Text>
                {nft.earnedDate ? (
                  <View style={styles.earnedBadge}>
                    <Award size={12} color={Colors.primary} />
                    <Text style={styles.earnedText}>Earned</Text>
                  </View>
                ) : (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedText}>Locked</Text>
                  </View>
                )}
              </View>
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NFT Details</Text>
        
        <Card style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>What are GreenMint NFTs?</Text>
          <Text style={styles.detailsText}>
            GreenMint NFTs are digital collectibles that represent your environmental achievements. 
            Each NFT is minted on the Polygon blockchain, which uses a fraction of the energy 
            compared to other blockchains.
          </Text>
          
          <Text style={styles.detailsTitle}>How to earn NFTs?</Text>
          <Text style={styles.detailsText}>
            Complete eco-challenges, log activities regularly, and reach carbon saving milestones 
            to earn unique NFTs that showcase your commitment to sustainability.
          </Text>
          
          <Text style={styles.detailsTitle}>What can I do with my NFTs?</Text>
          <Text style={styles.detailsText}>
            Display them in your profile, share on social media, or transfer to your personal 
            crypto wallet. Each NFT also provides special benefits within the GreenMint ecosystem.
          </Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect Wallet</Text>
        <Text style={styles.sectionDescription}>
          Connect your crypto wallet to transfer your NFTs
        </Text>
        
        <Card style={styles.walletCard}>
          <Button 
            title="Connect MetaMask" 
            variant="primary" 
            onPress={() => {}}
            style={styles.walletButton}
          />
          <Button 
            title="Connect WalletConnect" 
            variant="outline" 
            onPress={() => {}}
            style={styles.walletButton}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming NFT Rewards</Text>
        
        <Card style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <View style={styles.upcomingIcon}>
              <Award size={24} color={Colors.primary} />
            </View>
            <View style={styles.upcomingContent}>
              <Text style={styles.upcomingTitle}>Eco Warrior NFT</Text>
              <Text style={styles.upcomingDescription}>
                Complete 5 more recycling activities to earn
              </Text>
            </View>
          </View>
          <Button 
            title="View Challenge" 
            variant="outline" 
            onPress={() => router.push('/challenges')}
            style={styles.upcomingButton}
          />
        </Card>
        
        <Card style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <View style={styles.upcomingIcon}>
              <Award size={24} color={Colors.primary} />
            </View>
            <View style={styles.upcomingContent}>
              <Text style={styles.upcomingTitle}>Carbon Champion NFT</Text>
              <Text style={styles.upcomingDescription}>
                Save 100kg more CO₂ to earn
              </Text>
            </View>
          </View>
          <Button 
            title="Log Activities" 
            variant="outline" 
            onPress={() => router.push('/activity/log')}
            style={styles.upcomingButton}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  nftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nftCard: {
    width: '48%',
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  nftContent: {
    padding: 12,
  },
  nftTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  nftDescription: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 8,
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnedText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  lockedBadge: {
    backgroundColor: Colors.textLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  lockedText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '500',
  },
  detailsCard: {
    padding: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  detailsText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 8,
  },
  walletCard: {
    padding: 16,
  },
  walletButton: {
    marginBottom: 12,
  },
  upcomingCard: {
    padding: 16,
    marginBottom: 12,
  },
  upcomingHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  upcomingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  upcomingDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  upcomingButton: {
    alignSelf: 'flex-start',
  },
});