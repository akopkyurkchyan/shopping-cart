import React, { useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { History } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../app/store';
import { EmptyState } from '../components/EmptyState';
import { ShoppingHistoryItem } from '../components/ShoppingHistoryItem';
import { selectShoppingHistory } from '../features/shopping/shoppingSelectors';
import { loadShoppingHistory } from '../features/shopping/shoppingSlice';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { groupCartsByMonth } from '../utils/shoppingHistory';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const carts = useAppSelector(selectShoppingHistory);
  const sections = useMemo(
    () =>
      groupCartsByMonth(carts, i18n.language).map(group => ({
        data: group.carts,
        key: group.key,
        title: group.title,
      })),
    [carts, i18n.language],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(loadShoppingHistory());
    }, [dispatch]),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <History color={colors.primary} size={26} />
        <Text style={styles.title}>{t('history.title')}</Text>
      </View>

      <SectionList
        contentContainerStyle={styles.listContent}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <EmptyState
            message={t('history.emptyTitle')}
            description={t('history.emptyDescription')}
          />
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
  container: {
    backgroundColor: colors.surface,
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
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
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
  },
});
