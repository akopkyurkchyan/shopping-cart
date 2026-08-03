/**
 * Centralized color system for the app.
 *
 * Always reference these tokens from components/screens instead of
 * hardcoding hex values, so the palette stays consistent and can be updated
 * from a single place.
 */
export const colors = {
  // Brand
  primary: '#5ba566',
  primaryDark: '#436d46',
  primaryLight: '#adddb4',
  secondary: '#5cc7d2',
  accent: '#ffa559',

  // Surfaces
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',

  // Feedback
  success: '#5ba566',
  error: '#f05e41',
  warning: '#e9cd4a',

  // Utility
  white: '#FFFFFF',
  overlay: 'rgba(17, 24, 39, 0.35)',
} as const;

export type ColorToken = keyof typeof colors;
