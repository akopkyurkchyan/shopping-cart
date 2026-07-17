import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type QuantityPickerProps = {
  value: string;
  hasError?: boolean;
  onChange: (value: string) => void;
};

const QUANTITY_OPTIONS = Array.from({ length: 100 }, (_, index) =>
  String(index + 1),
);

export function QuantityPicker({
  value,
  hasError = false,
  onChange,
}: QuantityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = useMemo(() => {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
      return '1';
    }

    return String(parsed);
  }, [value]);

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[styles.trigger, hasError && styles.triggerError]}>
        <Text style={styles.triggerValue}>{selectedValue}</Text>
        <Text style={styles.triggerHint}>Tap to select</Text>
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
              <Text style={styles.sheetTitle}>Select Quantity</Text>
              <Pressable onPress={() => setIsOpen(false)}>
                <Text style={styles.closeLabel}>Close</Text>
              </Pressable>
            </View>

            <FlatList
              data={QUANTITY_OPTIONS}
              keyExtractor={item => item}
              initialScrollIndex={Math.max(0, Number(selectedValue) - 1)}
              getItemLayout={(_, index) => ({
                length: 48,
                offset: 48 * index,
                index,
              })}
              renderItem={({ item }) => {
                const isSelected = item === selectedValue;

                return (
                  <Pressable
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
              }}
            />
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
    color: '#6b7280',
    fontWeight: '600',
  },
  option: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
  },
  optionLabel: {
    color: '#111827',
    fontSize: 18,
  },
  optionLabelSelected: {
    color: '#111827',
    fontWeight: '700',
  },
  optionSelected: {
    backgroundColor: '#f3f4f6',
  },
  overlay: {
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
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
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  triggerError: {
    borderColor: '#dc2626',
  },
  triggerHint: {
    color: '#6b7280',
    fontSize: 13,
  },
  triggerValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});
