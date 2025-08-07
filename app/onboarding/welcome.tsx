import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('@/assets/images/onboard_1.png')}
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Welcome to GreenMint</Text>
        <Text style={styles.subtitle}>
          Track your eco-friendly activities, earn points, and make a positive impact on the environment.
        </Text>
        
        <View style={styles.features}>
          <Text style={styles.feature}>🌱 Track your carbon footprint</Text>
          <Text style={styles.feature}>🏆 Earn points and rewards</Text>
          <Text style={styles.feature}>👥 Join community challenges</Text>
          <Text style={styles.feature}>🌍 Make a real difference</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Get Started" 
          onPress={() => router.push('/onboarding')}
          style={styles.button}
        />
        <Button 
          title="Learn More" 
          variant="outline"
          onPress={() => router.push('/help')}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    width: '100%',
    gap: 12,
  },
  feature: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});
