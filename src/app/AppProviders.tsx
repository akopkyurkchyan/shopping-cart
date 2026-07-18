import React, { useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initDatabase } from '../db/database';
import { loadSettings } from '../features/settings/settingsSlice';
import i18n from '../i18n';
import { RootNavigator } from '../navigation/RootNavigator';
import { store } from './store';

function AppBootstrap() {
  const { t } = useTranslation();

  useEffect(() => {
    initDatabase()
      .then(() => store.dispatch(loadSettings()))
      .catch(() => {
        Alert.alert(t('errors.databaseTitle'), t('errors.databaseMessage'));
      });
  }, [t]);

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
