import React, { useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../app/store';
import {
  selectCurrency,
  selectLanguage,
} from '../features/settings/settingsSelectors';
import {
  updateCurrency,
  updateLanguage,
} from '../features/settings/settingsSlice';
import {
  CURRENCY_OPTIONS,
  LANGUAGE_OPTIONS,
} from '../types/settings';
import type {
  AppCurrencyCode,
  AppLanguagePreference,
} from '../types/settings';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/currency';

export function SettingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const currency = useAppSelector(selectCurrency);
  const language = useAppSelector(selectLanguage);

  const handleSelectCurrency = useCallback(
    (nextCurrency: AppCurrencyCode) => {
      dispatch(updateCurrency(nextCurrency))
        .unwrap()
        .catch(() => {
          Alert.alert(
            t('settings.errorTitle'),
            t('settings.currencyUpdateFailed'),
          );
        });
    },
    [dispatch, t],
  );

  const handleSelectLanguage = useCallback(
    (nextLanguage: AppLanguagePreference) => {
      dispatch(updateLanguage(nextLanguage))
        .unwrap()
        .catch(() => {
          Alert.alert(
            t('settings.errorTitle'),
            t('settings.languageUpdateFailed'),
          );
        });
    },
    [dispatch, t],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <Settings color={colors.primary} size={26} />
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
      <Text style={styles.sectionDescription}>
        {t('settings.languageDescription')}
      </Text>

      <Pressable
        onPress={() => handleSelectLanguage('system')}
        style={[styles.option, language === 'system' && styles.optionSelected]}>
        <View style={styles.optionText}>
          <Text style={styles.optionLabel}>{t('settings.systemDefault')}</Text>
          <Text style={styles.optionPreview}>
            {t('settings.systemDefaultHint')}
          </Text>
        </View>
        {language === 'system' ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>

      {LANGUAGE_OPTIONS.map(option => {
        const isSelected = language === option.code;

        return (
          <Pressable
            key={option.code}
            onPress={() => handleSelectLanguage(option.code)}
            style={[styles.option, isSelected && styles.optionSelected]}>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>{t(option.labelKey)}</Text>
            </View>
            {isSelected ? <Text style={styles.check}>✓</Text> : null}
          </Pressable>
        );
      })}

      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>
        {t('settings.currency')}
      </Text>
      <Text style={styles.sectionDescription}>
        {t('settings.currencyDescription')}
      </Text>

      <Pressable
        onPress={() => handleSelectCurrency(null)}
        style={[styles.option, currency === null && styles.optionSelected]}>
        <View style={styles.optionText}>
          <Text style={styles.optionLabel}>{t('settings.noCurrency')}</Text>
          <Text style={styles.optionPreview}>
            {t('common.example', { value: formatCurrency(12.5, null) })}
          </Text>
        </View>
        {currency === null ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>

      {CURRENCY_OPTIONS.map(option => {
        const isSelected = currency === option.code;

        return (
          <Pressable
            key={option.code}
            onPress={() => handleSelectCurrency(option.code)}
            style={[styles.option, isSelected && styles.optionSelected]}>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>{t(option.labelKey)}</Text>
              <Text style={styles.optionPreview}>
                {t('common.example', {
                  value: formatCurrency(12.5, option.code),
                })}
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
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  optionPreview: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  optionSelected: {
    borderColor: colors.primary,
  },
  optionText: {
    flex: 1,
    paddingRight: 12,
  },
  sectionDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionSpacing: {
    marginTop: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
  },
});
