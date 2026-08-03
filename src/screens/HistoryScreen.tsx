import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { History, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../app/store';
import { DatePicker } from '../components/DatePicker';
import { EmptyState } from '../components/EmptyState';
import { ShoppingHistoryItem } from '../components/ShoppingHistoryItem';
import { selectShoppingHistory } from '../features/shopping/shoppingSelectors';
import { loadShoppingHistory } from '../features/shopping/shoppingSlice';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { getLastDaysDateRange } from '../utils/date';
import {
  filterCartsByDateRange,
  groupCartsByMonth,
  HISTORY_PAGE_SIZE,
  normalizeDateRange,
  paginateCarts,
} from '../utils/shoppingHistory';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const carts = useAppSelector(selectShoppingHistory);
  const [fromDate, setFromDate] = useState(
    () => getLastDaysDateRange(7).fromDate,
  );
  const [toDate, setToDate] = useState(() => getLastDaysDateRange(7).toDate);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);

  useFocusEffect(
    useCallback(() => {
      dispatch(loadShoppingHistory());
    }, [dispatch]),
  );

  useEffect(() => {
    setVisibleCount(HISTORY_PAGE_SIZE);
  }, [fromDate, toDate]);

  const handleFromChange = useCallback((nextFrom: string) => {
    const normalized = normalizeDateRange(nextFrom, toDate);
    setFromDate(normalized.fromDate);
    setToDate(normalized.toDate);
  }, [toDate]);

  const handleToChange = useCallback((nextTo: string) => {
    const normalized = normalizeDateRange(fromDate, nextTo);
    setFromDate(normalized.fromDate);
    setToDate(normalized.toDate);
  }, [fromDate]);

  const handleClearRange = useCallback(() => {
    setFromDate('');
    setToDate('');
  }, []);

  const filteredCarts = useMemo(
    () => filterCartsByDateRange(carts, fromDate, toDate),
    [carts, fromDate, toDate],
  );
  const visibleCarts = useMemo(
    () => paginateCarts(filteredCarts, visibleCount),
    [filteredCarts, visibleCount],
  );
  const sections = useMemo(
    () =>
      groupCartsByMonth(visibleCarts, i18n.language).map(group => ({
        data: group.carts,
        key: group.key,
        title: group.title,
      })),
    [i18n.language, visibleCarts],
  );
  const hasMore = visibleCarts.length < filteredCarts.length;
  const hasActiveRange = Boolean(fromDate || toDate);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <History color={colors.primary} size={26} />
          </View>
          <Text style={styles.title}>{t('history.title')}</Text>
        </View>
        <Pressable
          accessibilityLabel={t('home.createCart')}
          accessibilityRole="button"
          onPress={() => navigation.navigate('ShoppingDetails', {})}
          style={styles.createButton}>
          <Plus color={colors.white} size={24} />
        </Pressable>
      </View>

      <View style={styles.rangeRow}>
        <View style={styles.rangeField}>
          <DatePicker
            label={t('history.from')}
            maximumDate={toDate || undefined}
            onChange={handleFromChange}
            value={fromDate}
          />
        </View>
        <View style={styles.rangeField}>
          <DatePicker
            label={t('history.to')}
            minimumDate={fromDate || undefined}
            onChange={handleToChange}
            value={toDate}
          />
        </View>
      </View>

      {hasActiveRange ? (
        <Pressable onPress={handleClearRange} style={styles.clearButton}>
          <Text style={styles.clearButtonLabel}>{t('history.clearRange')}</Text>
        </Pressable>
      ) : null}

      <SectionList
        contentContainerStyle={styles.listContent}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <EmptyState
            message={
              hasActiveRange
                ? t('history.emptyFilteredTitle')
                : t('history.emptyTitle')
            }
            description={
              hasActiveRange
                ? t('history.emptyFilteredDescription')
                : t('history.emptyDescription')
            }
          />
        }
        ListFooterComponent={
          hasMore ? (
            <Pressable
              onPress={() =>
                setVisibleCount(current => current + HISTORY_PAGE_SIZE)
              }
              style={styles.loadMoreButton}>
              <Text style={styles.loadMoreLabel}>{t('history.loadMore')}</Text>
            </Pressable>
          ) : null
        }
        renderItem={({ item }) => (
          <ShoppingHistoryItem
            cart={item}
            onPress={() =>
              navigation.navigate('ShoppingDetails', { cartId: item.id })
            }
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        sections={sections}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    paddingVertical: 4,
  },
  clearButtonLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.surface,
    flex: 1,
    paddingHorizontal: 16,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  loadMoreButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 14,
  },
  loadMoreLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  rangeField: {
    flex: 1,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    flexShrink: 1,
    fontSize: 28,
    fontWeight: '700',
    includeFontPadding: false,
    lineHeight: 34,
  },
  titleIcon: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
  },
  titleRow: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginRight: 12,
  },
});
