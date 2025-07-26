import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import React from "react";
import { OnboardingProvider } from '@/store/onboardingStore';

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, clearStore } = useUserStore();
  const router = useRouter();
  const segments = useSegments() as string[];

  useEffect(() => {
    if (!Array.isArray(segments) || segments.length === 0) return; // Wait until navigation tree is ready
    const inAuthFlow = segments[0] === "onboarding" || segments[0] === "(auth)";
    const inMainApp = segments[0] === "(tabs)";
    // Check if user is authenticated
    const isAuthenticated = user && token;
    console.log('AuthGuard Debug:', {
      user: !!user,
      token: !!token,
      isAuthenticated,
      segments: segments[0],
      inAuthFlow,
      inMainApp
    });
    if (!isAuthenticated) {
      // User is not authenticated
      if (!inAuthFlow) {
        // Not in auth flow, redirect to onboarding
        console.log('Redirecting to onboarding - user not authenticated');
        router.replace("/onboarding");
      }
      // If already in auth flow (onboarding or auth), let them stay there
    } else {
      // User is authenticated
      if (inAuthFlow) {
        // User is authenticated but in auth flow, redirect to main app
        console.log('Redirecting to main app - user authenticated');
        router.replace("/(tabs)");
      }
      // If already in main app, let them stay there
    }
  }, [user, token, segments]);

  return <>{children}</>;
}

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
  return (
    <AuthGuard>
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
          name="marketplace/details" 
          options={{ 
            title: "Item Details",
          }} 
        />
        <Stack.Screen 
          name="nft/details" 
          options={{ 
            title: "NFT Details",
          }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </AuthGuard>
  );
}