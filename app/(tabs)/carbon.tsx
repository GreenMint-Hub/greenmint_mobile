import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import ActivityCard from '@/components/ActivityCard';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import StatisticsComponent from '@/components/StatisticsComponent';
import { ChevronDown } from 'lucide-react-native';

export default function CarbonScreen() {
  const router = useRouter();
  const { user, loadUserData } = useUserStore();
  const [timeframe, setTimeframe] = useState('This Week');
  const [activeTab, setActiveTab] = useState('Activities');

  useEffect(() => {
    loadUserData();
  }, []);

  const navigateToLogActivity = () => {
    router.push('/activity/log');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.carbonCard}>
        <View style={styles.carbonHeader}>
          <View>
            <Text style={styles.carbonLabel}>Total CO₂ Saved</Text>
            <Text style={styles.carbonValue}>{user.totalCO2Saved}kg</Text>
          </View>
          <TouchableOpacity style={styles.timeframeSelector}>
            <Text style={styles.timeframeText}>{timeframe}</Text>
            <ChevronDown size={16} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <ProgressBar 
          progress={user.totalCO2Saved} 
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
            <Text style={styles.timeframeValue}>{user.totalCO2Saved}kg</Text>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Log Eco Action</Text>
        <Button 
          title="Log New Activity" 
          variant="primary" 
          onPress={navigateToLogActivity}
        />
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
            {user.activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </>
        ) : (
          <StatisticsComponent data={{ totalCO2Saved: user.totalCO2Saved, activities: user.activities }} />
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
});