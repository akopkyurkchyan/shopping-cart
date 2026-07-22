import React, { useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initDatabase } from '../db/database';
import { loadSettings } from '../features/settings/settingsSlice';
import i18n from '../i18n';
import { RootNavigator } from '../navigation/RootNavigator';
import { store } from './store';

function AppBootstrap() {
  // Bootstrap must run exactly once. Depending on `t` here creates an
  // infinite loop: loadSettings -> changeLanguage -> new `t` -> effect re-runs.
  useEffect(() => {
    initDatabase()
      .then(() => store.dispatch(loadSettings()))
      .catch(() => {
        Alert.alert(
          i18n.t('errors.databaseTitle'),
          i18n.t('errors.databaseMessage'),
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
      <I18nextProvider i18n={i18n}>
        <GestureHandlerRootView style={styles.root}>
          <SafeAreaProvider>
            <AppBootstrap />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </I18nextProvider>
    </Provider>
  );
}
