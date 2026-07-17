import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCurrency } from '../utils/currency';
import type { ShoppingCartSummary } from '../types/models';

type ShoppingHistoryItemProps = {
  cart: ShoppingCartSummary;
  onPress: () => void;
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

export function ShoppingHistoryItem({
  cart,
  onPress,
}: ShoppingHistoryItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View>
        <Text style={styles.title}>{cart.title}</Text>
        <Text style={styles.date}>{formatDate(cart.date)}</Text>
      </View>
      <Text style={styles.total}>{formatCurrency(cart.total)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 16,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    color: '#6b7280',
    marginTop: 4,
  },
  total: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});
