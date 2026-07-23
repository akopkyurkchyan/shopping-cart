import React, { useCallback, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { useFormatCurrency } from '../hooks/useFormatCurrency';
import { colors } from '../theme/colors';
import { calcExtrasTotal } from '../utils/currency';

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
  const { t } = useTranslation();
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const formatMoney = useFormatCurrency();
  const extrasTotal = calcExtrasTotal(extras);
  const displayTitle = title || t('common.untitledProduct');

  const confirmDelete = useCallback(() => {
    Alert.alert(
      t('product.deleteTitle'),
      t('product.deleteMessage', { title: displayTitle }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
          onPress: () => {
            swipeableRef.current?.close();
          },
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: onDelete,
        },
      ],
    );
  }, [displayTitle, onDelete, t]);

  const renderRightActions = useCallback(() => {
    return (
      <View style={styles.deleteAction}>
        <Trash2 color={colors.white} size={20} />
        <Text style={styles.deleteActionLabel}>{t('common.delete')}</Text>
      </View>
    );
  }, [t]);

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
            {displayTitle}
          </Text>
          <Text style={styles.subtitle}>
            {t('product.each', { price: formatMoney(price) })}
            {extrasTotal > 0
              ? t('product.extrasSuffix', {
                  amount: formatMoney(extrasTotal),
                })
              : ''}
          </Text>
        </View>
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityValue}>{quantity}</Text>
        </View>
        <Text style={styles.total}>{formatMoney(rowTotal)}</Text>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  content: {
    flex: 1,
  },
  deleteAction: {
    alignItems: 'center',
    backgroundColor: colors.error,
    gap: 4,
    justifyContent: 'center',
    width: 88,
  },
  deleteActionLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  quantityBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  quantityValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '500',
  },
  total: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 72,
    textAlign: 'right',
  },
});
