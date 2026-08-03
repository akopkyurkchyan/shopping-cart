import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import {
  History,
  Home,
  Info,
  Settings,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AboutScreen } from '../screens/AboutScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/colors';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICON_SIZE = 22;

type TabIconProps = {
  color: string;
};

function HomeTabIcon({ color }: TabIconProps) {
  return <Home color={color} size={TAB_ICON_SIZE} />;
}

function HistoryTabIcon({ color }: TabIconProps) {
  return <History color={color} size={TAB_ICON_SIZE} />;
}

function AboutTabIcon({ color }: TabIconProps) {
  return <Info color={color} size={TAB_ICON_SIZE} />;
}

function SettingsTabIcon({ color }: TabIconProps) {
  return <Settings color={color} size={TAB_ICON_SIZE} />;
}

/**
 * Plain Pressable without Android ripple / opacity flash.
 * PlatformPressable always injects a ripple on Android, even with a
 * transparent pressColor, which shows up as the gray rounded highlight.
 */
function TabBarButton(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      accessibilityLabel={props['aria-label']}
      accessibilityRole="button"
      accessibilityState={{ selected: props['aria-selected'] === true }}
      onLongPress={props.onLongPress}
      onPress={props.onPress}
      style={[props.style, styles.tabButton]}
      testID={props.testID}>
      {props.children}
    </Pressable>
  );
}

export function MainTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarActiveTintColor: colors.primary,
        tabBarButton: TabBarButton,
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        sceneStyle: {
          backgroundColor: colors.surface,
        },
      }}>
      <Tab.Screen
        component={HomeScreen}
        name="Home"
        options={{
          tabBarIcon: HomeTabIcon,
          tabBarLabel: t('tabs.home'),
        }}
      />
      <Tab.Screen
        component={HistoryScreen}
        name="History"
        options={{
          tabBarIcon: HistoryTabIcon,
          tabBarLabel: t('tabs.history'),
        }}
      />
      <Tab.Screen
        component={AboutScreen}
        name="About"
        options={{
          tabBarIcon: AboutTabIcon,
          tabBarLabel: t('tabs.about'),
        }}
      />
      <Tab.Screen
        component={SettingsScreen}
        name="Settings"
        options={{
          tabBarIcon: SettingsTabIcon,
          tabBarLabel: t('tabs.settings'),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    backgroundColor: 'transparent',
  },
  tabItem: {
    backgroundColor: 'transparent',
  },
});
