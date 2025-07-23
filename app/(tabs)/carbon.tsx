import ActivityCard from '@/components/ActivityCard';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import Colors from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import { Bike, Bus, Leaf, ShoppingBag, Footprints } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';

export default function CarbonScreen() {
  const router = useRouter();
  const { user, loadUserData } = useUserStore();
  const [timeframe, setTimeframe] = useState('This Week');
  const [activeTab, setActiveTab] = useState('Activities');
  const [feedTab, setFeedTab] = useState<'my' | 'community'>('my');
  const [myActions, setMyActions] = useState<any[]>([]);
  const [communityActions, setCommunityActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (feedTab === 'my') {
      setLoading(true);
      axios.get(`${API_CONFIG.API_URL}/activity/user`, {
        headers: { Authorization: `Bearer ${useUserStore.getState().token}` },
      })
        .then(res => setMyActions(res.data))
        .catch(err => setError('Failed to load activities'))
        .finally(() => setLoading(false));
    } else if (feedTab === 'community') {
      setLoading(true);
      axios.get(`${API_CONFIG.API_URL}/activity/community`, {
        headers: { Authorization: `Bearer ${useUserStore.getState().token}` },
      })
        .then(res => setCommunityActions(res.data))
        .catch(err => setError('Failed to load community actions'))
        .finally(() => setLoading(false));
    }
  }, [feedTab]);

  const navigateToLogActivity = () => {
    router.push('/activity/log');
  };
  const navigateToUploadMedia = () => {
    router.push('/activity/upload-media');
  };
  const navigateToVote = () => {
    router.push('/activity/vote');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const ECO_ACTIONS = [
    { label: 'Walking', icon: Footprints, route: '/activity/log' },
    { label: 'Cycling', icon: Bike, route: '/activity/log' },
    { label: 'Public Transport', icon: Bus, route: '/activity/log' },
    { label: 'Plant-Based Meal', icon: Leaf, route: '/activity/log' },
    { label: 'Secondhand Purchase', icon: ShoppingBag, route: '/activity/log' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carbon Impact</Text>
      </View>

      <Card style={styles.carbonCard}>
        <View style={styles.carbonHeader}>
          <View>
            <Text style={styles.carbonLabel}>Total CO₂ Saved</Text>
            <Text style={styles.carbonValue}>{user.totalCO2Saved || 0}kg</Text>
          </View>
          <TouchableOpacity style={styles.timeframeSelector}>
            <Text style={styles.timeframeText}>{timeframe}</Text>
          </TouchableOpacity>
        </View>
        
        <ProgressBar 
          progress={user.totalCO2Saved || 0} 
          total={200} 
          color={Colors.primary}
          backgroundColor="rgba(76, 175, 80, 0.2)"
        />
        <Text style={styles.goalText}>Goal 200kg CO₂</Text>
        
        <View style={styles.timeframeRow}>
          <View style={styles.timeframeItem}>
            <Text style={styles.timeframeLabel}>Daily</Text>
            <Text style={styles.timeframeValue}>4.2kg</Text>
          </View>
          <View style={styles.timeframeItem}>
            <Text style={styles.timeframeLabel}>Weekly</Text>
            <Text style={styles.timeframeValue}>28.5kg</Text>
          </View>
          <View style={styles.timeframeItem}>
            <Text style={styles.timeframeLabel}>Monthly</Text>
            <Text style={styles.timeframeValue}>{user.totalCO2Saved || 0}kg</Text>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eco Actions</Text>
        <View style={styles.actionsGrid}>
          {ECO_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionItem}
              onPress={() => router.push({ pathname: '/activity/log', params: { type: action.label.toLowerCase().replace(/ /g, '-') } })}
            >
              <View style={styles.actionIcon}>
                <action.icon size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, feedTab === 'my' && styles.activeTab]}
            onPress={() => setFeedTab('my')}
          >
            <Text style={[styles.tabText, feedTab === 'my' && styles.activeTabText]}>My Actions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, feedTab === 'community' && styles.activeTab]}
            onPress={() => setFeedTab('community')}
          >
            <Text style={[styles.tabText, feedTab === 'community' && styles.activeTabText]}>Community Actions</Text>
          </TouchableOpacity>
        </View>
        {feedTab === 'my' ? (
          loading ? <Text>Loading...</Text> :
          error ? <Text style={{ color: 'red' }}>{error}</Text> :
          myActions.length === 0 ? <Text style={{ color: Colors.textLight, marginTop: 16 }}>Your logged eco actions will appear here.</Text> :
          myActions.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          loading ? <Text>Loading...</Text> :
          communityActions.length === 0 ? <Text style={{ color: Colors.textLight, marginTop: 16 }}>No actions to vote on right now.</Text> :
          communityActions.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} showVoteButton onVote={() => router.push({ pathname: '/activity/vote', params: { id: activity.id } })} />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity History</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Activities' && styles.activeTab]}
            onPress={() => setActiveTab('Activities')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'Activities' && styles.activeTabText
              ]}
            >
              Activities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Statistics' && styles.activeTab]}
            onPress={() => setActiveTab('Statistics')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'Statistics' && styles.activeTabText
              ]}
            >
              Statistics
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'Activities' ? (
          <>
            {user.activities?.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </>
        ) : (
          <Card style={styles.statisticsCard}>
            <Text style={styles.statisticsTitle}>Carbon Savings by Activity</Text>
            
            <View style={styles.statItem}>
              <View style={styles.statLabel}>
                <View style={[styles.statDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.statText}>Recycling</Text>
              </View>
              <Text style={styles.statValue}>45kg CO₂</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statLabel}>
                <View style={[styles.statDot, { backgroundColor: '#81C784' }]} />
                <Text style={styles.statText}>Cycling</Text>
              </View>
              <Text style={styles.statValue}>32kg CO₂</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statLabel}>
                <View style={[styles.statDot, { backgroundColor: '#AED581' }]} />
                <Text style={styles.statText}>Public Transport</Text>
              </View>
              <Text style={styles.statValue}>28kg CO₂</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statLabel}>
                <View style={[styles.statDot, { backgroundColor: '#C5E1A5' }]} />
                <Text style={styles.statText}>Energy Saving</Text>
              </View>
              <Text style={styles.statValue}>15kg CO₂</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={styles.statLabel}>
                <View style={[styles.statDot, { backgroundColor: '#E6EE9C' }]} />
                <Text style={styles.statText}>Plant-based Meals</Text>
              </View>
              <Text style={styles.statValue}>5kg CO₂</Text>
            </View>
          </Card>
        )}
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
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
  },
  carbonCard: {
    margin: 16,
  },
  carbonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  },
  timeframeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeframeText: {
    marginRight: 8,
    color: Colors.text,
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
    marginTop: 16,
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
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
  statisticsCard: {
    padding: 16,
  },
  statisticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statText: {
    fontSize: 14,
    color: Colors.text,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionItem: {
    width: '45%', // Adjust as needed for two columns
    alignItems: 'center',
    marginVertical: 8,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
});