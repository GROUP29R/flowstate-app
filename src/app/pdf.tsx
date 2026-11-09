import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors, radius, spacing } from '@/theme';

export default function PdfScreen() {
  const { url, title } = useLocalSearchParams<{ url?: string; title?: string }>();
  const [loading, setLoading] = useState(true);

  const openExternally = () => {
    if (url) WebBrowser.openBrowserAsync(url).catch(() => {});
  };

  // iOS WebViews render PDFs natively; Android needs the Google Docs viewer; web uses an iframe.
  const source = url
    ? { uri: Platform.OS === 'android' ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}` : url }
    : null;

  return (
    <Screen edges={['top', 'bottom']} wide>
      <Header
        title={title || 'Document'}
        right={
          url ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Open in browser" onPress={openExternally} hitSlop={8} style={styles.action}>
              <Ionicons name="open-outline" size={20} color={colors.text} />
            </Pressable>
          ) : undefined
        }
      />
      {!source ? (
        <EmptyState icon="alert-circle-outline" title="No document to show" message="This link is missing or invalid." />
      ) : (
        <View style={styles.viewer}>
          {Platform.OS === 'web' ? (
            React.createElement('iframe', { src: url, title: title || 'Document', style: { width: '100%', height: '100%', border: 0, background: '#fff' } })
          ) : (
            <WebView source={source} onLoadEnd={() => setLoading(false)} style={styles.webview} startInLoadingState={false} />
          )}
          {loading && Platform.OS !== 'web' ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  action: { width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  viewer: { flex: 1, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  webview: { flex: 1, backgroundColor: colors.surface },
  loading: { ...StyleSheet.absoluteFill as object, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
});
