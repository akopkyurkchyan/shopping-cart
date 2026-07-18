import React from 'react';
import { StatusBar } from 'react-native';

import { AppProviders } from './src/app/AppProviders';
import './src/i18n';

function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppProviders />
    </>
  );
}

export default App;
