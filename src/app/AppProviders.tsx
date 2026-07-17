import React, { useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initDatabase } from '../db/database';
import { loadSettings } from '../features/settings/settingsSlice';
import { RootNavigator } from '../navigation/RootNavigator';
import { store } from './store';

function AppBootstrap() {
  useEffect(() => {
    initDatabase()
      .then(() => store.dispatch(loadSettings()))
      .catch(() => {
        Alert.alert(
          'Database error',
          'The local database could not be initialized.',
        );
      });
  }, []);

  return <RootNavigator />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export function AppProviders() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <AppBootstrap />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
