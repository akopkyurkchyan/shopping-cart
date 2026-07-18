import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../app/store';
import { EmptyState } from '../components/EmptyState';
import { ShoppingHistoryItem } from '../components/ShoppingHistoryItem';
import { selectShoppingHistory } from '../features/shopping/shoppingSelectors';
import { loadShoppingHistory } from '../features/shopping/shoppingSlice';
import type { RootStackParamList } from '../navigation/types';

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
        <Text style={styles.title}>{t('home.title')}</Text>
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}>
          <Text style={styles.settingsButtonLabel}>{t('common.settings')}</Text>
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
        <Text style={styles.createButtonLabel}>{t('home.createCart')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 8,
    paddingVertical: 16,
  },
  createButtonLabel: {
    color: '#ffffff',
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
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  settingsButtonLabel: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#111827',
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    marginRight: 12,
  },
});
