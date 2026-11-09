import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './Text';

interface Props extends TextInputProps {
  label?: string;
  error?: string | null;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Shows a show/hide toggle for password fields. */
  password?: boolean;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, error, icon, password, hint, multiline, style, containerStyle, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <AppText variant="label" color={colors.textMuted} style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={[styles.field, multiline && styles.multiline, focused && styles.focused, !!error && styles.errored]}>
        {icon ? <Ionicons name={icon} size={18} color={focused ? colors.primary : colors.textFaint} style={styles.icon} /> : null}
        <TextInput
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.primary}
          secureTextEntry={password ? hidden : rest.secureTextEntry}
          multiline={multiline}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, multiline && styles.inputMultiline, style]}
          {...rest}
        />
        {password ? (
          <Pressable hitSlop={10} onPress={() => setHidden((h) => !h)} accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textFaint} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.danger} style={styles.msg}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textFaint} style={styles.msg}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.sm },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  multiline: { alignItems: 'flex-start', paddingVertical: spacing.md },
  focused: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  errored: { borderColor: colors.danger },
  icon: { marginRight: spacing.md },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 12, outlineStyle: 'none' } as never,
  inputMultiline: { minHeight: 110, textAlignVertical: 'top' },
  msg: { marginTop: spacing.xs },
});
