import React, { useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../app/store';
import { selectCurrency } from '../features/settings/settingsSelectors';
import { updateCurrency } from '../features/settings/settingsSlice';
import { CURRENCY_OPTIONS } from '../types/settings';
import type { AppCurrencyCode } from '../types/settings';
import { formatCurrency } from '../utils/currency';

export function SettingsScreen() {
  const dispatch = useAppDispatch();
  const currency = useAppSelector(selectCurrency);

  const handleSelect = useCallback(
    (nextCurrency: AppCurrencyCode) => {
      dispatch(updateCurrency(nextCurrency))
        .unwrap()
        .catch(() => {
          Alert.alert('Settings error', 'Unable to update currency.');
        });
    },
    [dispatch],
  );

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Text style={styles.sectionTitle}>Currency</Text>
      <Text style={styles.sectionDescription}>
        Choose how prices are shown across the app. Select “No currency” to
        display amounts without a currency symbol.
      </Text>

      <Pressable
        onPress={() => handleSelect(null)}
        style={[styles.option, currency === null && styles.optionSelected]}>
        <View style={styles.optionText}>
          <Text style={styles.optionLabel}>No currency</Text>
          <Text style={styles.optionPreview}>
            Example: {formatCurrency(12.5, null)}
          </Text>
        </View>
        {currency === null ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>

      {CURRENCY_OPTIONS.map(option => {
        const isSelected = currency === option.code;

        return (
          <Pressable
            key={option.code}
            onPress={() => handleSelect(option.code)}
            style={[styles.option, isSelected && styles.optionSelected]}>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionPreview}>
                Example: {formatCurrency(12.5, option.code)}
              </Text>
            </View>
            {isSelected ? <Text style={styles.check}>✓</Text> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  check: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionLabel: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  optionPreview: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  optionSelected: {
    borderColor: '#111827',
  },
  optionText: {
    flex: 1,
    paddingRight: 12,
  },
  sectionDescription: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
});
