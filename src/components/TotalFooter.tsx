import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useFormatCurrency } from '../hooks/useFormatCurrency';

type TotalFooterProps = {
  total: number;
  isEditMode: boolean;
  isSaving: boolean;
  onDelete: () => void;
  onSave: () => void;
};

export function TotalFooter({
  total,
  isEditMode,
  isSaving,
  onDelete,
  onSave,
}: TotalFooterProps) {
  const { t } = useTranslation();
  const formatMoney = useFormatCurrency();

  return (
    <View style={styles.container}>
      <View style={styles.totalRow}>
        <Text style={styles.label}>{t('common.total')}</Text>
        <Text style={styles.total}>{formatMoney(total)}</Text>
      </View>

      <View style={styles.actions}>
        {isEditMode ? (
          <Pressable onPress={onDelete} style={[styles.button, styles.deleteButton]}>
            <Text style={[styles.buttonLabel, styles.deleteButtonLabel]}>
              {t('common.delete')}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={onSave}
          style={[styles.button, styles.saveButton, isSaving && styles.disabledButton]}
          disabled={isSaving}>
          <Text style={styles.buttonLabel}>
            {isSaving ? t('common.saving') : t('common.save')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 14,
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    padding: 16,
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    borderColor: '#dc2626',
    borderWidth: 1,
  },
  deleteButtonLabel: {
    color: '#dc2626',
  },
  disabledButton: {
    opacity: 0.7,
  },
  label: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#111827',
  },
  total: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  totalRow: {
    alignItems: 'flex-start',
  },
});
