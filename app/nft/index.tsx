
import Button from '@/components/Button';
import Card from '@/components/Card';
import Colors from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import { Award, Wallet, Coins } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function NFTScreen() {
  const router = useRouter();
  const { user, claimReward, mintNFT, connectWallet, getWalletStatus } = useUserStore();
  const [walletStatus, setWalletStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWalletStatus();
  }, []);

  const loadWalletStatus = async () => {
    const status = await getWalletStatus();
    setWalletStatus(status);
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);
    try {
      await connectWallet('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
      await loadWalletStatus();
      Alert.alert('Success', 'Wallet connected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimReward = async () => {
    setIsLoading(true);
    try {
      await claimReward(100);
      Alert.alert('Success', 'Reward claimed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to claim reward');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintNFT = async () => {
    setIsLoading(true);
    try {
      await mintNFT({
        title: 'Green Guardian NFT',
        description: 'Earned for environmental achievements',
        carbonSaved: 50,
      });
      Alert.alert('Success', 'NFT minted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to mint NFT');
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.title}>NFT Rewards</Text>
        <Text style={styles.subtitle}>Blockchain-powered environmental achievements</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Connection</Text>
        <Card style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Wallet size={24} color={Colors.primary} />
            <Text style={styles.walletTitle}>Connect Your Wallet</Text>
          </View>
          <Text style={styles.walletDescription}>
            Connect your crypto wallet to claim rewards and mint NFTs
          </Text>
          <Button 
            title={walletStatus?.connected ? "Wallet Connected" : "Connect Wallet"} 
            variant={walletStatus?.connected ? "outline" : "primary"}
            onPress={handleConnectWallet}
            loading={isLoading}
            disabled={walletStatus?.connected}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        <Card style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <Coins size={24} color={Colors.primary} />
            <Text style={styles.rewardTitle}>Claim Your Rewards</Text>
          </View>
          <Text style={styles.rewardDescription}>
            You have earned rewards for your eco-friendly activities
          </Text>
          <View style={styles.rewardStats}>
            <View style={styles.rewardStat}>
              <Text style={styles.rewardStatValue}>{user.ecoPoints}</Text>
              <Text style={styles.rewardStatLabel}>Total Points</Text>
            </View>
            <View style={styles.rewardStat}>
              <Text style={styles.rewardStatValue}>{user.totalCO2Saved}kg</Text>
              <Text style={styles.rewardStatLabel}>CO₂ Saved</Text>
            </View>
          </View>
          <Button 
            title="Claim 100 Points" 
            variant="primary"
            onPress={handleClaimReward}
            loading={isLoading}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mint NFTs</Text>
        <Card style={styles.nftCard}>
          <View style={styles.nftHeader}>
            <Award size={24} color={Colors.primary} />
            <Text style={styles.nftTitle}>Green Guardian NFT</Text>
          </View>
          <Text style={styles.nftDescription}>
            Mint an NFT to commemorate your environmental achievements
          </Text>
          <View style={styles.nftRequirements}>
            <Text style={styles.nftRequirement}>• Save 50kg CO₂</Text>
            <Text style={styles.nftRequirement}>• Complete 10 activities</Text>
            <Text style={styles.nftRequirement}>• Earn 500 points</Text>
          </View>
          <Button 
            title="Mint NFT" 
            variant="primary"
            onPress={handleMintNFT}
            loading={isLoading}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blockchain Status</Text>
        <Card style={styles.statusCard}>
          <Text style={styles.statusTitle}>Network: Polygon</Text>
          <Text style={styles.statusText}>Environmentally friendly blockchain</Text>
          <Text style={styles.statusText}>Low gas fees and fast transactions</Text>
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
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  walletCard: {
    padding: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  walletDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  rewardCard: {
    padding: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  rewardDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  rewardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  rewardStat: {
    alignItems: 'center',
  },
  rewardStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  rewardStatLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  nftCard: {
    padding: 16,
  },
  nftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nftTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  nftDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
  },
  nftRequirements: {
    marginBottom: 16,
  },
  nftRequirement: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  statusCard: {
    padding: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
});

