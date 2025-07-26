import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { API_CONFIG } from '@/constants/api';

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`${API_CONFIG.API_URL}/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in to your account.');
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(errorData.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      }
    };

    verifyEmail();
  }, [token]);

  const handleContinue = () => {
    router.replace('/(auth)');
  };

  const handleRetry = () => {
    setStatus('loading');
    setMessage('');
    // Retry verification
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_CONFIG.API_URL}/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now log in to your account.');
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(errorData.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      }
    };
    verifyEmail();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🌱 GreenMint</Text>
        
        {status === 'loading' && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.statusText}>Verifying your email...</Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.statusContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Email Verified!</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.button} onPress={handleContinue}>
              Continue to Login
            </Text>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.statusContainer}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.errorTitle}>Verification Failed</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.button} onPress={handleRetry}>
              Try Again
            </Text>
            <Text style={styles.link} onPress={handleContinue}>
              Go to Login
            </Text>
          </View>
        )}
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 40,
  },
  statusContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  statusText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 20,
    textAlign: 'center',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  link: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 