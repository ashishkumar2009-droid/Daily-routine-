import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../lib/context/AppContext';
import { useTheme, spacing, typography, borderRadius, shadows } from '../lib/theme';
import { Task } from '../lib/types';
import { getXPForNextLevel } from '../lib/storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TaskItem } from '../components/TaskItem';
import { QuoteCard } from '../components/QuoteCard';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';

export function HomeScreen({ navigation }: any) {
  const { 
    tasks, 
    userStats, 
    settings, 
    toggleTask, 
    deleteTask, 
    resetStreak,
    getTodaysTasks, 
    getCompletionRate,
    dailyQuote,
    refreshData,
    isLoading 
  } = useApp();
  
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const todaysTasks = getTodaysTasks();
  const completionRate = getCompletionRate();
  const xpForNextLevel = getXPForNextLevel(userStats.level);
  const xpProgress = (userStats.xp % xpForNextLevel) / xpForNextLevel * 100;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId) },
      ]
    );
  };

  const handleResetStreak = () => {
    Alert.alert(
      'Reset Streak',
      'Are you sure? Your streak will be reset to 0. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetStreak() },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          {format(new Date(), 'EEEE, MMMM d')}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>Daily Discipline</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => setFocusMode(!focusMode)}
        >
          <Ionicons 
            name={focusMode ? 'sunny' : 'moon'} 
            size={20} 
            color={focusMode ? colors.warning : colors.textSecondary} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatsSection = () => (
    <View style={styles.statsContainer}>
      <Card variant="elevated" style={styles.streakCard}>
        <LinearGradient
          colors={['#FF6B6B', '#FFA07A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakGradient}
        >
          <View style={styles.streakContent}>
            <Ionicons name="flame" size={32} color="#FFF" />
            <View style={styles.streakText}>
              <Text style={styles.streakNumber}>{userStats.streakDays}</Text>
              <Text style={styles.streakLabel}>Day Streak 🔥</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleResetStreak} style={styles.resetButton}>
            <Ionicons name="refresh" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </LinearGradient>
      </Card>

      <View style={styles.sideStats}>
        <Card variant="elevated" style={styles.levelCard}>
          <View style={styles.levelContent}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>Lv.{userStats.level}</Text>
            </View>
            <View style={styles.xpContainer}>
              <ProgressBar progress={xpProgress} height={4} color={colors.accent} />
              <Text style={[styles.xpText, { color: colors.textMuted }]}>
                {userStats.xp % xpForNextLevel} / {xpForNextLevel} XP
              </Text>
            </View>
          </View>
        </Card>

        <Card variant="elevated" style={styles.completionCard}>
          <View style={styles.completionContent}>
            <Text style={[styles.completionValue, { color: colors.text }]}>{completionRate}%</Text>
            <Text style={[styles.completionLabel, { color: colors.textSecondary }]}>Today's Progress</Text>
          </View>
          <View style={styles.completionRing}>
            <View style={[styles.ring, { 
              borderColor: completionRate >= 50 ? colors.success : colors.warning,
              backgroundColor: `${completionRate >= 50 ? colors.success : colors.warning}20`,
            }]}>
              <Ionicons 
                name={completionRate >= 50 ? 'checkmark-circle' : 'time'} 
                size={20} 
                color={completionRate >= 50 ? colors.success : colors.warning} 
              />
            </View>
          </View>
        </Card>
      </View>
    </View>
  );

  const renderTaskSection = () => (
    <View style={styles.tasksSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Tasks</Text>
        <Text style={[styles.taskCount, { color: colors.textMuted }]}>
          {todaysTasks.filter(t => t.completed).length}/{todaysTasks.length} done
        </Text>
      </View>

      {todaysTasks.length === 0 ? (
        <EmptyState
          icon="clipboard"
          title="No tasks yet"
          description="Add your first task to start building your daily discipline"
          actionLabel="Add Task"
          onAction={() => navigation.navigate('AddTask')}
        />
      ) : (
        <FlatList
          data={todaysTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleTask}
              onDelete={handleDeleteTask}
              onEdit={(task) => navigation.navigate('AddTask', { task })}
            />
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  if (focusMode) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.focusHeader}>
          <Text style={[styles.focusTitle, { color: colors.text }]}>🎯 Morning Focus Mode</Text>
          <TouchableOpacity onPress={() => setFocusMode(false)}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.focusContent}>
          <Text style={[styles.focusSubtitle, { color: colors.textSecondary }]}>
            Focus on completing {todaysTasks.filter(t => !t.completed).length} remaining tasks
          </Text>
          <QuoteCard quote={dailyQuote.text} author={dailyQuote.author} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderHeader()}
        {renderStatsSection()}
        <QuoteCard quote={dailyQuote.text} author={dailyQuote.author} />
        {renderTaskSection()}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  greeting: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    ...typography.h2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  statsContainer: {
    padding: spacing.md,
    gap: spacing.md,
  },
  streakCard: {
    padding: 0,
    overflow: 'hidden',
  },
  streakGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: spacing.md,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
  },
  streakLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  resetButton: {
    padding: spacing.sm,
  },
  sideStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  levelCard: {
    flex: 1,
  },
  levelContent: {
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  levelNumber: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  xpContainer: {
    width: '100%',
    alignItems: 'center',
  },
  xpText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  completionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completionContent: {
    flex: 1,
  },
  completionValue: {
    ...typography.h2,
    fontWeight: '800',
  },
  completionLabel: {
    ...typography.caption,
  },
  completionRing: {},
  ring: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksSection: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
  },
  taskCount: {
    ...typography.bodySmall,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  focusTitle: {
    ...typography.h3,
  },
  focusContent: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  focusSubtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default HomeScreen;
