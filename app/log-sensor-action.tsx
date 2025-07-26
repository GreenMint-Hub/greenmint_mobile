import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import axios from 'axios';
import { API_CONFIG } from '@/constants/api';

const ACTION_TYPES = [
  { label: 'Walking', value: 'walking' },
  { label: 'Biking', value: 'biking' },
  { label: 'Cycling', value: 'cycling' },
];

export default function LogSensorAction() {
  const [actionType, setActionType] = useState('walking');
  const [speed, setSpeed] = useState('5');
  const [latitude, setLatitude] = useState('37.7749');
  const [longitude, setLongitude] = useState('-122.4194');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const sensorData = [{
        speed: parseFloat(speed),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timestamp: new Date().toISOString(),
      }];
      const res = await axios.post(`${API_CONFIG.API_URL}/activity/log`, {
        type: actionType,
        sensorData,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setResult('Action logged! Status: ' + (res.data.status || 'pending'));
    } catch (err: any) {
      setResult('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Sensor-Based Eco Action</Text>
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
      <Text style={styles.label}>Speed (km/h)</Text>
      <TextInput
        style={styles.input}
        value={speed}
        onChangeText={setSpeed}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <Button
        title={loading ? 'Logging...' : 'Log Action'}
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
    marginTop: 24,
    width: '100%',
  },
  result: {
    marginTop: 24,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
}); 