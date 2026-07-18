/* eslint-env jest */

jest.mock('@op-engineering/op-sqlite', () => ({
  open: jest.fn(() => ({
    execute: jest.fn().mockResolvedValue({ rows: [], rowsAffected: 0 }),
  })),
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'en', countryCode: 'US' }],
}));

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    GestureHandlerRootView: ({ children }) => React.createElement(View, null, children),
  };
});

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) => React.createElement(View, null, children),
      Screen: ({ component: Component }) => React.createElement(Component),
    }),
  };
});
