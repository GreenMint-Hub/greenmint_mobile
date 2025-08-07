import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Button from './Button';
import { useMarketplaceStore } from '@/store/marketplaceStore';
import { useUserStore } from '@/store/userStore';

export default function SellTab() {
  const { addItem } = useMarketplaceStore();
  const { user } = useUserStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Good');
  const [image, setImage] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your item.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description for your item.');
      return;
    }

    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    if (!image) {
      Alert.alert('Missing Image', 'Please add a photo of your item.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addItem({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image: image.uri,
        condition,
        seller: user?.name || 'Anonymous',
        co2Saved: Math.floor(Math.random() * 10) + 1, // Random CO2 saved value
      });

      Alert.alert('Success!', 'Your item has been listed on the marketplace.');
      
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setCondition('Good');
      setImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to list item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>List Your Item</Text>
        <Text style={styles.headerSubtitle}>
          Give your items a second life and help the environment
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Photo</Text>
        <View style={styles.imageSection}>
          {image ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.retakeButton} 
                onPress={() => setImage(null)}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={48} color={Colors.textLight} />
              <Text style={styles.imagePlaceholderText}>Add a photo of your item</Text>
              <View style={styles.imageButtons}>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={20} color={Colors.primary} />
                  <Text style={styles.imageButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Ionicons name="images" size={20} color={Colors.primary} />
                  <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter item title"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your item..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price ($) *</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            placeholderTextColor={Colors.textLight}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Condition</Text>
          <View style={styles.conditionButtons}>
            {conditions.map((cond) => (
              <TouchableOpacity
                key={cond}
                style={[
                  styles.conditionButton,
                  condition === cond && styles.selectedConditionButton
                ]}
                onPress={() => setCondition(cond)}
              >
                <Text style={[
                  styles.conditionButtonText,
                  condition === cond && styles.selectedConditionButtonText
                ]}>
                  {cond}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Button
          title={isSubmitting ? 'Listing Item...' : 'List Item'}
          variant="primary"
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={styles.submitButton}
        />
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
    padding: 20,
    backgroundColor: Colors.backgroundLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 22,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  imageSection: {
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
    marginBottom: 16,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  imageButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  retakeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 100,
  },
  conditionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedConditionButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  conditionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedConditionButtonText: {
    color: Colors.white,
  },
  submitButton: {
    marginTop: 20,
  },
});

