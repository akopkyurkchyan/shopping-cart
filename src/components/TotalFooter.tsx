import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Trash2, Wallet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useFormatCurrency } from '../hooks/useFormatCurrency';
import { colors } from '../theme/colors';

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
        <View style={styles.labelRow}>
          <Wallet color={colors.textSecondary} size={16} />
          <Text style={styles.label}>{t('common.total')}</Text>
        </View>
        <Text style={styles.total}>{formatMoney(total)}</Text>
      </View>

      <View style={styles.actions}>
        {isEditMode ? (
          <Pressable onPress={onDelete} style={[styles.button, styles.deleteButton]}>
            <Trash2 color={colors.error} size={18} />
            <Text style={[styles.buttonLabel, styles.deleteButtonLabel]}>
              {t('common.delete')}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={onSave}
          style={[styles.button, styles.saveButton, isSaving && styles.disabledButton]}
          disabled={isSaving}>
          {isSaving ? null : <Check color={colors.white} size={18} />}
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
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  container: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    padding: 16,
  },
  deleteButton: {
    backgroundColor: colors.card,
    borderColor: colors.error,
    borderWidth: 1,
  },
  deleteButtonLabel: {
    color: colors.error,
  },
  disabledButton: {
    opacity: 0.7,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  total: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  totalRow: {
    alignItems: 'flex-start',
  },
});
