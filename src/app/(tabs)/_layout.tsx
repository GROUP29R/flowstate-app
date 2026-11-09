import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import React from 'react';

import { colors } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(active: IconName, inactive: IconName) {
  // eslint-disable-next-line react/display-name
  return ({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) => (
    <Ionicons name={focused ? active : inactive} size={size} color={color as string} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Learn', tabBarIcon: tabIcon('compass', 'compass-outline') }} />
      <Tabs.Screen name="downloads" options={{ title: 'Library', tabBarIcon: tabIcon('library', 'library-outline') }} />
      <Tabs.Screen name="settings" options={{ title: 'Profile', tabBarIcon: tabIcon('person-circle', 'person-circle-outline') }} />
    </Tabs>
  );
}
