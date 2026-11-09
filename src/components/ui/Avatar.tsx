import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { initials } from '@/lib/format';
import { gradients } from '@/theme';
import { AppText } from './Text';

interface Props {
  name?: string | null;
  uri?: string | null;
  size?: number;
}

export function Avatar({ name, uri, size = 44 }: Props) {
  const box = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return <Image source={{ uri }} style={box} contentFit="cover" transition={150} accessibilityLabel={`${name ?? 'User'} avatar`} />;
  }
  return (
    <View style={[styles.wrap, box]}>
      <LinearGradient colors={gradients.primary} style={StyleSheet.absoluteFill} />
      <AppText variant="label" color="#fff" style={{ fontSize: size * 0.38, lineHeight: size * 0.5 }}>
        {initials(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } });
