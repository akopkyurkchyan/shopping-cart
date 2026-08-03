import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { AppProviders } from './src/app/AppProviders';
import { colors } from './src/theme/colors';
import './src/i18n';

function App() {
  return (
    <View style={styles.root}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />
      <AppProviders />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    flex: 1,
  },
});

export default App;
