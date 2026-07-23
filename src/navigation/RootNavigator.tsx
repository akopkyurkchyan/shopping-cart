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
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.surface,
    border: colors.border,
    card: colors.card,
    notification: colors.error,
    primary: colors.primary,
    text: colors.textPrimary,
  },
};

export function RootNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          contentStyle: { backgroundColor: colors.surface },
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
