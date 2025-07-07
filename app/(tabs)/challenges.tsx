import ChallengeCard from '@/components/ChallengeCard';
import Colors from '@/constants/Colors';
import { useChallengeStore } from '@/store/challengeStore';
import { useRouter } from 'expo-router';
import { Filter, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChallengesScreen() {
  const router = useRouter();
  const { 
    challenges, 
    activeChallenges, 
    completedChallenges, 
    upcomingChallenges, 
    fetchChallenges, 
    joinChallenge 
  } = useChallengeStore();
  const [activeTab, setActiveTab] = useState('Available');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoinChallenge = (challengeId: string) => {
    joinChallenge(challengeId);
  };

  const handleLogProgress = (challengeId: string) => {
    router.push({
      pathname: '/activity/log',
      params: { challengeId }
    });
  };

  const navigateToChallengeDetails = (challengeId: string) => {
    router.push({
      pathname: '/challenges/details',
      params: { id: challengeId }
    });
  };

  const filteredChallenges = () => {
    let filtered = [];
    
    if (activeTab === 'Available') {
      filtered = upcomingChallenges;
    } else if (activeTab === 'Complete') {
      filtered = completedChallenges;
    }
    
    if (searchQuery) {
      filtered = filtered.filter(challenge => 
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textLight}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Active Challenge</Text>
        {activeChallenges.length > 0 ? (
          activeChallenges.map(challenge => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge} 
              onProgress={() => handleLogProgress(challenge.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You don't have any active challenges.
              Join a challenge below to get started!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Available' && styles.activeTab]}
            onPress={() => setActiveTab('Available')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'Available' && styles.activeTabText
              ]}
            >
              Available
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Complete' && styles.activeTab]}
            onPress={() => setActiveTab('Complete')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'Complete' && styles.activeTabText
              ]}
            >
              Complete
            </Text>
          </TouchableOpacity>
        </View>
        
        {filteredChallenges().map(challenge => (
          <ChallengeCard 
            key={challenge.id} 
            challenge={challenge} 
            onJoin={() => handleJoinChallenge(challenge.id)}
          />
        ))}
        
        {filteredChallenges().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeTab === 'Available' 
                ? "No available challenges found. Check back later for new challenges!"
                : "You haven't completed any challenges yet. Join a challenge to get started!"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
          <TouchableOpacity>
            <Text style={styles.viewCalendarText}>View calendar</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.upcomingContainer}>
          <View style={styles.dateBox}>
            <Text style={styles.monthText}>Jun</Text>
            <Text style={styles.dayText}>15</Text>
          </View>
          <View style={styles.upcomingContent}>
            <Text style={styles.upcomingTitle}>Plastic Free Challenge</Text>
            <Text style={styles.upcomingDescription}>
              Avoid all single-use plastics for 21 days
            </Text>
            <View style={styles.upcomingDetails}>
              <Text style={styles.upcomingDetailText}>21 days</Text>
              <Text style={styles.upcomingDetailText}>45 signed up</Text>
            </View>
            <TouchableOpacity style={styles.notifyButton}>
              <Text style={styles.notifyButtonText}>Get Notified</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  section: {
    padding: 16,
    paddingTop: 0,
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
  viewCalendarText: {
    color: Colors.primary,
    fontWeight: '500',
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
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: Colors.textLight,
    lineHeight: 20,
  },
  upcomingContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dateBox: {
    width: 60,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
  },
  dayText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  upcomingContent: {
    flex: 1,
    padding: 16,
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
    marginBottom: 8,
  },
  upcomingDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  upcomingDetailText: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 16,
  },
  notifyButton: {
    alignSelf: 'stretch',
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  notifyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
});