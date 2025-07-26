import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ImageSourcePropType } from 'react-native';
import { useOnboarding } from '@/store/onboardingStore';
import { useUserStore } from '@/store/userStore';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '0',
    image: require('../../assets/images/onboard_1.png'),
    title: 'Welcome to GreenMint',
    description: 'Your all-in-one app for sustainable living and earning rewards',
  },
  {
    id: '1',
    image: require('../../assets/images/onboard_2.png'),
    title: 'Reduce Your Carbon Footprint',
    description: 'Track eco-friendly actions and see your impact on the planet',
  },
  {
    id: '2',
    image: require('../../assets/images/onboard_3.png'),
    title: 'Earn NFT Rewards',
    description: 'Complete challenges and earn unique NFTs on the blockchain',
  },
  {
    id: '3',
    image: require('../../assets/images/onboard_4.png'),
    title: 'Buy & Sell Sustainably',
    description: 'Join our eco-marketplace and give items a second life',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { resetOnboarding } = useOnboarding();
  const { logout } = useUserStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log('OnboardingScreen mounted, resetting onboarding and user state');
    resetOnboarding(); // Reset onboarding state
    logout(); // Clear user session
  }, []);

  const handleNext = () => {
    console.log('handleNext called, currentIndex:', currentIndex);
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      console.log('Navigating to /(auth)');
      try {
        router.replace('/(auth)');
      } catch (error) {
        console.error('Navigation error in handleNext:', error);
      }
    }
  };

  const handleSkip = () => {
    console.log('handleSkip called');
    try {
      router.replace('/(auth)');
    } catch (error) {
      console.error('Navigation error in handleSkip:', error);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        {currentIndex < slides.length - 1 ? (
          <>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <Button 
              title="Next" 
              variant="primary" 
              onPress={handleNext}
              style={styles.nextButton}
            />
          </>
        ) : (
          <Button 
            title="Get Started" 
            variant="primary" 
            onPress={handleNext}
            style={styles.getStartedButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  slide: {
    width,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    fontSize: 16,
    color: Colors.textLight,
    fontWeight: '500',
  },
  nextButton: {
    width: 120,
  },
  getStartedButton: {
    flex: 1,
  },
});