import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';

export default function LeaderboardScreen() {
  const { challengeId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [tab, setTab] = useState<'available' | 'my' | 'completed' | 'admin'>('available');

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'John Doe', points: 850, avatar: '👤' },
    { rank: 2, name: 'Jane Smith', points: 720, avatar: '👤' },
    { rank: 3, name: 'Mike Johnson', points: 650, avatar: '👤' },
    { rank: 4, name: 'Sarah Wilson', points: 580, avatar: '👤' },
    { rank: 5, name: 'David Brown', points: 520, avatar: '👤' },
  ];

  // Show total points and carbon saved at the top
  const pointsSection = (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Total Points: {user?.ecoPoints || 0}</Text>
      <Text style={{ fontSize: 15, color: '#888' }}>Total Carbon Saved: {(user?.ecoPoints || 0) / 2} kg</Text>
    </View>
  );

  // Only show Admin tab and features if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <View style={styles.container}>
      {pointsSection}
             <View style={styles.tabRow}>
         <TouchableOpacity style={[styles.tab, tab === 'available' && styles.activeTab]} onPress={() => {
           router.push({ pathname: '/(tabs)/challenges', params: { tab: 'available' } });
         }}>
           <Text style={[styles.tabText, tab === 'available' && styles.activeTabText]}>Challenges</Text>
         </TouchableOpacity>
         <TouchableOpacity style={[styles.tab, tab === 'my' && styles.activeTab]} onPress={() => {
           router.push({ pathname: '/(tabs)/challenges', params: { tab: 'my' } });
         }}>
           <Text style={[styles.tabText, tab === 'my' && styles.activeTabText]}>My Challenges</Text>
         </TouchableOpacity>
         <TouchableOpacity style={[styles.tab, tab === 'completed' && styles.activeTab]} onPress={() => {
           router.push({ pathname: '/(tabs)/challenges', params: { tab: 'completed' } });
         }}>
           <Text style={[styles.tabText, tab === 'completed' && styles.activeTabText]}>Completed Challenges</Text>
         </TouchableOpacity>
         {isAdmin && (
           <TouchableOpacity style={[styles.tab, tab === 'admin' && styles.activeTab]} onPress={() => {
             router.push({ pathname: '/(tabs)/challenges', params: { tab: 'admin' } });
           }}>
             <Text style={[styles.tabText, tab === 'admin' && styles.activeTabText]}>Admin</Text>
           </TouchableOpacity>
         )}
       </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Challenge Leaderboard</Text>
        <Text style={styles.subtitle}>Challenge #{challengeId}</Text>
      
        <View style={styles.leaderboard}>
          {leaderboardData.map((entry) => (
            <View key={entry.rank} style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rank}>{entry.rank}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.avatar}>{entry.avatar}</Text>
                <Text style={styles.name}>{entry.name}</Text>
              </View>
              <Text style={styles.points}>{entry.points} pts</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabRow: {
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
  },
  leaderboard: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});






