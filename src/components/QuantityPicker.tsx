import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '../theme/colors';

type QuantityPickerProps = {
  value: string;
  hasError?: boolean;
  onChange: (value: string) => void;
};

const QUANTITY_OPTIONS = Array.from({ length: 100 }, (_, index) =>
  String(index + 1),
);
const OPTION_HEIGHT = 48;

export function QuantityPicker({
  value,
  hasError = false,
  onChange,
}: QuantityPickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<ScrollView>(null);
  const selectedValue = useMemo(() => {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
      return '1';
    }

    return String(parsed);
  }, [value]);

  const scrollToSelected = useCallback(() => {
    const index = Math.max(0, Number(selectedValue) - 1);

    listRef.current?.scrollTo({
      y: index * OPTION_HEIGHT,
      animated: false,
    });
  }, [selectedValue]);

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[styles.trigger, hasError && styles.triggerError]}>
        <Text style={styles.triggerValue}>{selectedValue}</Text>
        <Text style={styles.triggerHint}>{t('quantity.tapToSelect')}</Text>
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}>
        <View style={styles.overlay}>
          <Pressable onPress={() => setIsOpen(false)} style={styles.backdrop} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{t('quantity.selectTitle')}</Text>
              <Pressable onPress={() => setIsOpen(false)}>
                <Text style={styles.closeLabel}>{t('common.close')}</Text>
              </Pressable>
            </View>

            <ScrollView ref={listRef} onLayout={scrollToSelected}>
              {QUANTITY_OPTIONS.map(item => {
                const isSelected = item === selectedValue;

                return (
                  <Pressable
                    key={item}
                    onPress={() => {
                      onChange(item);
                      setIsOpen(false);
                    }}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  closeLabel: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  option: {
    alignItems: 'center',
    height: OPTION_HEIGHT,
    justifyContent: 'center',
  },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  optionLabelSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
  },
  overlay: {
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: 16,
    paddingTop: 16,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  triggerError: {
    borderColor: colors.error,
  },
  triggerHint: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  triggerValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
