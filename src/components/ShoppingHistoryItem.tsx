import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useFormatCurrency } from '../hooks/useFormatCurrency';
import type { ShoppingCartSummary } from '../types/models';
import { parseDateValue } from '../utils/date';

type ShoppingHistoryItemProps = {
  cart: ShoppingCartSummary;
  onPress: () => void;
};

export function ShoppingHistoryItem({
  cart,
  onPress,
}: ShoppingHistoryItemProps) {
  const { i18n } = useTranslation();
  const formatMoney = useFormatCurrency();
  // `cart.date` is a plain YYYY-MM-DD string. Parsing it with `new Date(...)`
  // would read it as UTC midnight, which renders as the previous calendar
  // day in any timezone behind UTC. Parse it as a local date instead.
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parseDateValue(cart.date) ?? new Date());

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View>
        <Text style={styles.title}>{cart.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text style={styles.total}>{formatMoney(cart.total)}</Text>
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
