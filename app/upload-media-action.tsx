import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';
import EcoActionCapture from '@/components/EcoActionCapture';
import { useRouter } from 'expo-router';

const ACTION_TYPES = [
  { label: 'Recycling', value: 'recycling' },
  { label: 'Public Transport', value: 'publicTransport' },
  { label: 'Plant-based Meal', value: 'plantBasedMeal' },
  { label: 'Energy Saving', value: 'energySaving' },
  { label: 'Second-hand Purchase', value: 'secondHandPurchase' },
  { label: 'Other', value: 'other' },
];

export default function UploadMediaAction() {
  const router = useRouter();
  const [selectedActionType, setSelectedActionType] = useState('recycling');
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
      
      const res = await axios.post(`${API_CONFIG.API_URL}/activity/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      Alert.alert('Success!', 'Your eco-friendly action has been submitted for community review.');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit action. Please try again.');
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (showActionCapture) {
    return (
      <EcoActionCapture
        actionType={selectedActionType}
        onActionSubmitted={handleActionSubmitted}
        onClose={handleClose}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Eco-Friendly Action</Text>
      <Text style={styles.subtitle}>
        Take a photo of your eco-friendly action and share it with the community
      </Text>

      <View style={styles.actionTypesContainer}>
        {ACTION_TYPES.map((actionType) => (
          <TouchableOpacity
            key={actionType.value}
            style={[
              styles.actionTypeCard,
              selectedActionType === actionType.value && styles.selectedActionTypeCard
            ]}
            onPress={() => setSelectedActionType(actionType.value)}
          >
            <Text style={[
              styles.actionTypeText,
              selectedActionType === actionType.value && styles.selectedActionTypeText
            ]}>
              {actionType.label}
            </Text>
            {selectedActionType === actionType.value && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setShowActionCapture(true)}
        >
          <Text style={styles.startButtonText}>Start Capturing Action</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  actionTypesContainer: {
    marginBottom: 32,
  },
  actionTypeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedActionTypeCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  actionTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedActionTypeText: {
    color: '#007AFF',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  startButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 