import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, ScrollView,
  TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuthStore();
  const { colors, isDark } = useTheme();
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      useAuthStore.setState((state) => ({
        user: state.user ? { ...state.user, name: editName.trim() } : state.user,
      }));
      setEditVisible(false);
    }
  };

  const menuItems = [
    { icon: 'notifications-outline' as const, label: 'Notifications', screen: 'Notifications' },
    { icon: 'color-palette-outline' as const, label: 'Appearance', screen: 'Appearance' },
    { icon: 'shield-checkmark-outline' as const, label: 'Privacy', screen: 'Privacy' },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', screen: 'HelpSupport' },
    { icon: 'information-circle-outline' as const, label: 'About', screen: 'About' },
  ];

  const displayName = user?.name || user?.email?.split('@')[0] || 'Layman Reader';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
        </View>

        <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>{displayName[0].toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>{displayName}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || ''}</Text>
          </View>
          <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.accentMuted }]} onPress={() => { setEditName(displayName); setEditVisible(true); }}>
            <Ionicons name="pencil" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.menuItem, { backgroundColor: colors.surface }]} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: colors.surfaceLight }]}>
                <Ionicons name={item.icon} size={22} color={colors.textPrimary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.signOutButton, { borderColor: colors.error }]} onPress={handleSignOut} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textTertiary }]}>Layman v1.0.0</Text>
      </ScrollView>

      <Modal visible={editVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Display Name</Text>
            <TextInput style={[styles.modalInput, { backgroundColor: colors.surfaceLight, color: colors.textPrimary }]} value={editName} onChangeText={setEditName} placeholder="Your name" placeholderTextColor={colors.textTertiary} autoFocus />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setEditVisible(false)}>
                <Text style={{ color: colors.textSecondary, fontSize: Typography.body, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSave, { backgroundColor: colors.accent }]} onPress={handleSaveName}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.xxl, paddingTop: 60, paddingBottom: Spacing.lg },
  title: { fontSize: Typography.screenTitle, fontWeight: '800' },
  userCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.xxl, borderRadius: BorderRadius.lg, padding: Spacing.xl, marginBottom: Spacing.xxl },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  userInfo: { flex: 1, marginLeft: Spacing.lg },
  userName: { fontSize: Typography.cardTitle, fontWeight: '700', marginBottom: 2 },
  userEmail: { fontSize: Typography.caption },
  editBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  menuSection: { paddingHorizontal: Spacing.xxl, marginBottom: Spacing.xxl },
  sectionLabel: { fontSize: Typography.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.sm },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  menuLabel: { flex: 1, fontSize: Typography.body, fontWeight: '500' },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.xxl, padding: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1, gap: Spacing.sm, marginBottom: Spacing.xxl },
  signOutText: { fontSize: Typography.body, fontWeight: '700' },
  version: { textAlign: 'center', fontSize: Typography.caption, marginBottom: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', borderRadius: BorderRadius.lg, padding: Spacing.xxl },
  modalTitle: { fontSize: Typography.cardTitle, fontWeight: '700', marginBottom: Spacing.lg },
  modalInput: { borderRadius: BorderRadius.sm, padding: Spacing.lg, fontSize: Typography.body, marginBottom: Spacing.xl },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md },
  modalCancel: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  modalSave: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, borderRadius: BorderRadius.sm },
  modalSaveText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: '700' },
});
