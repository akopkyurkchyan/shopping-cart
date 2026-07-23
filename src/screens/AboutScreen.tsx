import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { colors } from '../theme/colors';

const readInterpolatedList = (
  t: (key: string, options?: Record<string, unknown>) => unknown,
  key: string,
  appName: string,
): string[] => {
  const items = t(key, { returnObjects: true });

  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((_, index) =>
    String(t(`${key}.${index}`, { appName })),
  );
};

export function AboutScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const appName = t('common.appName');
  const intro = useMemo(
    () => readInterpolatedList(t, 'about.intro', appName),
    [appName, t],
  );
  const features = useMemo(() => {
    const items = t('about.features', { returnObjects: true });

    return Array.isArray(items) ? (items as string[]) : [];
  }, [t]);
  const thanksBody = useMemo(
    () => readInterpolatedList(t, 'about.thanksBody', appName),
    [appName, t],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>{t('about.title', { appName })}</Text>

      <Text style={styles.headline}>{t('about.headline')}</Text>

      {intro.map(paragraph => (
        <Text key={paragraph} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>{t('about.featuresTitle')}</Text>
      {features.map(feature => (
        <Text key={feature} style={styles.featureItem}>
          {feature}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>{t('about.privacyTitle')}</Text>
      <Text style={styles.paragraph}>
        {t('about.privacyBody', { appName })}
      </Text>

      <Text style={styles.sectionTitle}>{t('about.thanksTitle')}</Text>
      {thanksBody.map(paragraph => (
        <Text key={paragraph} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  content: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  featureItem: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 6,
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 16,
    marginTop: 8,
  },
  paragraph: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
});
