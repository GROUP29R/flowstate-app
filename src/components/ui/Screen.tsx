import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type RefreshControlProps, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/theme';

interface Props {
  children: React.ReactNode;
  /** Wrap content in a ScrollView. */
  scroll?: boolean;
  /** Horizontal padding for content. */
  padded?: boolean;
  edges?: Edge[];
  wide?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentStyle?: StyleProp<ViewStyle>;
  keyboardAvoiding?: boolean;
}

/** Page container: safe areas, dark background, and a centred max-width column. */
export function Screen({ children, scroll, padded = true, edges = ['top'], wide, refreshControl, contentStyle, keyboardAvoiding }: Props) {
  const maxWidth = wide ? layout.wideMaxWidth : layout.maxWidth;
  const column: StyleProp<ViewStyle> = [
    styles.column,
    { maxWidth },
    padded && { paddingHorizontal: spacing.lg },
    contentStyle,
  ];

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}>
      <View style={column}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.flex, column]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.root} edges={edges}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.xxxl },
  column: { width: '100%', alignSelf: 'center' },
});
