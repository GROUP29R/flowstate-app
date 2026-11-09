import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, gradients, radius, shadows, spacing } from '@/theme';
import { AppText } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'md' | 'sm';
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, icon, size = 'md', style }: Props) {
  const inactive = disabled || loading;
  const textColor = variant === 'danger' ? colors.danger : variant === 'ghost' ? colors.textMuted : colors.white;
  const height = size === 'sm' ? 40 : 52;

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={size === 'sm' ? 16 : 18} color={textColor} /> : null}
          <AppText variant={size === 'sm' ? 'label' : 'bodyStrong'} color={textColor}>
            {title}
          </AppText>
        </>
      )}
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { height },
        variant === 'primary' && !inactive && shadows.glow,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        inactive && styles.inactive,
        pressed && styles.pressed,
        style,
      ]}>
      {variant === 'primary' ? (
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
        />
      ) : null}
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, overflow: 'hidden' },
  gradient: { borderRadius: radius.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  secondary: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)' },
  inactive: { opacity: 0.5 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
});
