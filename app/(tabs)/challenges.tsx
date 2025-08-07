
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_CONFIG } from '@/constants/api';
import { useUserStore } from '@/store/userStore';
import Button from '@/components/Button';

export default function ChallengesScreen() {
  const { user, token } = useUserStore();
  const params = useLocalSearchParams();
  const [tab, setTab] = useState<'available' | 'my' | 'completed' | 'admin'>(
    (params?.tab as any) || 'available'
  );
  const [available, setAvailable] = useState<any[]>([]);
  const [myChallenges, setMyChallenges] = useState<any[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([]);
  const [allChallenges, setAllChallenges] = useState<any[]>([]); // For admin
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', goalPoints: '', startDate: '', endDate: '' });
  const [createError, setCreateError] = useState('');

  // Fetch available, my, completed, and all challenges
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const [availRes, myRes, completedRes, allRes] = await Promise.all([
        fetch(`${API_CONFIG.API_URL}/challenge/available`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.json()),
        fetch(`${API_CONFIG.API_URL}/challenge/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.json()),
        fetch(`${API_CONFIG.API_URL}/challenge/completed`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.json()),
        user?.role === 'admin'
          ? fetch(`${API_CONFIG.API_URL}/challenge`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then(r => r.json())
          : Promise.resolve([]),
      ]);
      setAvailable(Array.isArray(availRes) ? availRes : []);
      setMyChallenges(Array.isArray(myRes) ? myRes : []);
      setCompletedChallenges(Array.isArray(completedRes) ? completedRes : []);
      setAllChallenges(Array.isArray(allRes) ? allRes : []);
    } catch (e) {
      Alert.alert('Error', 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  // Join a challenge
  const joinChallenge = async (id: string) => {
    console.log('Attempting to join challenge:', id);
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.API_URL}/challenge/join/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ userId: user?.id })
      });
      console.log('Join challenge response status:', res.status);
      if (!res.ok) {
        let errMsg = 'Failed to join challenge';
        try {
          const err = await res.json();
          errMsg = err.message || errMsg;
          console.log('Join challenge error:', err);
        } catch (e) {
          console.log('Failed to parse error response');
        }
        Alert.alert('Error', errMsg);
        throw new Error(errMsg);
      }
      const result = await res.json();
      console.log('Join challenge success:', result);
      Alert.alert('Joined!', 'You have joined the challenge.');
      fetchChallenges();
    } catch (e) {
      console.log('Join challenge exception:', e);
      Alert.alert('Error', 'Failed to join challenge');
    } finally {
      setLoading(false);
    }
  };

  // Fetch challenge details
  const fetchChallengeDetails = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.API_URL}/challenge/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelected(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load challenge details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.API_URL}/challenge/leaderboard/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelected((prev: any) => ({ ...prev, leaderboard: data }));
    } catch (e) {
      Alert.alert('Error', 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Admin: Create challenge
  const createChallenge = async () => {
    setCreateError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.API_URL}/challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: createForm.name,
          description: createForm.description,
          goalPoints: Number(createForm.goalPoints),
          startDate: createForm.startDate,
          endDate: createForm.endDate,
        }),
      });
      if (!res.ok) {
        let errMsg = 'Failed to create challenge';
        try {
          const err = await res.json();
          errMsg = err.message || errMsg;
        } catch {}
        setCreateError(errMsg);
        throw new Error(errMsg);
      }
      setCreateForm({ name: '', description: '', goalPoints: '', startDate: '', endDate: '' });
      fetchChallenges();
      Alert.alert('Success', 'Challenge created!');
    } catch (e: any) {
      setCreateError(e.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  // UI for a single challenge card
  const ChallengeCard = ({ challenge, joined }: { challenge: any; joined?: boolean }) => {
    const isCompleted = challenge.status === 'completed' || new Date(challenge.endDate) < new Date();
    const isExpired = new Date(challenge.endDate) < new Date();
    const canJoin = !isCompleted && !joined;
    // Find winner's name if available
    let winnerName = '';
    if (challenge.winner) {
      // Handle different winner formats
      if (typeof challenge.winner === 'object' && challenge.winner.username) {
        winnerName = challenge.winner.username;
      } else if (typeof challenge.winner === 'object' && challenge.winner.name) {
        winnerName = challenge.winner.name;
      } else if (typeof challenge.winner === 'object' && challenge.winner.email) {
        winnerName = challenge.winner.email;
      } else if (challenge.participants) {
        // Try to find winner in participants
        const winner = challenge.participants.find((p: any) => {
          if (typeof challenge.winner === 'object' && challenge.winner._id) {
            return p.user?._id === challenge.winner._id;
          }
          return p.user?._id === challenge.winner || p.user === challenge.winner;
        });
        if (winner && winner.user) {
          winnerName = winner.user.username || winner.user.email || winner.user.name || 'Unknown User';
        }
      }
      
      // Fallback if still no name found
      if (!winnerName) {
        winnerName = typeof challenge.winner === 'string' ? challenge.winner : 'Unknown User';
      }
    }
    return (
      <TouchableOpacity
        style={[styles.card, isCompleted && { backgroundColor: '#e8f5e8' }]}
        onPress={() => joined ? fetchChallengeDetails(challenge._id) : null}
        activeOpacity={joined ? 0.7 : 1}
      >
        <Text style={styles.title}>{challenge.name}</Text>
        <Text style={styles.desc}>{challenge.description}</Text>
        <Text style={styles.info}>Goal: {challenge.goalPoints} points</Text>
        <Text style={styles.info}>Ends: {new Date(challenge.endDate).toLocaleString()}</Text>
        {joined ? (
          <View>
            <Text style={[styles.info, { color: isCompleted ? '#4CAF50' : '#FF9800' }]}>
              Status: {isCompleted ? 'Completed' : 'Active'}
            </Text>
            {isExpired && challenge.status !== 'completed' && (
              <Text style={[styles.info, { color: '#FF9800' }]}>Challenge ended - winner will be determined</Text>
            )}
            {isCompleted && winnerName && (
              <Text style={[styles.info, { color: '#4CAF50', fontWeight: 'bold' }]}>🏆 Winner: {winnerName}</Text>
            )}
          </View>
        ) : (
          <View>
            {canJoin ? (
              <Button title="Join" onPress={() => joinChallenge(challenge._id)} />
            ) : (
              <Text style={[styles.info, { color: '#999', fontStyle: 'italic' }]}>
                {isCompleted ? 'Challenge Completed' : 'Already Joined'}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // UI for challenge details and leaderboard
  const ChallengeDetails = ({ challenge }: { challenge: any }) => {
    const currentUser = challenge.participants?.find((p: any) => p.user?._id === user?.id || p.user === user?.id);
    const userProgress = currentUser?.points || 0;
    const progressPercentage = Math.min((userProgress / challenge.goalPoints) * 100, 100);
    
    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{challenge.name}</Text>
        <Text style={styles.desc}>{challenge.description}</Text>
        <Text style={styles.info}>Goal: {challenge.goalPoints} points</Text>
        <Text style={styles.info}>Ends: {new Date(challenge.endDate).toLocaleString()}</Text>
        <Text style={styles.info}>Status: {challenge.status}</Text>
        
        {currentUser && (
          <View style={{ marginTop: 12, marginBottom: 12 }}>
            <Text style={[styles.info, { fontWeight: 'bold' }]}>Your Progress</Text>
            <Text style={styles.info}>Your Points: {userProgress} / {challenge.goalPoints}</Text>
            <View style={{ 
              width: '100%', 
              height: 8, 
              backgroundColor: '#e0e0e0', 
              borderRadius: 4,
              marginTop: 4 
            }}>
              <View style={{ 
                width: `${progressPercentage}%`, 
                height: '100%', 
                backgroundColor: '#4CAF50', 
                borderRadius: 4 
              }} />
            </View>
            <Text style={[styles.info, { fontSize: 12 }]}>
              {progressPercentage.toFixed(1)}% Complete
            </Text>
          </View>
        )}
        
        {/* Show participants and their points */}
        {challenge.participants && challenge.participants.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.leaderboardTitle}>Participants</Text>
            {challenge.participants.map((p: any, i: number) => (
              <Text key={p.user?._id || i} style={styles.leaderboardEntry}>
                {i + 1}. {(p.user && (p.user.username || p.user.email)) || 'Unknown User'} - {p.points} points
                {challenge.winner && challenge.winner === (p.user && p.user._id) && ' 🏆'}
              </Text>
            ))}
          </View>
        )}
        <Button title="Show Leaderboard" onPress={() => fetchLeaderboard(challenge._id)} style={{ marginVertical: 8 }} />
        {challenge.leaderboard && (
          <View style={styles.leaderboard}>
            <Text style={styles.leaderboardTitle}>Leaderboard</Text>
            {challenge.leaderboard.map((p: any, i: number) => (
              <Text key={p.user?._id || i} style={styles.leaderboardEntry}>
                {i + 1}. {(p.user && (p.user.username || p.user.email)) || 'Unknown User'} - {p.points} points
                {challenge.winner && challenge.winner === (p.user && p.user._id) && ' 🏆'}
              </Text>
            ))}
          </View>
        )}
        <Button title="Back" onPress={() => setSelected(null)} style={{ marginTop: 12 }} />
      </View>
    );
  };

  // Admin: List all challenges
  const AdminChallengeCard = ({ challenge }: { challenge: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => fetchChallengeDetails(challenge._id)}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{challenge.name}</Text>
      <Text style={styles.desc}>{challenge.description}</Text>
      <Text style={styles.info}>Goal: {challenge.goalPoints} points</Text>
      <Text style={styles.info}>Ends: {new Date(challenge.endDate).toLocaleString()}</Text>
      <Text style={styles.info}>Status: {challenge.status}</Text>
    </TouchableOpacity>
  );

  // Only show Admin tab and features if user is admin
  const isAdmin = user?.role === 'admin';

  // Show total points and carbon saved at the top
  const pointsSection = (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Total Points: {user?.ecoPoints || 0}</Text>
      <Text style={{ fontSize: 15, color: '#888' }}>Total Carbon Saved: {(user?.ecoPoints || 0) / 2} kg</Text>
    </View>
  );

  if (!user || !token) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please log in to view challenges.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {pointsSection}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'available' && styles.activeTab]} onPress={() => setTab('available')}>
          <Text style={[styles.tabText, tab === 'available' && styles.activeTabText]}>Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'my' && styles.activeTab]} onPress={() => setTab('my')}>
          <Text style={[styles.tabText, tab === 'my' && styles.activeTabText]}>My Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'completed' && styles.activeTab]} onPress={() => setTab('completed')}>
          <Text style={[styles.tabText, tab === 'completed' && styles.activeTabText]}>Completed Challenges</Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity style={[styles.tab, tab === 'admin' && styles.activeTab]} onPress={() => setTab('admin')}>
            <Text style={[styles.tabText, tab === 'admin' && styles.activeTabText]}>Admin</Text>
          </TouchableOpacity>
        )}
      </View>
      {loading && <Text style={styles.loading}>Loading...</Text>}
      {!loading && selected ? (
        <ChallengeDetails challenge={selected} />
      ) : !loading && tab === 'available' ? (
        available.length === 0 ? <Text style={styles.empty}>No available challenges.</Text> :
        available.map(challenge => <ChallengeCard key={challenge._id} challenge={challenge} />)
      ) : !loading && tab === 'my' ? (
        myChallenges.length === 0 ? <Text style={styles.empty}>You have not joined any challenges yet.</Text> :
        myChallenges.map(challenge => <ChallengeCard key={challenge._id} challenge={challenge} joined />)
      ) : !loading && tab === 'completed' ? (
        completedChallenges.length === 0 ? <Text style={styles.empty}>No completed challenges yet.</Text> :
        completedChallenges.map(challenge => <ChallengeCard key={challenge._id} challenge={challenge} joined />)
      ) : (
        // Admin tab (only visible to admin)
        isAdmin && (
          <View style={{ padding: 16 }}>
            <Text style={styles.title}>Create Challenge</Text>
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.info}>Name</Text>
              <TextInput
                style={styles.input}
                value={createForm.name}
                onChangeText={t => setCreateForm(f => ({ ...f, name: t }))}
                placeholder="Challenge name"
              />
              <Text style={styles.info}>Description</Text>
              <TextInput
                style={styles.input}
                value={createForm.description}
                onChangeText={t => setCreateForm(f => ({ ...f, description: t }))}
                placeholder="Description"
              />
              <Text style={styles.info}>Goal Points</Text>
              <TextInput
                style={styles.input}
                value={createForm.goalPoints}
                onChangeText={t => setCreateForm(f => ({ ...f, goalPoints: t }))}
                placeholder="Points to win"
                keyboardType="numeric"
              />
              <Text style={styles.info}>Start Date</Text>
              <TextInput
                style={styles.input}
                value={createForm.startDate}
                onChangeText={t => setCreateForm(f => ({ ...f, startDate: t }))}
                placeholder="YYYY-MM-DD"
              />
              <Text style={styles.info}>End Date</Text>
              <TextInput
                style={styles.input}
                value={createForm.endDate}
                onChangeText={t => setCreateForm(f => ({ ...f, endDate: t }))}
                placeholder="YYYY-MM-DD"
              />
              {createError ? <Text style={{ color: 'red', marginTop: 4 }}>{createError}</Text> : null}
              <Button title="Create Challenge" onPress={createChallenge} style={{ marginTop: 8 }} />
            </View>
            <Text style={styles.title}>All Challenges</Text>
            {allChallenges.length === 0 ? <Text style={styles.empty}>No challenges found.</Text> :
              allChallenges.map(challenge => <AdminChallengeCard key={challenge._id} challenge={challenge} />)}
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabRow: { flexDirection: 'row', margin: 16, borderRadius: 8, overflow: 'hidden' },
  tab: { flex: 1, padding: 12, backgroundColor: '#eee', alignItems: 'center' },
  activeTab: { backgroundColor: '#4CAF50' },
  tabText: { color: '#333', fontWeight: '500' },
  activeTabText: { color: '#fff' },
  card: { backgroundColor: '#f9f9f9', margin: 12, padding: 16, borderRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  desc: { fontSize: 14, color: '#555', marginBottom: 8 },
  info: { fontSize: 13, color: '#888', marginBottom: 2 },
  loading: { textAlign: 'center', margin: 16 },
  empty: { textAlign: 'center', margin: 24, color: '#aaa' },
  detailsContainer: { margin: 16, padding: 16, backgroundColor: '#f4f4f4', borderRadius: 8 },
  leaderboard: { marginTop: 16, backgroundColor: '#fff', borderRadius: 8, padding: 12 },
  leaderboardTitle: { fontWeight: 'bold', marginBottom: 8 },
  leaderboardEntry: { fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
});

