export type TaskType = 'Study' | 'Fitness' | 'Business' | 'Personal';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  duration: number;
  completed: boolean;
  date: string;
  createdAt: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastCompletedDate: string | null;
  totalTasksCompleted: number;
  badges: Badge[];
  weeklyProgress: number[];
  categoryStats: Record<TaskType, number>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: number;
}

export interface AppState {
  tasks: Task[];
  userStats: UserStats;
  settings: AppSettings;
}

export interface AppSettings {
  darkMode: boolean;
  morningFocusMode: boolean;
  notificationsEnabled: boolean;
  reminderTime: string;
}

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  Study: '#8B5CF6',
  Fitness: '#10B981',
  Business: '#3B82F6',
  Personal: '#F59E0B',
};

export const TASK_TYPE_ICONS: Record<TaskType, string> = {
  Study: 'book',
  Fitness: 'fitness',
  Business: 'briefcase',
  Personal: 'heart',
};

export const DAILY_QUOTES = [
  { text: "Success is the sum of small efforts repeated daily.", author: "Robert Collier" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { text: "Your habits determine your future.", author: "Jack Canfield" },
  { text: "Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
];

export const LEVEL_THRESHOLDS = Array.from({ length: 100 }, (_, i) => (i + 1) * 100);

export const BADGES_DEFINITIONS = [
  { id: 'streak-7', name: 'Week Warrior', description: '7-day streak', requirement: 7, type: 'streak' as const },
  { id: 'streak-30', name: 'Monthly Master', description: '30-day streak', requirement: 30, type: 'streak' as const },
  { id: 'streak-100', name: 'Century Champion', description: '100-day streak', requirement: 100, type: 'streak' as const },
  { id: 'tasks-50', name: 'Task Tackler', description: 'Complete 50 tasks', requirement: 50, type: 'tasks' as const },
  { id: 'tasks-100', name: 'Century Tasks', description: 'Complete 100 tasks', requirement: 100, type: 'tasks' as const },
  { id: 'level-10', name: 'Rising Star', description: 'Reach Level 10', requirement: 10, type: 'level' as const },
  { id: 'level-50', name: 'Halfway Hero', description: 'Reach Level 50', requirement: 50, type: 'level' as const },
];
