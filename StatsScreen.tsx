import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useApp } from '../lib/context/AppContext';
import { useTheme, spacing, typography, borderRadius, shadows } from '../lib/theme';
import { Card } from '../components/Card';
import { BadgeItem } from '../components/Badge';
import { TaskType, TASK_TYPE_COLORS } from '../lib/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { format, subDays, startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

type TimeRange = 'week' | 'month';

export function StatsScreen() {
  const { tasks, userStats } = useApp();
  const { colors, isDark } = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const weeklyData = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: today });

    return days.map(day => {
      const dayTasks = tasks.filter(t => 
        isSameDay(new Date(t.date), day) && t.completed
      );
      return dayTasks.length;
    });
  }, [tasks]);

  const categoryData = useMemo(() => {
    const data = Object.entries(userStats.categoryStats)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => ({
        name: category,
        count,
        color: TASK_TYPE_COLORS[category as TaskType],
        legendFontColor: colors.text,
        legendFontSize: 12,
      }));
    return data;
  }, [userStats.categoryStats, colors.text]);

  const completionStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return { totalTasks, completedTasks, completionRate };
  }, [tasks]);

  const mostConsistentCategory = useMemo(() => {
    const entries = Object.entries(userStats.categoryStats);
    if (entries.length === 0) return null;
    return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }, [userStats.categoryStats]);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, weeklyData.length),
    datasets: [{
      data: weeklyData.length > 0 ? weeklyData : [0, 0, 0, 0, 0, 0, 0],
    }],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: borderRadius.lg,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            { backgroundColor: timeRange === 'week' ? colors.primary : colors.surfaceVariant },
          ]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[
            styles.timeRangeText,
            { color: timeRange === 'week' ? '#FFF' : colors.text },
          ]}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            { backgroundColor: timeRange === 'month' ? colors.primary : colors.surfaceVariant },
          ]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[
            styles.timeRangeText,
            { color: timeRange === 'month' ? '#FFF' : colors.text },
          ]}>Month</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOverviewCards = () => (
    <View style={styles.overviewContainer}>
      <Card variant="elevated" style={styles.overviewCard}>
        <View style={styles.overviewIcon}>
          <Ionicons name="checkmark-done" size={24} color={colors.success} />
        </View>
        <Text style={[styles.overviewValue, { color: colors.text }]}>
          {completionStats.completedTasks}
        </Text>
        <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
          Tasks Done
        </Text>
      </Card>

      <Card variant="elevated" style={styles.overviewCard}>
        <View style={styles.overviewIcon}>
          <Ionicons name="trending-up" size={24} color={colors.primary} />
        </View>
        <Text style={[styles.overviewValue, { color: colors.text }]}>
          {completionStats.completionRate}%
        </Text>
        <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
          Success Rate
        </Text>
      </Card>

      <Card variant="elevated" style={styles.overviewCard}>
        <View style={styles.overviewIcon}>
          <Ionicons name="flame" size={24} color="#FF6B6B" />
        </View>
        <Text style={[styles.overviewValue, { color: colors.text }]}>
          {userStats.streakDays}
        </Text>
        <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
          Day Streak
        </Text>
      </Card>
    </View>
  );

  const renderProgressChart = () => (
    <Card variant="elevated" style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Weekly Progress</Text>
        <View style={[styles.trendBadge, { backgroundColor: `${colors.success}20` }]}>
          <Ionicons name="arrow-up" size={12} color={colors.success} />
          <Text style={[styles.trendText, { color: colors.success }]}>+12%</Text>
        </View>
      </View>
      <LineChart
        data={chartData}
        width={screenWidth - 80}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
      />
    </Card>
  );

  const renderCategoryChart = () => (
    <Card variant="elevated" style={styles.chartCard}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>Task Categories</Text>
      {categoryData.length > 0 ? (
        <PieChart
          data={categoryData}
          width={screenWidth - 80}
          height={180}
          chartConfig={chartConfig}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <View style={styles.emptyChart}>
          <Ionicons name="pie-chart" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Complete tasks to see category breakdown
          </Text>
        </View>
      )}
      
      {mostConsistentCategory && (
        <View style={[styles.consistencyBadge, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name="trophy" size={16} color={colors.primary} />
          <Text style={[styles.consistencyText, { color: colors.text }]}>
            Most consistent: <Text style={{ fontWeight: '700', color: colors.primary }}>
              {mostConsistentCategory}
            </Text>
          </Text>
        </View>
      )}
    </Card>
  );

  const renderBadges = () => (
    <View style={styles.badgesSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Badges</Text>
      {userStats.badges.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {userStats.badges.map((badge) => (
            <BadgeItem
              key={badge.id}
              name={badge.name}
              description={badge.description}
              icon={badge.icon}
              earned={true}
            />
          ))}
        </ScrollView>
      ) : (
        <Card variant="outlined" style={styles.emptyBadges}>
          <Ionicons name="medal" size={40} color={colors.textMuted} />
          <Text style={[styles.emptyBadgesText, { color: colors.textSecondary }]}>
            Complete tasks and build streaks to earn badges!
          </Text>
        </Card>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderOverviewCards()}
        {renderProgressChart()}
        {renderCategoryChart()}
        {renderBadges()}
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: borderRadius.full,
    padding: 4,
    gap: 4,
  },
  timeRangeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  timeRangeText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  overviewContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  overviewCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  overviewIcon: {
    marginBottom: spacing.sm,
  },
  overviewValue: {
    ...typography.h2,
    fontWeight: '800',
  },
  overviewLabel: {
    ...typography.caption,
  },
  chartCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chartTitle: {
    ...typography.h4,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  trendText: {
    ...typography.caption,
    fontWeight: '600',
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  emptyChart: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  consistencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  consistencyText: {
    ...typography.bodySmall,
  },
  badgesSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  emptyBadges: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyBadgesText: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default StatsScreen;
