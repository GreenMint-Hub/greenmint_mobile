import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';

export default function ActivityIndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Center</Text>
      <Text style={styles.subtitle}>Track your eco-friendly activities</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Log Activity" 
          onPress={() => router.push('/activity/log')}
          style={styles.button}
        />
        <Button 
          title="Upload Media Action" 
          onPress={() => router.push('/activity/upload-media')}
          style={styles.button}
        />
        <Button 
          title="Vote on Actions" 
          onPress={() => router.push('/activity/vote')}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    marginBottom: 12,
  },
});
