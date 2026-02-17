import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor,
  useSharedValue,
} from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { Task, TASK_TYPE_COLORS, TASK_TYPE_ICONS } from '../lib/types';
import { useTheme, borderRadius, spacing, typography } from '../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  
  const typeColor = TASK_TYPE_COLORS[task.type];
  const typeIcon = TASK_TYPE_ICONS[task.type];

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: withTiming(task.completed ? 0.6 : 1),
  }));

  const renderRightActions = () => (
    <View style={styles.rightActions}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.warning }]}
        onPress={() => onEdit(task)}
      >
        <Ionicons name="create" size={20} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.danger }]}
        onPress={() => onDelete(task.id)}
      >
        <Ionicons name="trash" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <AnimatedTouchable
        style={[
          styles.container,
          { 
            backgroundColor: colors.surface,
            borderLeftColor: typeColor,
          },
          animatedStyle,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.typeIndicator, { backgroundColor: typeColor }]}>
          <Ionicons name={typeIcon as any} size={14} color="#FFF" />
        </View>
        
        <View style={styles.content}>
          <Text 
            style={[
              styles.title, 
              { color: colors.text },
              task.completed && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.type, { color: typeColor }]}>{task.type}</Text>
            <Text style={[styles.duration, { color: colors.textMuted }]}>
              {task.duration} min
            </Text>
          </View>
        </View>

        <View style={[
          styles.checkbox,
          { 
            borderColor: task.completed ? typeColor : colors.border,
            backgroundColor: task.completed ? typeColor : 'transparent',
          },
        ]}>
          {task.completed && (
            <Ionicons name="checkmark" size={18} color="#FFF" />
          )}
        </View>
      </AnimatedTouchable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeIndicator: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    ...typography.caption,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  duration: {
    ...typography.caption,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
    borderRadius: borderRadius.md,
  },
});

export default TaskItem;
