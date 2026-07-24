import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '../theme/colors';
import { formatDateValue, parseDateValue } from '../utils/date';

type DatePickerProps = {
  value: string;
  hasError?: boolean;
  label?: string;
  minimumDate?: string;
  maximumDate?: string;
  onChange: (value: string) => void;
};

export function DatePicker({
  value,
  hasError = false,
  label,
  minimumDate,
  maximumDate,
  onChange,
}: DatePickerProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // `null` means the stored value doesn't parse to a real calendar date
  // (empty/legacy/corrupt data). We must not silently pretend it is "today".
  const parsedDate = useMemo(() => parseDateValue(value), [value]);

  // Native pickers require a concrete Date to anchor on; fall back to today
  // only for that purpose, without ever reporting it back as the field value.
  const anchorDate = useMemo(() => parsedDate ?? new Date(), [parsedDate]);
  const parsedMinimumDate = useMemo(
    () => (minimumDate ? parseDateValue(minimumDate) : null),
    [minimumDate],
  );
  const parsedMaximumDate = useMemo(
    () => (maximumDate ? parseDateValue(maximumDate) : null),
    [maximumDate],
  );

  const displayValue = useMemo(() => {
    if (!parsedDate) {
      return null;
    }

    return new Intl.DateTimeFormat(i18n.language, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsedDate);
  }, [i18n.language, parsedDate]);

  const closePicker = useCallback(() => {
    setIsOpen(false);
  }, []);

  // `onChange` is deprecated by the library in favor of `onValueChange`
  // (fires only when the user actually picks a value) and `onDismiss`
  // (fires when the picker is dismissed without a selection).
  const handleValueChange = useCallback(
    (_event: DateTimePickerChangeEvent, nextDate: Date) => {
      onChange(formatDateValue(nextDate));
    },
    [onChange],
  );

  const openPicker = useCallback(() => {
    if (Platform.OS === 'android') {
      // Use the imperative API rather than mounting/unmounting a declarative
      // <DateTimePicker>. The declarative Android pattern has known
      // dismiss-ordering issues when the open/close state is driven by a
      // parent re-render (see react-native-datetimepicker#907, #1047).
      DateTimePickerAndroid.open({
        display: 'default',
        maximumDate: parsedMaximumDate ?? undefined,
        minimumDate: parsedMinimumDate ?? undefined,
        mode: 'date',
        onValueChange: handleValueChange,
        value: anchorDate,
      });
      return;
    }

    setIsOpen(true);
  }, [
    anchorDate,
    handleValueChange,
    parsedMaximumDate,
    parsedMinimumDate,
  ]);

  return (
    <>
      <Pressable
        onPress={openPicker}
        style={[styles.trigger, hasError && styles.triggerError]}>
        <View style={styles.triggerText}>
          {label ? <Text style={styles.triggerLabel}>{label}</Text> : null}
          <Text style={styles.triggerValue}>
            {displayValue ?? t('date.placeholder')}
          </Text>
        </View>
        {!label ? (
          <Text style={styles.triggerHint}>{t('date.tapToSelect')}</Text>
        ) : null}
      </Pressable>

      {Platform.OS === 'ios' ? (
        <Modal
          animationType="slide"
          onRequestClose={closePicker}
          transparent
          visible={isOpen}>
          <View style={styles.overlay}>
            <Pressable onPress={closePicker} style={styles.backdrop} />
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>
                  {label ?? t('date.selectTitle')}
                </Text>
                <Pressable onPress={closePicker}>
                  <Text style={styles.doneLabel}>{t('common.done')}</Text>
                </Pressable>
              </View>
              <DateTimePicker
                display="spinner"
                maximumDate={parsedMaximumDate ?? undefined}
                minimumDate={parsedMinimumDate ?? undefined}
                mode="date"
                onValueChange={handleValueChange}
                style={styles.iosPicker}
                value={anchorDate}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  doneLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  iosPicker: {
    alignSelf: 'stretch',
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
  triggerLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  triggerText: {
    flex: 1,
  },
  triggerValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
