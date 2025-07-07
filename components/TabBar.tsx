import Colors from '@/constants/Colors';
import { Home, Leaf, MoreHorizontal, ShoppingCart, Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const getIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? Colors.primary : Colors.textLight;
    
    switch (routeName) {
      case 'home':
        return <Home size={24} color={color} />;
      case 'market':
        return <ShoppingCart size={24} color={color} />;
      case 'carbon':
        return <Leaf size={24} color={color} />;
      case 'challenges':
        return <Trophy size={24} color={color} />;
      case 'more':
        return <MoreHorizontal size={24} color={color} />;
      default:
        return <Home size={24} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            {getIcon(route.name, isFocused)}
            <Text style={[
              styles.label,
              { color: isFocused ? Colors.primary : Colors.textLight }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});