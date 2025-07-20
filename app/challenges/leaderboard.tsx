import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react-native';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  co2Saved: number;
  points: number;
  rank: number;
  activities: number;
  streak: number;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    co2Saved: 245,
    points: 2450,
    rank: 1,
    activities: 89,
    streak: 15,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    co2Saved: 198,
    points: 1980,
    rank: 2,
    activities: 67,
    streak: 12,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    co2Saved: 176,
    points: 1760,
    rank: 3,
    activities: 54,
    streak: 8,
  },
  {
    id: '4',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    co2Saved: 125,
    points: 1250,
    rank: 4,
    activities: 45,
    streak: 5,
  },
  {
    id: '5',
    name: 'Lisa Park',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    co2Saved: 112,
    points: 1120,
    rank: 5,
    activities: 38,
    streak: 7,
  },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [selectedCategory, setSelectedCategory] = useState('Overall');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#FFD700" />;
      case 2:
        return <Medal size={24} color="#C0C0C0" />;
      case 3:
        return <Award size={24} color="#CD7F32" />;
      default:
        return (
          <View style={styles.rankNumber}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        );
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank <= 3) {
      return styles.topRankCard;
    }
    return styles.regularRankCard;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Trophy size={24} color={Colors.primary} />
        <Text style={styles.title}>Challenge Leaderboard</Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Period:</Text>
            {['This Week', 'This Month', 'All Time'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.filterChip,
                  selectedPeriod === period && styles.selectedFilterChip
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedPeriod === period && styles.selectedFilterChipText
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Category:</Text>
            {['Overall', 'CO₂ Saved', 'Activities', 'Streak'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.selectedFilterChip
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.selectedFilterChipText
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.podiumContainer}>
        <Card style={styles.podiumCard}>
          <Text style={styles.podiumTitle}>🏆 Top 3 Champions</Text>
          <View style={styles.podium}>
            {/* Second Place */}
            <View style={styles.podiumPosition}>
              <Image source={{ uri: LEADERBOARD_DATA[1].avatar }} style={styles.podiumAvatar} />
              <View style={styles.podiumRank}>
                <Medal size={20} color="#C0C0C0" />
              </View>
              <Text style={styles.podiumName}>{LEADERBOARD_DATA[1].name}</Text>
              <Text style={styles.podiumScore}>{LEADERBOARD_DATA[1].co2Saved}kg CO₂</Text>
            </View>

            {/* First Place */}
            <View style={[styles.podiumPosition, styles.firstPlace]}>
              <Image source={{ uri: LEADERBOARD_DATA[0].avatar }} style={styles.podiumAvatar} />
              <View style={styles.podiumRank}>
                <Crown size={24} color="#FFD700" />
              </View>
              <Text style={styles.podiumName}>{LEADERBOARD_DATA[0].name}</Text>
              <Text style={styles.podiumScore}>{LEADERBOARD_DATA[0].co2Saved}kg CO₂</Text>
            </View>

            {/* Third Place */}
            <View style={styles.podiumPosition}>
              <Image source={{ uri: LEADERBOARD_DATA[2].avatar }} style={styles.podiumAvatar} />
              <View style={styles.podiumRank}>
                <Award size={20} color="#CD7F32" />
              </View>
              <Text style={styles.podiumName}>{LEADERBOARD_DATA[2].name}</Text>
              <Text style={styles.podiumScore}>{LEADERBOARD_DATA[2].co2Saved}kg CO₂</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Rankings</Text>
        
        {LEADERBOARD_DATA.map((user) => (
          <Card key={user.id} style={getRankStyle(user.rank)}>
            <View style={styles.userRow}>
              <View style={styles.rankContainer}>
                {getRankIcon(user.rank)}
              </View>
              
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.userStats}>
                  <Text style={styles.userStat}>{user.activities} activities</Text>
                  <Text style={styles.userStat}>•</Text>
                  <Text style={styles.userStat}>{user.streak} day streak</Text>
                </View>
              </View>
              
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{user.co2Saved}kg</Text>
                <Text style={styles.scoreLabel}>CO₂ Saved</Text>
                <View style={styles.pointsContainer}>
                  <Text style={styles.pointsText}>{user.points} pts</Text>
                </View>
              </View>
              
              <View style={styles.trendContainer}>
                <TrendingUp size={16} color={Colors.success} />
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Card style={styles.myRankCard}>
          <Text style={styles.myRankTitle}>Your Ranking</Text>
          <View style={styles.myRankContent}>
            <View style={styles.myRankInfo}>
              <Text style={styles.myRankPosition}>#4</Text>
              <Text style={styles.myRankDescription}>
                You're doing great! Keep logging activities to climb higher.
              </Text>
            </View>
            <View style={styles.myRankStats}>
              <View style={styles.myRankStat}>
                <Text style={styles.myRankStatValue}>125kg</Text>
                <Text style={styles.myRankStatLabel}>CO₂ Saved</Text>
              </View>
              <View style={styles.myRankStat}>
                <Text style={styles.myRankStatValue}>1,250</Text>
                <Text style={styles.myRankStatLabel}>Points</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Card style={styles.achievementCard}>
          <Text style={styles.achievementTitle}>Next Milestone</Text>
          <Text style={styles.achievementDescription}>
            Save 51kg more CO₂ to reach the top 3 and earn the "Eco Champion" NFT!
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '71%' }]} />
            </View>
            <Text style={styles.progressText}>71% to next rank</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 12,
  },
  filterChip: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedFilterChipText: {
    color: Colors.white,
  },
  podiumContainer: {
    padding: 16,
  },
  podiumCard: {
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  podiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  podiumPosition: {
    alignItems: 'center',
    flex: 1,
  },
  firstPlace: {
    marginBottom: 20,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  podiumRank: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 4,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
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
  topRankCard: {
    marginBottom: 8,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  regularRankCard: {
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStat: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 4,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: Colors.textLight,
    marginBottom: 4,
  },
  pointsContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pointsText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '500',
  },
  trendContainer: {
    width: 24,
    alignItems: 'center',
  },
  myRankCard: {
    padding: 16,
    backgroundColor: Colors.primary,
  },
  myRankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 12,
  },
  myRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myRankInfo: {
    flex: 1,
  },
  myRankPosition: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  myRankDescription: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  myRankStats: {
    flexDirection: 'row',
  },
  myRankStat: {
    alignItems: 'center',
    marginLeft: 16,
  },
  myRankStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  myRankStatLabel: {
    fontSize: 10,
    color: Colors.white,
    opacity: 0.8,
  },
  achievementCard: {
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'right',
  },
});