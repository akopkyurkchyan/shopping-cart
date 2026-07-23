import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  History,
  Home,
  Info,
  Settings,
} from 'lucide-react-native';
import React from 'react';
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

export function MainTabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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
