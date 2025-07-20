import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useChallengeStore } from '@/store/challengeStore';
import { useToast } from '@/hooks/useToast';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Bike, Bus, Recycle, Lightbulb, Leaf, ShoppingBag, Camera, Upload } from 'lucide-react-native';
import { EcoActivity } from '@/types';

export default function LogActivityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const challengeId = params.challengeId as string;
  
  const { addActivity } = useUserStore();
  const { updateProgress } = useChallengeStore();
  const { toast, showToast, hideToast } = useToast();
  
  const [selectedType, setSelectedType] = useState<EcoActivity['type']>('cycling');
  const [description, setDescription] = useState('');
  const [co2Saved, setCo2Saved] = useState('');
  const [evidence, setEvidence] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getActivityTitle = () => {
    switch (selectedType) {
      case 'cycling':
        return 'Cycled to work/school';
      case 'publicTransport':
        return 'Used public transport';
      case 'recycling':
        return 'Recycled waste';
      case 'energySaving':
        return 'Saved energy';
      case 'plantBasedMeal':
        return 'Had plant-based meal';
      case 'secondHandPurchase':
        return 'Purchased second-hand item';
      default:
        return 'Eco-friendly activity';
    }
  };

  const getPoints = () => {
    const co2Value = parseFloat(co2Saved);
    if (isNaN(co2Value)) return 0;
    return Math.round(co2Value * 10);
  };

  const handleUploadEvidence = () => {
    Alert.alert(
      'Upload Evidence',
      'Choose evidence type',
      [
        { text: 'Take Photo', onPress: () => handleCameraCapture() },
        { text: 'Record Video', onPress: () => handleVideoCapture() },
        { text: 'Choose from Gallery', onPress: () => handleGalleryPick() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    const newEvidence = `photo_${Date.now()}.jpg`;
    setEvidence([...evidence, newEvidence]);
    showToast('Photo captured successfully', 'success');
  };

  const handleVideoCapture = () => {
    // In a real app, this would open the video recorder
    const newEvidence = `video_${Date.now()}.mp4`;
    setEvidence([...evidence, newEvidence]);
    showToast('Video recorded successfully', 'success');
  };

  const handleGalleryPick = () => {
    // In a real app, this would open the gallery
    const newEvidence = `gallery_${Date.now()}.jpg`;
    setEvidence([...evidence, newEvidence]);
    showToast('Image selected from gallery', 'success');
  };

  const removeEvidence = (index: number) => {
    const newEvidence = evidence.filter((_, i) => i !== index);
    setEvidence(newEvidence);
    showToast('Evidence removed', 'info');
  };

  const handleSubmit = async () => {
    if (!description) {
      showToast('Please provide a description of your activity', 'error');
      return;
    }

    if (!co2Saved || isNaN(parseFloat(co2Saved))) {
      showToast('Please enter a valid CO₂ saved amount', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const newActivity = {
        type: selectedType,
        title: getActivityTitle(),
        description,
        co2Saved: parseFloat(co2Saved),
        points: getPoints(),
        verified: evidence.length > 0, // Auto-verify if evidence is provided
        date: new Date().toISOString(),
      };
      
      await addActivity(newActivity);
      
      // If this activity is for a challenge, update the challenge progress
      if (challengeId) {
        await updateProgress(challengeId, 10); // Increase progress by 10%
        showToast('Challenge progress updated!', 'success');
      }
      
      showToast(`Activity logged! You earned ${getPoints()} points.`, 'success');
      
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      showToast('Failed to log activity. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Toast 
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Log Eco Action</Text>
          <Text style={styles.subtitle}>
            Track your eco-friendly activities and earn points
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Type</Text>
          <View style={styles.activityTypesContainer}>
            <TouchableOpacity 
              style={[
                styles.activityTypeItem,
                selectedType === 'cycling' && styles.selectedActivityType
              ]}
              onPress={() => setSelectedType('cycling')}
            >
              <View style={styles.activityTypeIcon}>
                <Bike 
                  size={24} 
                  color={selectedType === 'cycling' ? Colors.white : Colors.primary} 
                />
              </View>
              <Text 
                style={[
                  styles.activityTypeText,
                  selectedType === 'cycling' && styles.selectedActivityTypeText
                ]}
              >
                Cycling
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.activityTypeItem,
                selectedType === 'publicTransport' && styles.selectedActivityType
              ]}
              onPress={() => setSelectedType('publicTransport')}
            >
              <View style={styles.activityTypeIcon}>
                <Bus 
                  size={24} 
                  color={selectedType === 'publicTransport' ? Colors.white : Colors.primary} 
                />
              </View>
              <Text 
                style={[
                  styles.activityTypeText,
                  selectedType === 'publicTransport' && styles.selectedActivityTypeText
                ]}
              >
                Public Transport
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.activityTypeItem,
                selectedType === 'recycling' && styles.selectedActivityType
              ]}
              onPress={() => setSelectedType('recycling')}
            >
              <View style={styles.activityTypeIcon}>
                <Recycle 
                  size={24} 
                  color={selectedType === 'recycling' ? Colors.white : Colors.primary} 
                />
              </View>
              <Text 
                style={[
                  styles.activityTypeText,
                  selectedType === 'recycling' && styles.selectedActivityTypeText
                ]}
              >
                Recycling
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.activityTypeItem,
                selectedType === 'energySaving' && styles.selectedActivityType
              ]}
              onPress={() => setSelectedType('energySaving')}
            >
              <View style={styles.activityTypeIcon}>
                <Lightbulb 
                  size={24} 
                  color={selectedType === 'energySaving' ? Colors.white : Colors.primary} 
                />
              </View>
              <Text 
                style={[
                  styles.activityTypeText,
                  selectedType === 'energySaving' && styles.selectedActivityTypeText
                ]}
              >
                Energy Saving
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.activityTypeItem,
                selectedType === 'plantBasedMeal' && styles.selectedActivityType
              ]}
              onPress={() => setSelectedType('plantBasedMeal')}
            >
              <View style={styles.activityTypeIcon}>
                <Leaf 
                  size={24} 
                  color={selectedType === 'plantBasedMeal' ? Colors.white : Colors.primary} 
                />
              </View>
              <Text 
                style={[
                  styles.activityTypeText,
                  selectedType === 'plantBasedMeal' && styles.selectedActivityTypeText
                ]}
              >
                Plant Based Meal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.activityTypeItem,
                selectedType === 'secondHandPurchase' && styles.selectedActivityType
              ]}
              onPress={() => setSelectedType('secondHandPurchase')}
            >
              <View style={styles.activityTypeIcon}>
                <ShoppingBag 
                  size={24} 
                  color={selectedType === 'secondHandPurchase' ? Colors.white : Colors.primary} 
                />
              </View>
              <Text 
                style={[
                  styles.activityTypeText,
                  selectedType === 'secondHandPurchase' && styles.selectedActivityTypeText
                ]}
              >
                Second-hand Purchase
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Describe your activity"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.textLight}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>CO₂ Saved (kg)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter estimated CO₂ saved"
              value={co2Saved}
              onChangeText={setCo2Saved}
              keyboardType="numeric"
              placeholderTextColor={Colors.textLight}
            />
          </View>
          
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Points you'll earn:</Text>
            <Text style={styles.pointsValue}>{getPoints()} points</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Evidence (Optional)</Text>
          <Text style={styles.sectionDescription}>
            Upload photos or videos to verify your activity and get instant verification
          </Text>
          
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUploadEvidence}
          >
            <Upload size={20} color={Colors.primary} />
            <Text style={styles.uploadButtonText}>Add Photo or Video</Text>
          </TouchableOpacity>
          
          {evidence.length > 0 && (
            <View style={styles.evidenceContainer}>
              <Text style={styles.evidenceTitle}>Uploaded Evidence:</Text>
              {evidence.map((item, index) => (
                <View key={index} style={styles.evidenceItem}>
                  <Camera size={16} color={Colors.primary} />
                  <Text style={styles.evidenceText}>{item}</Text>
                  <TouchableOpacity 
                    onPress={() => removeEvidence(index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Submit Activity" 
            variant="primary" 
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          />
          <Button 
            title="Cancel" 
            variant="outline" 
            onPress={() => router.back()}
            style={styles.cancelButton}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  activityTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityTypeItem: {
    width: '48%',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectedActivityType: {
    backgroundColor: Colors.primary,
  },
  activityTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTypeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedActivityTypeText: {
    color: Colors.white,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  pointsLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  evidenceContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  evidenceText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeButtonText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  cancelButton: {
    marginTop: 12,
  },
});