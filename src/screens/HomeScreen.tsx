import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, ShoppingCart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../app/store';
import { ShoppingHistoryItem } from '../components/ShoppingHistoryItem';
import { selectShoppingHistory } from '../features/shopping/shoppingSelectors';
import { loadShoppingHistory } from '../features/shopping/shoppingSlice';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const RECENT_CART_LIMIT = 7;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const carts = useAppSelector(selectShoppingHistory);
  const recentCarts = useMemo(
    () => carts.slice(0, RECENT_CART_LIMIT),
    [carts],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(loadShoppingHistory());
    }, [dispatch]),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ShoppingCart color={colors.primary} size={26} />
          <Text style={styles.title}>{t('common.appName')}</Text>
        </View>
        <Pressable
          accessibilityLabel={t('home.createCart')}
          accessibilityRole="button"
          onPress={() => navigation.navigate('ShoppingDetails', {})}
          style={styles.createButton}>
          <Plus color={colors.white} size={24} />
        </Pressable>
      </View>

      {recentCarts.length === 0 ? (
        <View style={styles.body}>
          <View style={styles.hero}>
            <View style={styles.iconBadge}>
              <ShoppingCart color={colors.primary} size={36} />
            </View>
            <Text style={styles.heroTitle}>{t('home.welcomeTitle')}</Text>
            <Text style={styles.heroDescription}>
              {t('home.welcomeDescription')}
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={recentCarts}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>{t('home.recentTitle')}</Text>
          }
          renderItem={({ item }) => (
            <ShoppingHistoryItem
              cart={item}
              onPress={() =>
                navigation.navigate('ShoppingDetails', { cartId: item.id })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 24,
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  heroDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  iconBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  titleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginRight: 12,
  },
});
