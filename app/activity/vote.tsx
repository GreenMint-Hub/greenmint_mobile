import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Button from '@/components/Button';
import { API_CONFIG } from '@/constants/api';
import Colors from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';

const VOTE_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Fake', value: 'fake' },
  { label: 'Spam', value: 'spam' },
];

export default function VoteScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<'idle' | 'voting' | 'voted' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    fetch(`${API_CONFIG.API_URL}/activity/${params.id}`, {
      headers: { Authorization: `Bearer ${useUserStore.getState().token}` },
    })
      .then(res => res.json())
      .then(data => setActivity(data))
      .catch(() => setError('Failed to load activity'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleVote = async (value: string) => {
    setVoteStatus('voting');
    try {
      const res = await fetch(`${API_CONFIG.API_URL}/activity/${params.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useUserStore.getState().token}`,
        },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error('Vote failed');
      setVoteStatus('voted');
      Alert.alert('Thank you for voting!');
    } catch (e) {
      setVoteStatus('error');
      Alert.alert('Error', 'Failed to submit vote.');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color={Colors.primary} />;
  if (error) return <Text style={{ color: 'red', marginTop: 40 }}>{error}</Text>;
  if (!activity) return <Text style={{ marginTop: 40 }}>Activity not found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.description}>{activity.description}</Text>
      <Text style={styles.label}>Type: {activity.type}</Text>
      <Text style={styles.label}>CO₂ Saved: {activity.co2Saved}kg</Text>
      <Text style={styles.label}>Points: {activity.points}</Text>
      <Text style={styles.label}>Status: {activity.status}</Text>
      <View style={styles.voteRow}>
        {VOTE_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            title={opt.label}
            variant="primary"
            onPress={() => handleVote(opt.value)}
            disabled={voteStatus === 'voting' || voteStatus === 'voted'}
            style={styles.voteButton}
          />
        ))}
      </View>
      {voteStatus === 'voted' && <Text style={styles.voted}>Thank you for voting!</Text>}
      {voteStatus === 'error' && <Text style={styles.error}>Error voting. Try again.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    color: Colors.textLight,
    marginBottom: 4,
  },
  voteRow: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 8,
  },
  voteButton: {
    marginHorizontal: 6,
  },
  voted: {
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 16,
  },
  error: {
    color: '#e74c3c',
    marginTop: 16,
  },
}); 