import React, { useCallback, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { calcExtrasTotal, formatCurrency } from '../utils/currency';

type ProductRowProps = {
  title: string;
  quantity: number;
  price: number;
  extras: Array<{ amount: number }>;
  rowTotal: number;
  onPress: () => void;
  onDelete: () => void;
};

export function ProductRow({
  title,
  quantity,
  price,
  extras,
  rowTotal,
  onPress,
  onDelete,
}: ProductRowProps) {
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const extrasTotal = calcExtrasTotal(extras);

  const confirmDelete = useCallback(() => {
    Alert.alert(
      'Delete product',
      `Remove "${title || 'Untitled product'}" from this cart?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            swipeableRef.current?.close();
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
    );
  }, [onDelete, title]);

  const renderRightActions = useCallback(() => {
    return (
      <View style={styles.deleteAction}>
        <Text style={styles.deleteActionLabel}>Delete</Text>
      </View>
    );
  }, []);

  return (
    <Swipeable
      friction={2}
      onSwipeableOpen={confirmDelete}
      overshootRight={false}
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}>
      <Pressable onPress={onPress} style={styles.card}>
        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>
            {title || 'Untitled product'}
          </Text>
          <Text style={styles.subtitle}>
            {formatCurrency(price)} each
            {extrasTotal > 0
              ? ` + ${formatCurrency(extrasTotal)} extras`
              : ''}
          </Text>
        </View>
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityValue}>{quantity}</Text>
        </View>
        <Text style={styles.total}>{formatCurrency(rowTotal)}</Text>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#f3f4f6',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,

  },
  content: {
    flex: 1,
  },
  deleteAction: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    width: 88,
  },
  deleteActionLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  quantityBadge: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  quantityValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 4,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '500',
  },
  total: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 72,
    textAlign: 'right',
  },
});
