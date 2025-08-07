// Updated on 2025-07-07
// Updated on 2025-07-07
// Updated on 2025-07-07
import ActivityCard from '@/components/ActivityCard';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import Colors from '@/constants/Colors';
import { useChallengeStore } from '@/store/challengeStore';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import { Award, Bike, Bus, Footprints, Leaf, Lightbulb, MessageCircle, Recycle, ShoppingBag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, loadUserData, getWalletStatus, mintNFT } = useUserStore();
  const { activeChallenges, fetchChallenges } = useChallengeStore();
  const [walletStatus, setWalletStatus] = useState<any>(null);

  useEffect(() => {
    loadUserData();
    fetchChallenges();
    loadWalletStatus();
  }, []);

  const loadWalletStatus = async () => {
    const status = await getWalletStatus();
    setWalletStatus(status);
  };

  const handleMintNFT = async () => {
    try {
      await mintNFT({
        title: 'Green Guardian NFT',
        description: 'Earned for environmental achievements',
        carbonSaved: user?.totalCO2Saved || 0,
      });
      Alert.alert('Success', 'NFT minted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to mint NFT');
    }
  };

  const navigateToLogActivity = (actionType?: string) => {
    if (actionType) {
      router.push(`/activity/log?type=${actionType}`);
    } else {
      router.push('/activity/log');
    }
  };

  const navigateToAllActivities = () => {
    router.push('/carbon');
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // All user-dependent code below this guard
  const joinDate = new Date(user.joinDate || new Date());
  const today = new Date();
  const daysSinceJoin = Math.max(1, Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalCO2Saved = (user?.ecoPoints || 0) / 2;
  
  // Calculate daily average CO2 saved
  const dailyCO2Saved = daysSinceJoin > 0 ? (totalCO2Saved / daysSinceJoin) : 0;
  
  // Calculate weekly average CO2 saved
  const weeksSinceJoin = Math.max(1, Math.ceil(daysSinceJoin / 7));
  const weeklyCO2Saved = totalCO2Saved / weeksSinceJoin;
  
  // Calculate monthly average CO2 saved
  const monthsSinceJoin = Math.max(1, Math.ceil(daysSinceJoin / 30));
  const monthlyCO2Saved = totalCO2Saved / monthsSinceJoin;
  const recentActivities = user.activities?.slice(0, 3) || [];
  const activeChallenge = activeChallenges[0];
  // ...existing code...

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {(user as any).username || user.name || user.email}!</Text>
        <Text style={styles.points}>Total Points: {user?.ecoPoints || 0}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Carbon Impact</Text>
        <Card style={styles.carbonCard}>
          <Text style={styles.carbonLabel}>Total CO₂ Saved</Text>
          <Text style={styles.carbonValue}>{(user?.ecoPoints || 0) / 2}kg</Text>

          <ProgressBar
            progress={(user?.ecoPoints || 0) / 2}
            total={200}
            color={Colors.primary}
            backgroundColor="rgba(76, 175, 80, 0.2)"
          />
          <Text style={styles.goalText}>Goal 200kg CO₂</Text>
          
          <View style={styles.timeframeRow}>
            <View style={styles.timeframeItem}>
              <Text style={styles.timeframeLabel}>Daily</Text>
              <Text style={styles.timeframeValue}>
                {isNaN(dailyCO2Saved) ? '0.00' : dailyCO2Saved.toFixed(2)}kg
              </Text>
            </View>
            <View style={styles.timeframeItem}>
              <Text style={styles.timeframeLabel}>Weekly</Text>
              <Text style={styles.timeframeValue}>
                {isNaN(weeklyCO2Saved) ? '0.00' : weeklyCO2Saved.toFixed(2)}kg
              </Text>
            </View>
            <View style={styles.timeframeItem}>
              <Text style={styles.timeframeLabel}>Monthly</Text>
              <Text style={styles.timeframeValue}>
                {isNaN(monthlyCO2Saved) ? '0.00' : monthlyCO2Saved.toFixed(2)}kg
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Log Eco Action</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateToLogActivity('cycling')}
          >
            <View style={styles.actionIcon}>
              <Bike size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Cycling</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateToLogActivity('public-transport')}
          >
            <View style={styles.actionIcon}>
              <Bus size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Public Transport</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateToLogActivity('walking')}
          >
            <View style={styles.actionIcon}>
              <Footprints size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Walking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateToLogActivity('plant-based-meal')}
          >
            <View style={styles.actionIcon}>
              <Leaf size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Plant Based Meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateToLogActivity('secondhand')}
          >
            <View style={styles.actionIcon}>
              <ShoppingBag size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Second-hand Purchase</Text>
          </TouchableOpacity>
          
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity History</Text>
          <TouchableOpacity onPress={navigateToAllActivities}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          {/* <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Activities</Text>
          </TouchableOpacity> */}
        </View>
        
        {recentActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
        
        <Button 
          title="View All Activities" 
          variant="outline" 
          onPress={navigateToAllActivities}
          style={styles.viewAllButton}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Milestones</Text>
        
        <Card style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <View style={styles.milestoneIcon}>
              <Award size={24} color={Colors.primary} />
            </View>
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneTitle}>Green Guardian NFT</Text>
              <Text style={styles.milestoneDescription}>Save 50kg more CO₂ to earn</Text>
            </View>
          </View>
          <ProgressBar 
            progress={user.totalCO2Saved || 0} 
            total={user.totalCO2Saved || 0 + 50} 
            showPercentage={false}
            color={Colors.primary}
            backgroundColor="rgba(76, 175, 80, 0.2)"
          />
        </Card>
        
        <Card style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <View style={styles.milestoneIcon}>
              <Lightbulb size={24} color={Colors.primary} />
            </View>
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneTitle}>Energy Master NFT</Text>
              <Text style={styles.milestoneDescription}>Log 10 more energy-saving actions</Text>
            </View>
          </View>
          <ProgressBar 
            progress={3} 
            total={13} 
            showPercentage={false}
            color={Colors.primary}
            backgroundColor="rgba(76, 175, 80, 0.2)"
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blockchain Status</Text>
        <Card style={styles.blockchainCard}>
          <View style={styles.blockchainHeader}>
            <Text style={styles.blockchainTitle}>
              {walletStatus?.connected ? 'Wallet Connected' : 'Wallet Not Connected'}
            </Text>
            <Text style={styles.blockchainSubtitle}>
              {walletStatus?.connected ? walletStatus.address : 'Connect your wallet to claim rewards'}
            </Text>
          </View>
          <View style={styles.blockchainActions}>
            <Button 
              title="Connect Wallet" 
              variant="outline" 
              onPress={() => router.push('/nft')}
              style={styles.blockchainButton}
            />
            <Button 
              title="Mint NFT" 
              variant="primary" 
              onPress={handleMintNFT}
              style={styles.blockchainButton}
            />
          </View>
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
  points: {
    fontSize: 14,
    color: Colors.white,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  carbonCard: {
    padding: 16,
  },
  carbonLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  carbonValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 16,
  },
  goalText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'right',
    marginBottom: 16,
  },
  timeframeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeframeItem: {
    backgroundColor: Colors.backgroundLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  timeframeLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  timeframeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '31%',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 16,
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
  viewAllButton: {
    marginTop: 8,
  },
  milestoneCard: {
    marginBottom: 12,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  blockchainCard: {
    padding: 16,
  },
  blockchainHeader: {
    marginBottom: 16,
  },
  blockchainTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  blockchainSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  blockchainActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blockchainButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

