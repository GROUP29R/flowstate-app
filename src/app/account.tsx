import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/Text';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { colors, radius, spacing } from '@/theme';

type Meta = { name?: string; avatar_url?: string };

export default function AccountScreen() {
  const { user, refreshProfile } = useAuth();
  const toast = useToast();
  const meta = (user?.user_metadata ?? {}) as Meta;

  const [name, setName] = useState(meta.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(meta.avatar_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    if (!user) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    const asset = result.canceled ? null : result.assets[0];
    if (!asset) return;

    setUploading(true);
    try {
      const ext = (asset.mimeType?.split('/')[1] ?? asset.uri.split('.').pop() ?? 'jpg').replace('jpeg', 'jpg');
      const path = `${user.id}/avatar.${ext}`;
      const bytes = await (await fetch(asset.uri)).arrayBuffer();
      const { error } = await supabase.storage.from('avatars').upload(path, bytes, { upsert: true, contentType: asset.mimeType ?? `image/${ext}` });
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`); // cache-bust so the new photo shows immediately
      toast.info('Photo uploaded — tap Save changes to keep it.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not upload your photo.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!user) return;
    if (password && password.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    const updates: Parameters<typeof supabase.auth.updateUser>[0] = { data: { name: name.trim(), avatar_url: avatarUrl } };
    if (email.trim() && email.trim() !== user.email) updates.email = email.trim();
    if (password) updates.password = password;

    const { error } = await supabase.auth.updateUser(updates);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword('');
    await refreshProfile();
    toast.success(updates.email ? 'Saved. Confirm your new email address via the link we sent.' : 'Profile updated.');
  };

  return (
    <Screen scroll keyboardAvoiding edges={['top', 'bottom']}>
      <Header title="Account" />
      <View style={styles.avatarWrap}>
        <Pressable accessibilityRole="button" accessibilityLabel="Change profile photo" onPress={pickImage} disabled={uploading}>
          <Avatar name={name || user?.email} uri={avatarUrl} size={96} />
          <View style={styles.camera}>
            {uploading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="camera" size={16} color="#fff" />}
          </View>
        </Pressable>
        <AppText variant="caption" color={colors.textMuted}>
          Tap to change photo
        </AppText>
      </View>

      <Input label="Name" icon="person-outline" value={name} onChangeText={setName} placeholder="Your name" />
      <Input label="Email" icon="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
      <Input label="New password" icon="lock-closed-outline" value={password} onChangeText={setPassword} password autoCapitalize="none" placeholder="Leave blank to keep current" hint="At least 6 characters" />
      <Button title="Save changes" icon="save-outline" onPress={save} loading={saving} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignItems: 'center', gap: spacing.sm, marginVertical: spacing.xl },
  camera: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: radius.pill, backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
});
