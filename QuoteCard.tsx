import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, borderRadius, spacing, typography } from '../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

interface QuoteCardProps {
  quote: string;
  author: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.quoteIcon}>
        <Ionicons name="quote" size={24} color="rgba(255,255,255,0.3)" />
      </View>
      <Text style={styles.quote}>{quote}</Text>
      <Text style={styles.author}>— {author}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  quote: {
    ...typography.body,
    color: '#FFFFFF',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  author: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
});

export default QuoteCard;
