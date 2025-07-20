import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useToast } from '@/hooks/useToast';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { ArrowLeft, Heart, Share2, MapPin, User, Star, MessageCircle } from 'lucide-react-native';
import { MARKETPLACE_ITEMS } from '@/mocks/marketplace';

export default function MarketplaceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { toast, showToast, hideToast } = useToast();
  const itemId = params.id as string;
  
  const item = MARKETPLACE_ITEMS.find(i => i.id === itemId);

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handleBuyNow = () => {
    Alert.alert(
      'Purchase Item',
      `Are you sure you want to buy ${item.title} for $${item.price.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Buy Now', 
          onPress: () => {
            showToast('Purchase successful! Item will be shipped soon.', 'success');
          }
        },
      ]
    );
  };

  const handleAddToCart = () => {
    showToast('Item added to cart', 'success');
  };

  const handleContactSeller = () => {
    Alert.alert(
      'Contact Seller',
      `Send a message to ${item.seller}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Message', onPress: () => showToast('Message sent to seller', 'success') },
      ]
    );
  };

  const handleShare = () => {
    showToast('Item link copied to clipboard', 'info');
  };

  const handleFavorite = () => {
    showToast('Item added to favorites', 'success');
  };

  return (
    <View style={styles.container}>
      <Toast 
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleFavorite}>
            <Heart size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.co2Badge}>
            <Text style={styles.co2Text}>-{item.co2Saved}kg CO₂</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>

          <View style={styles.conditionSection}>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{item.condition}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={16} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.ratingText}>4.8 (24 reviews)</Text>
            </View>
          </View>

          <Card style={styles.sellerCard}>
            <View style={styles.sellerHeader}>
              <View style={styles.sellerAvatar}>
                <User size={20} color={Colors.primary} />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{item.seller}</Text>
                <Text style={styles.sellerStats}>98% positive feedback • 156 sales</Text>
              </View>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={handleContactSeller}
              >
                <MessageCircle size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>

          <Card style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              This {item.title.toLowerCase()} is in {item.condition.toLowerCase()} condition and has been well-maintained. 
              By purchasing this item, you're helping reduce waste and supporting sustainable consumption. 
              The item comes from a smoke-free home and has been thoroughly cleaned.
            </Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Condition</Text>
                <Text style={styles.detailValue}>{item.condition}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>CO₂ Saved</Text>
                <Text style={styles.detailValue}>{item.co2Saved}kg</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>Clothing</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Size</Text>
                <Text style={styles.detailValue}>Medium</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.impactCard}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <View style={styles.impactStats}>
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>🌱</Text>
                <Text style={styles.impactLabel}>Eco-Friendly</Text>
              </View>
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>♻️</Text>
                <Text style={styles.impactLabel}>Recycled</Text>
              </View>
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>🌍</Text>
                <Text style={styles.impactLabel}>Sustainable</Text>
              </View>
            </View>
            <Text style={styles.impactDescription}>
              By buying this second-hand item, you're preventing {item.co2Saved}kg of CO₂ from entering the atmosphere 
              compared to buying new. You're also supporting the circular economy!
            </Text>
          </Card>

          <Card style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.locationTitle}>Pickup Location</Text>
            </View>
            <Text style={styles.locationText}>Downtown Seattle, WA</Text>
            <Text style={styles.locationDescription}>
              Item can be picked up locally or shipped nationwide. 
              Local pickup saves additional shipping emissions!
            </Text>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <Button 
          title="Add to Cart" 
          variant="outline" 
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
        <Button 
          title="Buy Now" 
          variant="primary" 
          onPress={handleBuyNow}
          style={styles.buyNowButton}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textLight,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  co2Badge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  co2Text: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  conditionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  conditionBadge: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  sellerCard: {
    padding: 16,
    marginBottom: 16,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  sellerStats: {
    fontSize: 12,
    color: Colors.textLight,
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: Colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  impactCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.backgroundLight,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  impactItem: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 24,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  impactDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    textAlign: 'center',
  },
  locationCard: {
    padding: 16,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addToCartButton: {
    flex: 1,
    marginRight: 8,
  },
  buyNowButton: {
    flex: 1,
    marginLeft: 8,
  },
});