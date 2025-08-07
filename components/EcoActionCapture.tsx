import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import CameraCapture from './CameraCapture';

interface EcoActionCaptureProps {
  actionType: string;
  onActionSubmitted: (actionData: any) => void;
  onClose: () => void;
}

const ACTION_TYPES = [
  { label: 'Recycling', value: 'recycling', icon: 'reload', color: '#4CAF50' },
  { label: 'Public Transport', value: 'publicTransport', icon: 'bus', color: '#2196F3' },
  { label: 'Plant-based Meal', value: 'plantBasedMeal', icon: 'leaf', color: '#8BC34A' },
  { label: 'Energy Saving', value: 'energySaving', icon: 'bulb', color: '#FF9800' },
  { label: 'Second-hand Purchase', value: 'secondHandPurchase', icon: 'bag', color: '#9C27B0' },
  { label: 'Other', value: 'other', icon: 'add-circle', color: '#607D8B' },
];

export default function EcoActionCapture({ actionType, onActionSubmitted, onClose }: EcoActionCaptureProps) {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentStep, setCurrentStep] = useState<'capture' | 'describe' | 'submit'>('capture');

  const handleImageCaptured = (image: any) => {
    setMedia(image);
    setShowCamera(false);
    setCurrentStep('describe');
  };

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMedia(result.assets[0]);
      setCurrentStep('describe');
    }
  };

  const handleSubmit = async () => {
    if (!media) {
      Alert.alert('Missing Photo', 'Please take a photo of your eco-friendly action.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please describe your eco-friendly action.');
      return;
    }

    setLoading(true);
    try {
      const actionData = {
        actionType,
        media,
        description: description.trim(),
        timestamp: new Date().toISOString(),
      };

      onActionSubmitted(actionData);
      
      // Reset form
      setMedia(null);
      setDescription('');
      setCurrentStep('capture');
      
      Alert.alert('Success!', 'Your eco-friendly action has been submitted for community review.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getActionTypeInfo = () => {
    return ACTION_TYPES.find(type => type.value === actionType) || ACTION_TYPES[0];
  };

  const actionInfo = getActionTypeInfo();

  if (showCamera) {
    return (
      <CameraCapture
        onImageCaptured={handleImageCaptured}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>Log Eco Action</Text>
        <View style={styles.actionTypeContainer}>
          <View style={[styles.actionTypeIcon, { backgroundColor: actionInfo.color }]}>
            <Ionicons name={actionInfo.icon as any} size={20} color="white" />
          </View>
          <Text style={styles.actionTypeText}>{actionInfo.label}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'capture' && (
          <View style={styles.captureStep}>
            <View style={styles.captureCard}>
              <Ionicons name="camera" size={60} color="#007AFF" />
              <Text style={styles.captureTitle}>Take a Photo</Text>
              <Text style={styles.captureSubtitle}>
                Capture your eco-friendly action to share with the community
              </Text>
              
              <View style={styles.captureButtons}>
                <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
                  <Ionicons name="camera" size={24} color="white" />
                  <Text style={styles.captureButtonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.galleryButton} onPress={handlePickFromGallery}>
                  <Ionicons name="images" size={24} color="#007AFF" />
                  <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {currentStep === 'describe' && media && (
          <View style={styles.describeStep}>
            <View style={styles.imagePreview}>
              <Image source={{ uri: media.uri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.retakeButton} 
                onPress={() => setCurrentStep('capture')}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Describe your action</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell us about your eco-friendly action..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Button
              title={loading ? 'Submitting...' : 'Submit Action'}
              variant="primary"
              onPress={handleSubmit}
              disabled={loading || !description.trim()}
              style={styles.submitButton}
            />
          </View>
        )}
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
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  captureStep: {
    flex: 1,
    justifyContent: 'center',
  },
  captureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  captureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  captureSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  captureButtons: {
    width: '100%',
  },
  captureButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  galleryButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  galleryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  describeStep: {
    flex: 1,
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  retakeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 100,
  },
  submitButton: {
    marginTop: 'auto',
  },
}); 