
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { API_CONFIG } from '@/constants/api';
import { useChallengeStore } from '@/store/challengeStore';
import { useUserStore } from '@/store/userStore';
import { EcoActivity } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Bike, Bus, Leaf, Lightbulb, Recycle, ShoppingBag } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const allowedTypes = [
  'walking',
  'cycling',
  'publicTransport',
  'recycling',
  'energySaving',
  'plantBasedMeal',
  'secondHandPurchase',
] as const;
type EcoType = typeof allowedTypes[number];
function mapParamToEcoType(param: string | undefined): EcoType {
  switch (param) {
    case 'walking':
      return 'walking';
    case 'cycling':
      return 'cycling';
    case 'public-transport':
      return 'publicTransport';
    case 'recycling':
      return 'recycling';
    case 'energy-saving':
      return 'energySaving';
    case 'plant-meal':
    case 'plant-based-meal': // Support both variants
      return 'plantBasedMeal';
    case 'secondhand':
      return 'secondHandPurchase';
    default:
      return 'cycling';
  }
}
function haversineDistance(coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3; // meters
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function LogActivityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const challengeId = params.challengeId as string;
  
  const { addActivity, claimReward } = useUserStore();
  const { updateProgress } = useChallengeStore();
  
  const ecoActionType = mapParamToEcoType(typeof params.type === 'string' ? params.type : undefined);
  const [actionType, setActionType] = useState<EcoType>(ecoActionType);
  const [description, setDescription] = useState('');
  const [co2Saved, setCo2Saved] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [points, setPoints] = useState(0);
  const [locationSub, setLocationSub] = useState<any>(null);
  const [lastLocation, setLastLocation] = useState<any>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionInterval, setSessionInterval] = useState<any>(null);
  const { token } = useUserStore();
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [media, setMedia] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  // Check sensor availability on mount
  useEffect(() => {
    if (actionType === 'walking') {
      Pedometer.isAvailableAsync().then((available) => {
        if (!available) setSensorError('Step counter not supported on this device.');
      });
    }
    if (actionType === 'cycling') {
      Location.hasServicesEnabledAsync().then((enabled) => {
        if (!enabled) setSensorError('Location services are not enabled.');
      });
    }
  }, [actionType]);

  // Live tracking for walking/cycling with permission checks and debug
  useEffect(() => {
    let pedometerSub: any;
    let locationPermissionGranted = false;
    let pedometerPermissionGranted = false;
    if (sessionActive && actionType === 'cycling') {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setSensorError('Location permission denied. Please enable location.');
          return;
        }
        locationPermissionGranted = true;
        setSensorError(null);
        const sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, distanceInterval: 5 },
          (loc) => {
            setDebugLog((log) => [
              `Location event: lat=${loc.coords.latitude}, lon=${loc.coords.longitude}, time=${new Date(loc.timestamp).toLocaleTimeString()}`,
              ...log.slice(0, 9)
            ]);
            if (lastLocation) {
              const dx = haversineDistance(
                { latitude: lastLocation.coords.latitude, longitude: lastLocation.coords.longitude },
                { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
              );
              setDistance((d) => d + dx);
              if (Math.floor((distance + dx) / 20) > Math.floor(distance / 20)) {
                setPoints((p) => p + 3);
              }
            }
            setLastLocation(loc);
          }
        );
        setLocationSub(sub);
      })();
    } else if (sessionActive && actionType === 'walking') {
      (async () => {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== 'granted') {
          setSensorError('Motion/fitness permission denied. Please enable permissions.');
          return;
        }
        pedometerPermissionGranted = true;
        setSensorError(null);
        pedometerSub = Pedometer.watchStepCount(({ steps }: { steps: number }) => {
          setDebugLog((log) => [
            `Step event: steps=${steps}, time=${new Date().toLocaleTimeString()}`,
            ...log.slice(0, 9)
          ]);
          setSteps((prev) => prev + steps);
          if (Math.floor((steps + steps) / 15) > Math.floor(steps / 15)) {
            setPoints((p) => p + 3);
          }
        });
      })();
    }
    return () => {
      if (pedometerSub) pedometerSub.remove();
      if (locationSub) locationSub.remove();
    };
  }, [sessionActive, actionType]);

  // Timer effect
  useEffect(() => {
    if (sessionActive) {
      setSessionStartTime(Date.now());
      const interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - (sessionStartTime || Date.now())) / 1000));
      }, 1000);
      setSessionInterval(interval);
    } else {
      if (sessionInterval) clearInterval(sessionInterval);
      setSessionDuration(0);
      setSessionStartTime(null);
    }
    return () => {
      if (sessionInterval) clearInterval(sessionInterval);
    };
  }, [sessionActive]);

  const startSession = () => {
    setSessionActive(true);
    setSteps(0);
    setDistance(0);
    setPoints(0);
    setLastLocation(null);
  };
  const stopSession = async () => {
    setSessionActive(false);
    if (locationSub) locationSub.remove();
    if (sessionInterval) clearInterval(sessionInterval);
    // Send session data to backend
    try {
      const payload = {
        type: actionType,
        steps,
        distance,
        points,
        duration: sessionDuration,
        startTime: sessionStartTime ? new Date(sessionStartTime).toISOString() : undefined,
        endTime: new Date().toISOString(),
      };
      await fetch(`${API_CONFIG.API_URL}/activity/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      Alert.alert('Session Ended', `You earned ${points} points!`);
      setSteps(0);
      setDistance(0);
      setPoints(0);
      setSessionDuration(0);
      setSessionStartTime(null);
    } catch (e) {
      Alert.alert('Error', 'Failed to log session.');
    }
  };

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMedia(result.assets[0]);
    }
  };

  const handleMediaSubmit = async () => {
    if (!media) {
      Alert.alert('Please select an image.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: media.uri,
        name: media.fileName || 'upload.jpg',
        type: media.type || 'image/jpeg',
      } as any);
      formData.append('actionType', actionType);
      formData.append('description', description);
      await fetch(`${API_CONFIG.API_URL}/activity/media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      Alert.alert('Submitted!', 'Your action has been published for community voting.');
      setMedia(null);
      setDescription('');
    } catch (e) {
      Alert.alert('Error', 'Failed to upload action.');
    } finally {
      setUploading(false);
    }
  };

  const getActivityTitle = () => {
    switch (actionType) {
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
        type: actionType,
        title: getActivityTitle(),
        description,
        co2Saved: parseFloat(co2Saved),
        points: getPoints(),
        verified: false,
        date: new Date().toISOString(),
      };
      
      await addActivity(newActivity);
      
      // If this activity is for a challenge, update the challenge progress
      if (challengeId) {
        await updateProgress(challengeId, 10); // Increase progress by 10%
      }

      // Show option to claim blockchain reward
      Alert.alert(
        'Activity Logged Successfully!',
        `You earned ${getPoints()} points. Would you like to claim a blockchain reward?`,
        [
          { text: 'Skip', onPress: () => router.back() },
          { 
            text: 'Claim Reward', 
            onPress: async () => {
              try {
                await claimReward(getPoints());
                Alert.alert('Reward Claimed!', 'Your blockchain reward has been claimed successfully.');
              } catch (error) {
                Alert.alert('Error', 'Failed to claim reward. Please try again later.');
              }
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Log Eco Action: {actionType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Text>
        {sensorError && <Text style={{ color: 'red', marginVertical: 12 }}>{sensorError}</Text>}
        {(actionType === 'walking' || actionType === 'cycling') ? (
          <View style={{ marginVertical: 24, alignItems: 'center' }}>
            {sessionActive ? (
              <>
                <Text style={styles.label}>Session In Progress</Text>
                <Text style={styles.label}>Time: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</Text>
                {actionType === 'walking' && <Text style={styles.label}>Steps: {steps}</Text>}
                {actionType === 'cycling' && <Text style={styles.label}>Distance: {distance.toFixed(1)} meters</Text>}
                <Text style={styles.label}>Points: {points}</Text>
                <Button title="Stop Session" variant="primary" onPress={stopSession} style={{ marginTop: 16 }} />
                <View style={{ marginTop: 16, alignItems: 'flex-start', width: '100%' }}>
                  <Text style={{ fontSize: 12, color: Colors.textLight, marginBottom: 4 }}>Debug Log:</Text>
                  {debugLog.map((msg, i) => (
                    <Text key={i} style={{ fontSize: 12, color: Colors.textLight }}>{msg}</Text>
                  ))}
                </View>
              </>
            ) : (
              <Button title="Start Session" variant="primary" onPress={startSession} />
            )}
          </View>
        ) : (actionType === 'publicTransport' || actionType === 'plantBasedMeal') ? (
          <View style={{ marginVertical: 24 }}>
            <Button
              title={media ? 'Change Image' : 'Pick Image'}
              variant="outline"
              onPress={pickMedia}
              style={{ marginBottom: 12 }}
            />
            {media && (
              <Text style={{ fontSize: 14, color: Colors.textLight, marginBottom: 8 }}>Selected: {media.fileName || media.uri}</Text>
            )}
            <TextInput
              style={styles.textInput}
              placeholder="Describe your action..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.textLight}
            />
            <Button
              title={uploading ? 'Submitting...' : 'Submit Action'}
              variant="primary"
              onPress={handleMediaSubmit}
              disabled={uploading}
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <View>
            {/* Existing manual log form here */}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
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
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
});

