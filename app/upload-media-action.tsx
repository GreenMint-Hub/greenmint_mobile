import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';

const ACTION_TYPES = [
  { label: 'Recycling', value: 'recycling' },
  { label: 'Bus Ride', value: 'bus' },
  { label: 'Other', value: 'other' },
];

export default function UploadMediaAction() {
  const [actionType, setActionType] = useState('recycling');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMedia(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!media) {
      Alert.alert('Please select a photo or video.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'web' ? media.uri : media.uri,
        name: media.fileName || 'upload.jpg',
        type: media.type || 'image/jpeg',
      } as any);
      formData.append('actionType', actionType);
      formData.append('description', description);
      const res = await axios.post(`${API_CONFIG.API_URL}/activity/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setResult('Media action uploaded! Status: ' + (res.data.activity.status || 'voting'));
    } catch (err: any) {
      setResult('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Media-Based Eco Action</Text>
      <Text style={styles.label}>Action Type</Text>
      <View style={styles.row}>
        {ACTION_TYPES.map((a) => (
          <TouchableOpacity
            key={a.value}
            style={[styles.typeButton, actionType === a.value && styles.typeButtonActive]}
            onPress={() => setActionType(a.value)}
          >
            <Text style={actionType === a.value ? styles.typeTextActive : styles.typeText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your action..."
      />
      <Button
        title={media ? 'Change Photo/Video' : 'Pick Photo/Video'}
        variant="outline"
        onPress={pickMedia}
        style={styles.button}
      />
      {media && (
        <Text style={styles.mediaInfo}>Selected: {media.fileName || media.uri}</Text>
      )}
      <Button
        title={loading ? 'Uploading...' : 'Upload Action'}
        variant="primary"
        onPress={handleSubmit}
        disabled={loading}
        style={styles.button}
      />
      {result && <Text style={styles.result}>{result}</Text>}
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
  label: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.border,
    marginRight: 8,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
  },
  typeText: {
    color: Colors.text,
    fontWeight: '500',
  },
  typeTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
  mediaInfo: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  result: {
    marginTop: 24,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
}); 