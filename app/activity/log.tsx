import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useChallengeStore } from '@/store/challengeStore';
import { useUserStore } from '@/store/userStore';
import { EcoActivity } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bike, Bus, Leaf, Lightbulb, Recycle, ShoppingBag } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LogActivityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const challengeId = params.challengeId as string;
  
  const { addActivity } = useUserStore();
  const { updateProgress } = useChallengeStore();
  
  const [selectedType, setSelectedType] = useState<EcoActivity['type']>('cycling');
  const [description, setDescription] = useState('');
  const [co2Saved, setCo2Saved] = useState('');
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

  const handleSubmit = async () => {
    if (!description) {
      Alert.alert('Missing Information', 'Please provide a description of your activity.');
      return;
    }

    if (!co2Saved || isNaN(parseFloat(co2Saved))) {
      Alert.alert('Invalid CO2 Value', 'Please enter a valid CO2 saved amount.');
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
        verified: false,
        date: new Date().toISOString(),
      };
      
      await addActivity(newActivity);
      
      if (challengeId) {
        await updateProgress(challengeId, 10); // Increase progress by 10%
      }
      
      Alert.alert(
        'Activity Logged',
        `Thank you for logging your eco-friendly activity! You earned ${getPoints()} points.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Eco Action</Text>
        <Text style={styles.subtitle}>
          Track your eco-friendly activities and earn points
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 70} // Adjusted for header
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView>
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
              {/* Add other activity types as in your original code */}
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
              {/* Include remaining activity types (recycling, energySaving, etc.) */}
            </View>
          </View>

          <View style={styles.section}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingContainer: {
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
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  cancelButton: {
    marginTop: 12,
  },
});