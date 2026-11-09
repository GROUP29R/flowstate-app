import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/Text';
import { colors, radius, shadows, spacing } from '@/theme';

type ToastType = 'success' | 'error' | 'info';
interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}
interface ToastApi {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TONES: Record<ToastType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  success: { icon: 'checkmark-circle', color: colors.success },
  error: { icon: 'alert-circle', color: colors.danger },
  info: { icon: 'information-circle', color: colors.primary },
};

/** Cross-platform replacement for `ToastAndroid` (which only exists on Android). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [anim] = useState(() => new Animated.Value(0));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && setToast(null));
  }, [anim]);

  const show = useCallback(
    (message: string, type: ToastType = 'info') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ id: Date.now(), message, type });
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      timer.current = setTimeout(hide, 3200);
    },
    [anim, hide],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (m) => show(m, 'success'),
      error: (m) => show(m, 'error'),
      info: (m) => show(m, 'info'),
    }),
    [show],
  );

  const tone = toast ? TONES[toast.type] : null;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast && tone ? (
        <View pointerEvents="none" style={[styles.wrap, { top: insets.top + spacing.sm }]}>
          <Animated.View
            style={[
              styles.toast,
              shadows.card,
              {
                opacity: anim,
                transform: [
                  { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) },
                ],
              },
            ]}>
            <Ionicons name={tone.icon} size={20} color={tone.color} />
            <AppText variant="bodyStrong" style={styles.text} numberOfLines={3}>
              {toast.message}
            </AppText>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 1000, paddingHorizontal: spacing.lg },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    maxWidth: 520,
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  text: { flexShrink: 1 },
});
