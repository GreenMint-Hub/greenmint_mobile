import Colors from "@/constants/Colors";
import { Tabs } from "expo-router";
import { Home, Leaf, MoreHorizontal, ShoppingCart, Trophy } from "lucide-react-native";
import React from "react";
import FloatingChatbotButton from "@/components/FloatingChatbotButton";
// import { createAppKit} from '@reown/appkit-ethers-react-native';

// createAppKit({
//   projectId: "com.greenmint.chain",
//   appName: "Greenmint",
//   appIcon: './assets/images/icon.png',
//   appDescription: "Greenmint is a platform for tracking your carbon footprint and reducing your carbon emissions.",
//   appUrl: "https://greenmint.app",
// });

export default function TabLayout() {
  return (
    <React.Fragment>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textLight,
          tabBarStyle: {
            borderTopColor: Colors.border,
            backgroundColor: Colors.white,
          },
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="market"
          options={{
            title: "Market",
            tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="carbon"
          options={{
            title: "Carbon",
            tabBarIcon: ({ color }) => <Leaf size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="challenges"
          options={{
            title: "Challenges",
            tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: "More",
            tabBarIcon: ({ color }) => <MoreHorizontal size={24} color={color} />,
          }}
        />
      </Tabs>
      <FloatingChatbotButton />
    </React.Fragment>
  );
}