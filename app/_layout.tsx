import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import Colors from "@/constants/Colors";
import { OnboardingProvider, useOnboarding } from "@/store/onboardingStore";
import { useUserStore } from "@/store/userStore";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <OnboardingProvider>
      <RootLayoutNav />
    </OnboardingProvider>
  );
}

function RootLayoutNav() {
  const { isOnboardingCompleted, isLoading: onboardingLoading } = useOnboarding();
  const { user } = useUserStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('RootLayoutNav useEffect, isOnboardingCompleted:', isOnboardingCompleted, 'user:', user, 'segments:', segments);
    if (onboardingLoading) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === '(auth)';
    const inTabs = segments[0] === '(tabs)';

    // Temporarily disable redirects for testing
    /*
    // If onboarding not completed, show onboarding
    if (!isOnboardingCompleted && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    // If onboarding completed but no user, show auth
    if (isOnboardingCompleted && !user && !inAuth && !inOnboarding) {
      router.replace('/(auth)');
      return;
    }

    // If user is authenticated, show tabs
    if (user && !inTabs && !inOnboarding) {
      router.replace('/(tabs)');
      return;
    }
    */
  }, [isOnboardingCompleted, onboardingLoading, user, segments, router]);

  if (onboardingLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.backgroundLight }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: "600",
          },
          contentStyle: {
            backgroundColor: Colors.white,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="activity/log" 
          options={{ 
            title: "Log Eco Action",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="activity/details" 
          options={{ 
            title: "Activity Details",
          }} 
        />
        <Stack.Screen 
          name="challenges/details" 
          options={{ 
            title: "Challenge Details",
          }} 
        />
        <Stack.Screen 
          name="challenges/leaderboard" 
          options={{ 
            title: "Challenge Leaderboard",
          }} 
        />
        <Stack.Screen 
          name="marketplace/details" 
          options={{ 
            title: "Item Details",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="nft/details" 
          options={{ 
            title: "NFT Details",
          }} 
        />
        <Stack.Screen 
          name="profile/index" 
          options={{ 
            title: "Profile",
          }} 
        />
        <Stack.Screen 
          name="settings/index" 
          options={{ 
            title: "Settings",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="help/index" 
          options={{ 
            title: "Help & Support",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="privacy/index" 
          options={{ 
            title: "Privacy Policy",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="verification/index" 
          options={{ 
            title: "Verify Evidence",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="onboarding/index" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}