import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, borderRadius, spacing, typography } from '../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

interface BadgeProps {
  name: string;
  description: string;
  icon: string;
  earned?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function BadgeItem({ name, description, icon, earned = true, size = 'medium' }: BadgeProps) {
  const { colors } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return { container: 60, icon: 24 };
      case 'large':
        return { container: 100, icon: 44 };
      default:
        return { container: 80, icon: 32 };
    }
  };

  const sizes = getSize();

  if (!earned) {
    return (
      <View style={styles.container}>
        <View style={[
          styles.badgeContainer,
          {
            width: sizes.container,
            height: sizes.container,
            borderRadius: sizes.container / 2,
            backgroundColor: colors.surfaceVariant,
          },
        ]}>
          <Ionicons name="lock-closed" size={sizes.icon} color={colors.textMuted} />
        </View>
        <Text style={[styles.name, { color: colors.textMuted }]} numberOfLines={1}>
          {name}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.badgeContainer,
          {
            width: sizes.container,
            height: sizes.container,
            borderRadius: sizes.container / 2,
          },
        ]}
      >
        <View style={[
          styles.innerCircle,
          {
            width: sizes.container - 8,
            height: sizes.container - 8,
            borderRadius: (sizes.container - 8) / 2,
            backgroundColor: colors.surface,
          },
        ]}>
          <Ionicons name={icon as any} size={sizes.icon} color="#FFA500" />
        </View>
      </LinearGradient>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
        {description}
      </Text>
    </View>
  );
}

export function BadgeRow({ badges }: { badges: Array<{ id: string; name: string; description: string; icon: string }> }) {
  return (
    <View style={styles.row}>
      {badges.map((badge) => (
        <BadgeItem
          key={badge.id}
          name={badge.name}
          description={badge.description}
          icon={badge.icon}
          earned={true}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    ...typography.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 100,
  },
  description: {
    ...typography.caption,
    textAlign: 'center',
    maxWidth: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: spacing.md,
  },
});

export default BadgeItem;
