import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Settings, ShoppingCart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../app/store';
import { EmptyState } from '../components/EmptyState';
import { ShoppingHistoryItem } from '../components/ShoppingHistoryItem';
import { selectShoppingHistory } from '../features/shopping/shoppingSelectors';
import { loadShoppingHistory } from '../features/shopping/shoppingSlice';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const carts = useAppSelector(selectShoppingHistory);

  useFocusEffect(
    useCallback(() => {
      dispatch(loadShoppingHistory());
    }, [dispatch]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ShoppingCart color={colors.primary} size={26} />
          <Text style={styles.title}>{t('home.title')}</Text>
        </View>
        <Pressable
          accessibilityLabel={t('settings.title')}
          accessibilityRole="button"
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}>
          <Settings color={colors.textPrimary} size={20} />
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={carts}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <EmptyState
            message={t('home.emptyTitle')}
            description={t('home.emptyDescription')}
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
      />

      <Pressable
        onPress={() => navigation.navigate('ShoppingDetails', {})}
        style={styles.createButton}>
        <Plus color={colors.white} size={20} />
        <Text style={styles.createButtonLabel}>{t('home.createCart')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
    paddingVertical: 16,
  },
  createButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
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
