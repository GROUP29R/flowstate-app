import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { AppText } from '@/components/ui/Text';
import { colors, layout, radius, spacing } from '@/theme';

interface Props {
  videoId: string;
  autoPlay?: boolean;
}

/** YouTube player that works on native (WebView) and web (iframe). 16:9, responsive. */
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
      {React.createElement('iframe', {
        key: `${videoId}-${autoPlay}`,
        src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoPlay ? '&autoplay=1' : ''}`,
        title: 'Course video',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
        allowFullScreen: true,
        style: { width: '100%', height: '100%', border: 0 },
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: colors.border },
  empty: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.surface },
});
