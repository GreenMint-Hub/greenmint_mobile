import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';
import EcoActionCapture from '@/components/EcoActionCapture';

const ECO_ACTIONS = [
  { id: 'recycling', title: 'Recycling', icon: 'reload', color: '#4CAF50', points: 10 },
  { id: 'publicTransport', title: 'Public Transport', icon: 'bus', color: '#2196F3', points: 15 },
  { id: 'plantBasedMeal', title: 'Plant-based Meal', icon: 'leaf', color: '#8BC34A', points: 12 },
  { id: 'energySaving', title: 'Energy Saving', icon: 'bulb', color: '#FF9800', points: 8 },
  { id: 'secondHandPurchase', title: 'Second-hand Purchase', icon: 'bag', color: '#9C27B0', points: 10 },
  { id: 'other', title: 'Other', icon: 'add-circle', color: '#607D8B', points: 5 },
];

export default function EcoActionPage() {
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [showActionCapture, setShowActionCapture] = useState(false);

  const handleActionSubmitted = async (actionData: any) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'web' ? actionData.media.uri : actionData.media.uri,
        name: actionData.media.fileName || 'upload.jpg',
        type: actionData.media.type || 'image/jpeg',
      } as any);
      formData.append('actionType', actionData.actionType);
      formData.append('description', actionData.description);
      
      await axios.post(`${API_CONFIG.API_URL}/activity/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      Alert.alert('Success!', 'Your eco-friendly action has been submitted for community review.');
      setSelectedAction(null);
      setShowActionCapture(false);
      router.back();
    } catch (err: any) {
      Alert.alert('Error', 'Failed to submit action. Please try again.');
    }
  };

  if (showActionCapture && selectedAction) {
    return (
      <EcoActionCapture
        actionType={selectedAction.id}
        onActionSubmitted={handleActionSubmitted}
        onClose={() => {
          setSelectedAction(null);
          setShowActionCapture(false);
          router.back();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Eco Action</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Choose Your Action</Text>
        <Text style={styles.subtitle}>
          Take a photo of your eco-friendly action and share it with the community
        </Text>

        <View style={styles.actionsGrid}>
          {ECO_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => {
                setSelectedAction(action);
                setShowActionCapture(true);
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={24} color="white" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.pointsText}>{action.points} points</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 14,
    color: '#666',
  },
}); 