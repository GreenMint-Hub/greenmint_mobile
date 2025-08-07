
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useUserStore } from '@/store/userStore';
import { API_CONFIG } from '@/constants/api';
import * as ImagePicker from 'expo-image-picker';

export default function UploadMediaScreen() {
  const router = useRouter();
  const { token } = useUserStore();
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image || !description.trim()) {
      Alert.alert('Error', 'Please take a photo and provide a description');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        name: 'action.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('description', description);
      const res = await fetch(`${API_CONFIG.API_URL}/activity/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      Alert.alert('Success', 'Action uploaded!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Media Action</Text>
      <Text style={styles.subtitle}>Take a photo of your eco-friendly action and share it with the community</Text>
      <View style={styles.form}>
        <TouchableOpacity onPress={handleTakePhoto} style={[styles.button, { backgroundColor: Colors.primary }]}> 
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>{image ? 'Retake Photo' : 'Take Photo'}</Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200, alignSelf: 'center', borderRadius: 12, marginVertical: 12 }} />
        )}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe your eco-friendly action..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <Button
          title={uploading ? 'Uploading...' : 'Upload Action'}
          onPress={handleUpload}
          disabled={uploading}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 16,
  },
}); 