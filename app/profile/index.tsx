import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ProfileIcon from '@/components/ProfileIcon';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { User, Mail, Calendar, MapPin, Edit3, Save, Camera } from 'lucide-react-native';
import { API_CONFIG } from '@/constants/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    setIsEditing(false);
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => takePhoto() },
        { text: 'Gallery', onPress: () => pickImage() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadProfilePicture(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadProfilePicture(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadProfilePicture = async (imageAsset: any) => {
    try {
      const { token } = useUserStore.getState();
      if (!token) {
        Alert.alert('Error', 'Please log in to update your profile picture.');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', {
        uri: imageAsset.uri,
        type: 'image/jpeg',
        name: 'profile-picture.jpg',
      } as any);

      const response = await fetch(`${API_CONFIG.API_URL}/users/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const result = await response.json();
      
      // Update user store with new avatar
      useUserStore.getState().updateUser({ avatar: result.avatar });
      
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePicker}>
          {user.avatar ? (
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.avatar} 
            />
          ) : (
            <ProfileIcon size={80} color={Colors.primary} />
          )}
          <View style={styles.cameraIcon}>
            <Camera size={16} color={Colors.white} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.name}</Text>

          <Text style={styles.name}>{(user as any).username || user.name || user.email}</Text>
          <Text style={styles.level}>Level {user.level} • {user.ecoPoints} EcoPoints</Text>
          <Text style={styles.joinDate}>
            Member since {new Date(user.joinDate).toLocaleDateString()}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <Save size={20} color={Colors.primary} />
          ) : (
            <Edit3 size={20} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(user?.ecoPoints || 0) / 2} kg</Text>
          <Text style={styles.statLabel}>CO₂ Saved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(user.activities || []).length}</Text>
          <Text style={styles.statLabel}>My Actions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(user.nfts || []).length}</Text>
          <Text style={styles.statLabel}>NFTs Earned</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Card style={styles.infoCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <User size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter your name"
                />
              ) : (
                <View>
                  <Text style={styles.infoValue}>{user.name}</Text>
                  <Text style={styles.infoValue}>{(user as any).username || user.name || ''}</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Mail size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{user.email}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Calendar size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user.joinDate && !isNaN(new Date(user.joinDate).getTime())
                  ? new Date(user.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Date not available'}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <MapPin size={20} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>
                {user.country ? user.country : 'Not specified'}
              </Text>
            </View>
          </View>
        </Card>
        
        {isEditing && (
          <Button 
            title="Save Changes" 
            variant="primary" 
            onPress={handleSave}
            style={styles.saveButton}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        
        <Card style={styles.achievementCard}>
          <Text style={styles.achievementTitle}>Environmental Impact</Text>
          <View style={styles.achievementGrid}>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>🌱</Text>
              <Text style={styles.achievementLabel}>Eco Pioneer</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>♻️</Text>
              <Text style={styles.achievementLabel}>Recycling Pro</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>🚴</Text>
              <Text style={styles.achievementLabel}>Cycling Champion</Text>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementValue}>⚡</Text>
              <Text style={styles.achievementLabel}>Energy Saver</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/activity/log')}
          >
            <Text style={styles.actionEmoji}>📝</Text>
            <Text style={styles.actionText}>Log Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/challenges')}
          >
            <Text style={styles.actionEmoji}>🏆</Text>
            <Text style={styles.actionText}>Join Challenge</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/nft/details')}
          >
            <Text style={styles.actionEmoji}>🎨</Text>
            <Text style={styles.actionText}>View NFTs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/market')}
          >
            <Text style={styles.actionEmoji}>🛒</Text>
            <Text style={styles.actionText}>Marketplace</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  level: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    paddingVertical: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  editInput: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 72,
  },
  saveButton: {
    marginTop: 16,
  },
  achievementCard: {
    padding: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  achievementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementItem: {
    alignItems: 'center',
    flex: 1,
  },
  achievementValue: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
});