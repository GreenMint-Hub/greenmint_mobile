import React from 'react';
import { View } from 'react-native';
import { User } from 'lucide-react-native';

export default function ProfileIcon({ size = 80, color = '#ccc' }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color + '33', justifyContent: 'center', alignItems: 'center' }}>
      <User size={size * 0.6} color={color} />
    </View>
  );
}
