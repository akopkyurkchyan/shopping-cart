import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ShoppingDetailsScreen } from '../screens/ShoppingDetailsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f9fafb',
  },
};

export function RootNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          contentStyle: { backgroundColor: '#f9fafb' },
          headerShadowVisible: false,
        }}>
        <Stack.Screen
          component={HomeScreen}
          name="Home"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={ShoppingDetailsScreen}
          name="ShoppingDetails"
          options={{ title: t('details.screenTitle') }}
        />
        <Stack.Screen
          component={SettingsScreen}
          name="Settings"
          options={{ title: t('settings.title') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
