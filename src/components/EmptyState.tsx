import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';

import { colors } from '../theme/colors';

type EmptyStateProps = {
  message: string;
  description?: string;
};

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <ShoppingCart color={colors.primary} size={32} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  iconBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  message: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
