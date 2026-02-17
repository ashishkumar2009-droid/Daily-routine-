import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../lib/context/AppContext';
import { useTheme, spacing, typography, borderRadius } from '../lib/theme';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { getXPForNextLevel } from '../lib/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export function ProfileScreen() {
  const { userStats, settings, updateSettings, resetStreak } = useApp();
  const { colors, isDark } = useTheme();
  const [showResetModal, setShowResetModal] = useState(false);

  const xpForNextLevel = getXPForNextLevel(userStats.level);
  const xpProgress = (userStats.xp % xpForNextLevel) / xpForNextLevel * 100;

  const handleToggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const handleToggleNotifications = () => {
    updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  };

  const handleToggleFocusMode = () => {
    updateSettings({ morningFocusMode: !settings.morningFocusMode });
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your tasks, stats, and progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: () => {
            // Would implement full data reset here
            Alert.alert('Data Reset', 'All data has been cleared.');
          }
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
    </View>
  );

  const renderProfileCard = () => (
    <LinearGradient
      colors={colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.profileGradient}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#FFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Discipline Master</Text>
          <Text style={styles.profileLevel}>Level {userStats.level}</Text>
        </View>
      </View>
      
      <View style={styles.xpSection}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpLabel}>XP Progress</Text>
          <Text style={styles.xpValue}>
            {userStats.xp % xpForNextLevel} / {xpForNextLevel}
          </Text>
        </View>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${xpProgress}%` }]} />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={20} color="#FFF" />
          <Text style={styles.statValue}>{userStats.streakDays}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-done" size={20} color="#FFF" />
          <Text style={styles.statValue}>{userStats.totalTasksCompleted}</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="medal" size={20} color="#FFF" />
          <Text style={styles.statValue}>{userStats.badges.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderSettings = () => (
    <View style={styles.settingsSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
      
      <Card style={styles.settingsCard}>
        <SettingItem
          icon="moon"
          title="Dark Mode"
          subtitle="Use dark theme"
          value={settings.darkMode}
          onToggle={handleToggleDarkMode}
          colors={colors}
        />
        <SettingItem
          icon="notifications"
          title="Notifications"
          subtitle="Daily reminders"
          value={settings.notificationsEnabled}
          onToggle={handleToggleNotifications}
          colors={colors}
          isLast
        />
      </Card>

      <Card style={styles.settingsCard}>
        <SettingItem
          icon="sunny"
          title="Morning Focus Mode"
          subtitle="Hide distractions in morning"
          value={settings.morningFocusMode}
          onToggle={handleToggleFocusMode}
          colors={colors}
        />
        <TouchableOpacity style={styles.reminderItem}>
          <View style={styles.reminderLeft}>
            <Ionicons name="time" size={22} color={colors.primary} />
            <View style={styles.reminderText}>
              <Text style={[styles.reminderTitle, { color: colors.text }]}>Reminder Time</Text>
              <Text style={[styles.reminderSubtitle, { color: colors.textSecondary }]}>
                {settings.reminderTime}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>
      
      <Card style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionItem} onPress={() => setShowResetModal(true)}>
          <View style={styles.actionLeft}>
            <Ionicons name="refresh-circle" size={22} color={colors.warning} />
            <Text style={[styles.actionText, { color: colors.text }]}>Reset Streak</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionItem, styles.actionItemLast]} onPress={handleResetData}>
          <View style={styles.actionLeft}>
            <Ionicons name="trash" size={22} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Reset All Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderProfileCard()}
        {renderSettings()}
        {renderActions()}
      </ScrollView>

      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalIcon}>
              <Ionicons name="warning" size={40} color={colors.warning} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Reset Streak?
            </Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Your streak of {userStats.streakDays} days will be reset to 0. This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="ghost"
                onPress={() => setShowResetModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Reset Streak"
                variant="danger"
                onPress={() => {
                  resetStreak();
                  setShowResetModal(false);
                }}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  colors: any;
  isLast?: boolean;
}

function SettingItem({ icon, title, subtitle, value, onToggle, colors, isLast }: SettingItemProps) {
  return (
    <View style={[styles.settingItem, !isLast && styles.settingItemBorder]}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={22} color={colors.primary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
        thumbColor="#FFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
  },
  profileGradient: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  profileInfo: {},
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  profileLevel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  xpSection: {
    marginBottom: spacing.lg,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  xpLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  xpValue: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  settingsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  settingsCard: {
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: spacing.md,
  },
  settingTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  settingSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    marginLeft: spacing.md,
  },
  reminderTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  reminderSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  actionsCard: {},
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionItemLast: {
    borderBottomWidth: 0,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    ...typography.body,
    marginLeft: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalIcon: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});

export default ProfileScreen;
