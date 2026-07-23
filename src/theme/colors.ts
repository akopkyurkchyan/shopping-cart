/**
 * Centralized color system for the app.
 *
 * Always reference these tokens from components/screens instead of
 * hardcoding hex values, so the palette stays consistent and can be updated
 * from a single place.
 */
export const colors = {
  // Brand
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryLight: '#DCFCE7',
  secondary: '#3B82F6',

  // Surfaces
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',

  // Feedback
  success: '#16A34A',
  error: '#EF4444',
  warning: '#F59E0B',

  // Utility
  white: '#FFFFFF',
  overlay: 'rgba(17, 24, 39, 0.35)',
} as const;

export type ColorToken = keyof typeof colors;
