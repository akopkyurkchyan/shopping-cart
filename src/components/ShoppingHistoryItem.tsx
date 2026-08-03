import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, ShoppingBasket } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useFormatCurrency } from '../hooks/useFormatCurrency';
import { colors } from '../theme/colors';
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
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <ShoppingBasket color={colors.accent} size={20} />
          <Text style={styles.title}>{cart.title}</Text>
        </View>
        <View style={styles.dateRow}>
          <Calendar color={colors.textSecondary} size={14} />
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
      <Text style={styles.total}>{formatMoney(cart.total)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 16,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: colors.textPrimary,
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  date: {
    color: colors.textSecondary,
  },
  dateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  total: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '700',
  },
});
