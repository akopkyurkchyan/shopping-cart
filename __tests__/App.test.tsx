/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/app/AppProviders', () => ({
  AppProviders: () => {
    const { Text } = require('react-native');

    return <Text>App Providers</Text>;
  },
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    const tree = ReactTestRenderer.create(<App />);

    expect(tree).toBeTruthy();
  });
});
