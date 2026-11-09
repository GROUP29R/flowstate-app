import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { AppText } from '@/components/ui/Text';
import { colors, layout, radius, spacing } from '@/theme';

interface Props {
  videoId: string;
  autoPlay?: boolean;
}

/** YouTube player for iOS/Android (WebView). The web build uses VideoPlayer.web.tsx (iframe). */
export function VideoPlayer({ videoId, autoPlay = false }: Props) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, layout.maxWidth) - spacing.lg * 2;
  const h = Math.round((w * 9) / 16);

  if (!videoId) {
    return (
      <View style={[styles.box, styles.empty, { height: h }]}>
        <Ionicons name="videocam-off-outline" size={28} color={colors.textFaint} />
        <AppText variant="caption" color={colors.textMuted}>
          No video available yet
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.box, { height: h }]}>
      <YoutubePlayer height={h} width={w} play={autoPlay} videoId={videoId} webViewStyle={styles.webview} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: colors.border },
  empty: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.surface },
  webview: { opacity: 0.99 },
});
