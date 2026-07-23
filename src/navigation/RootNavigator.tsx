import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ShoppingDetailsScreen } from '../screens/ShoppingDetailsScreen';
import { colors } from '../theme/colors';
import { MainTabNavigator } from './MainTabNavigator';
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
        initialRouteName="MainTabs"
        screenOptions={{
          contentStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
        }}>
        <Stack.Screen
          component={MainTabNavigator}
          name="MainTabs"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={ShoppingDetailsScreen}
          name="ShoppingDetails"
          options={{ title: t('details.screenTitle') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
