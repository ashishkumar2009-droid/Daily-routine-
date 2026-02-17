import React from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { useTheme, borderRadius, shadows, typography } from '../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const { colors } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: 16,
    };

    switch (variant) {
      case 'elevated':
        return { ...baseStyle, ...shadows.medium };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return { ...baseStyle, ...shadows.small };
    }
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, subtitle, icon, iconColor, trend }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor || colors.primary}20` }]}>
          <Ionicons name={icon as any} size={20} color={iconColor || colors.primary} />
        </View>
        {trend && (
          <View style={[
            styles.trendBadge,
            { backgroundColor: trend === 'up' ? `${colors.success}20` : trend === 'down' ? `${colors.danger}20` : `${colors.textMuted}20` }
          ]}>
            <Ionicons 
              name={trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'remove'} 
              size={12} 
              color={trend === 'up' ? colors.success : trend === 'down' ? colors.danger : colors.textMuted} 
            />
          </View>
        )}
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.statTitle, { color: colors.textSecondary }]} numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: colors.textMuted }]} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: 140,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statContent: {
    flexDirection: 'column',
  },
  statValue: {
    ...typography.h2,
    fontWeight: '800',
    marginBottom: 4,
  },
  statTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  statSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
});

export default Card;
