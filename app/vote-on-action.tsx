import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';

const VOTE_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Fake', value: 'fake' },
  { label: 'Spam', value: 'spam' },
];

export default function VoteOnAction() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<{ [id: string]: string }>({});

  const fetchActions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_CONFIG.API_URL}/users/actions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setActions(res.data.filter((a: any) => a.status === 'voting'));
    } catch (err) {
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleVote = async (actionId: string, value: string) => {
    setVoteStatus((prev) => ({ ...prev, [actionId]: 'loading' }));
    try {
      await axios.post(`${API_CONFIG.API_URL}/activity/${actionId}/vote`, { value }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setVoteStatus((prev) => ({ ...prev, [actionId]: 'voted' }));
      fetchActions();
    } catch (err: any) {
      setVoteStatus((prev) => ({ ...prev, [actionId]: 'error' }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Community Voting</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : actions.length === 0 ? (
        <Text style={styles.noActions}>No actions to vote on right now.</Text>
      ) : (
        actions.map((action) => (
          <View key={action._id} style={styles.card}>
            <Text style={styles.actionType}>{action.type}</Text>
            {action.mediaUrl && (
              <Text style={styles.mediaUrl}>Media: {action.mediaUrl}</Text>
            )}
            <Text style={styles.description}>{action.description}</Text>
            <View style={styles.voteRow}>
              {VOTE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  title={opt.label}
                  variant={voteStatus[action._id] === 'voted' ? 'outline' : 'primary'}
                  onPress={() => handleVote(action._id, opt.value)}
                  disabled={voteStatus[action._id] === 'voted' || voteStatus[action._id] === 'loading'}
                  style={styles.voteButton}
                />
              ))}
            </View>
            {voteStatus[action._id] === 'voted' && <Text style={styles.voted}>Thank you for voting!</Text>}
            {voteStatus[action._id] === 'loading' && <ActivityIndicator size="small" color={Colors.primary} />}
            {voteStatus[action._id] === 'error' && <Text style={styles.error}>Error voting. Try again.</Text>}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 24,
  },
  noActions: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 32,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionType: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  mediaUrl: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  voteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  voteButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  voted: {
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  error: {
    color: '#e74c3c',
    marginTop: 8,
  },
}); 