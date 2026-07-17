import React, { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../app/store';
import { EmptyState } from '../components/EmptyState';
import { ShoppingHistoryItem } from '../components/ShoppingHistoryItem';
import { selectShoppingHistory } from '../features/shopping/shoppingSelectors';
import { loadShoppingHistory } from '../features/shopping/shoppingSlice';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
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
      <Text style={styles.title}>Shopping Cart</Text>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={carts}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <EmptyState
            message="No shopping history yet."
            description={
              'Track what you spend while shopping. Create a cart, add products with price and quantity, and see the total update instantly.\n\nTap “Create New Shopping Cart” below to get started. Your carts are saved on this device so you can review them anytime.'
            }
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
        <Text style={styles.createButtonLabel}>+ Create New Shopping Cart</Text>
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
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
});
