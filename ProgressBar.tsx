import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme, borderRadius } from '../lib/theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  progress,
  height = 8,
  animated = true,
  style,
  color,
  backgroundColor,
  showLabel = false,
}: ProgressBarProps) {
  const { colors } = useTheme();
  
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(`${clampedProgress}%`, {
      damping: 15,
      stiffness: 100,
    }),
  }));

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: backgroundColor || colors.surfaceVariant,
            borderRadius: height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color || colors.primary,
              borderRadius: height / 2,
            },
            animated && animatedStyle,
            !animated && { width: `${clampedProgress}%` },
          ]}
        />
      </View>
    </View>
  );
}

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  size = 120,
  strokeWidth = 10,
  progress,
  color,
  backgroundColor,
  children,
}: CircularProgressProps) {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <View style={[styles.circularContainer, { width: size, height: size }]}>
      <View style={StyleSheet.absoluteFill}>
        {/* Background Circle */}
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: backgroundColor || colors.surfaceVariant,
            },
          ]}
        />
        {/* Progress Circle using a simpler approach */}
        <View
          style={[
            styles.progressCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color || colors.primary,
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [
                { rotate: `${-90 + (clampedProgress * 3.6)}deg` },
              ],
            },
          ]}
        />
      </View>
      <View style={styles.centerContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  circularContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  progressCircle: {
    position: 'absolute',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressBar;
