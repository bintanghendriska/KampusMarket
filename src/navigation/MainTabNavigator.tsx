import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fontFamily } from '../constants/typography';
import { shadows } from '../constants/shadows';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { WishlistScreen } from '../screens/wishlist/WishlistScreen';
import { HomeStackNavigator } from './HomeStackNavigator';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  Wishlist: 'heart',
  Profile: 'person',
};

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  
  // Standard tab bar height is 52pt. We add bottom safe area inset to it.
  const tabHeight = 52 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          height: tabHeight,
          paddingTop: 6,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 6,
          ...shadows.md,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.medium,
          fontSize: 11,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const baseName = TAB_ICONS[route.name as keyof MainTabParamList];
          const iconName = focused ? baseName : (`${baseName}-outline` as keyof typeof Ionicons.glyphMap);
          return <Ionicons name={iconName} size={size - 2} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Wishlist' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
