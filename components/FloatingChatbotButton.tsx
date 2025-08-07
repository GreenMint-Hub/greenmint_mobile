import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function FloatingChatbotButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push('/chatbot-modal')}
      activeOpacity={0.8}
    >
      <Image source={require('@/assets/images/an_icon.png')} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 110, // raised even higher above the tab bar
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 100,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: Colors.white,
  },
});
