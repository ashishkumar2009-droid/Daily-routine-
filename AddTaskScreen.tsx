import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../lib/context/AppContext';
import { useTheme, spacing, typography, borderRadius } from '../lib/theme';
import { Task, TaskType, TASK_TYPE_COLORS, TASK_TYPE_ICONS } from '../lib/types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';

const TASK_TYPES: TaskType[] = ['Study', 'Fitness', 'Business', 'Personal'];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

export function AddTaskScreen({ navigation, route }: any) {
  const { addTask, updateTask, tasks } = useApp();
  const { colors } = useTheme();
  
  const editingTask: Task | undefined = route.params?.task;
  
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<TaskType>('Personal');
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSelectedType(editingTask.type);
      setDuration(editingTask.duration);
      navigation.setOptions({ title: 'Edit Task' });
    }
  }, [editingTask]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      if (editingTask) {
        await updateTask({
          ...editingTask,
          title: title.trim(),
          type: selectedType,
          duration,
        });
      } else {
        await addTask(title.trim(), selectedType, duration);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task. Please try again.');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>
        {editingTask ? 'Edit Task' : 'New Task'}
      </Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderTitleInput = () => (
    <View style={styles.inputSection}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Task Name</Text>
      <TextInput
        style={[
          styles.titleInput,
          { 
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="What do you need to do?"
        placeholderTextColor={colors.textMuted}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
        autoFocus={!editingTask}
      />
    </View>
  );

  const renderTypeSelector = () => (
    <View style={styles.inputSection}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
      <View style={styles.typeGrid}>
        {TASK_TYPES.map((type) => {
          const isSelected = selectedType === type;
          const typeColor = TASK_TYPE_COLORS[type];
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                { 
                  backgroundColor: isSelected ? typeColor : colors.surface,
                  borderColor: typeColor,
                },
                !isSelected && { borderWidth: 1 },
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Ionicons 
                name={TASK_TYPE_ICONS[type] as any} 
                size={20} 
                color={isSelected ? '#FFF' : typeColor} 
              />
              <Text style={[
                styles.typeText,
                { color: isSelected ? '#FFF' : colors.text },
              ]}>{type}</Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={16} color="#FFF" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderDurationSelector = () => (
    <View style={styles.inputSection}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Duration: <Text style={{ color: colors.text, fontWeight: '600' }}>{duration} minutes</Text>
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.durationContainer}
      >
        {DURATION_OPTIONS.map((mins) => (
          <TouchableOpacity
            key={mins}
            style={[
              styles.durationButton,
              { 
                backgroundColor: duration === mins ? colors.primary : colors.surface,
                borderColor: duration === mins ? colors.primary : colors.border,
              },
              duration !== mins && { borderWidth: 1 },
            ]}
            onPress={() => setDuration(mins)}
          >
            <Text style={[
              styles.durationText,
              { color: duration === mins ? '#FFF' : colors.text },
            ]}>
              {mins}m
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPreview = () => (
    <Card style={styles.previewCard}>
      <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Preview</Text>
      <View style={styles.previewContent}>
        <View style={[
          styles.previewTypeIndicator,
          { backgroundColor: TASK_TYPE_COLORS[selectedType] },
        ]}>
          <Ionicons name={TASK_TYPE_ICONS[selectedType] as any} size={16} color="#FFF" />
        </View>
        <View style={styles.previewText}>
          <Text style={[styles.previewTitle, { color: colors.text }]} numberOfLines={1}>
            {title || 'Task Preview'}
          </Text>
          <Text style={[styles.previewMeta, { color: colors.textSecondary }]}>
            {selectedType} • {duration} min
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {renderHeader()}
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderTitleInput()}
          {renderTypeSelector()}
          {renderDurationSelector()}
          {renderPreview()}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Button
            title={editingTask ? 'Update Task' : 'Create Task'}
            onPress={handleSave}
            gradient
            size="large"
            style={styles.saveButton}
            icon={editingTask ? 'save' : 'add-circle'}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    ...typography.h3,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodySmall,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  titleInput: {
    ...typography.h4,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    minWidth: 100,
  },
  typeText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  durationButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    minWidth: 60,
    alignItems: 'center',
  },
  durationText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  previewCard: {
    marginTop: spacing.md,
  },
  previewLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewTypeIndicator: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  previewText: {
    flex: 1,
  },
  previewTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewMeta: {
    ...typography.caption,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  saveButton: {
    width: '100%',
  },
});

export default AddTaskScreen;
