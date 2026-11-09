import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { shadows } from '@/theme';

export function Logo({ size = 64 }: { size?: number }) {
  return (
    <View style={[styles.wrap, shadows.glow, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <LinearGradient colors={['#4338CA', '#7C3AED', '#C026D3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Image source={require('@/assets/images/logo-mark.png')} style={{ width: size * 0.82, height: size * 0.82 }} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } });
