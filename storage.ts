import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, UserStats, AppSettings, Badge } from './types';

const STORAGE_KEYS = {
  TASKS: '@daily_discipline_tasks',
  USER_STATS: '@daily_discipline_stats',
  SETTINGS: '@daily_discipline_settings',
};

export const getDefaultUserStats = (): UserStats => ({
  xp: 0,
  level: 1,
  streakDays: 0,
  lastCompletedDate: null,
  totalTasksCompleted: 0,
  badges: [],
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  categoryStats: { Study: 0, Fitness: 0, Business: 0, Personal: 0 },
});

export const getDefaultSettings = (): AppSettings => ({
  darkMode: false,
  morningFocusMode: false,
  notificationsEnabled: true,
  reminderTime: '08:00',
});

export const Storage = {
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      return data ? { ...getDefaultUserStats(), ...JSON.parse(data) } : getDefaultUserStats();
    } catch (error) {
      console.error('Error loading user stats:', error);
      return getDefaultUserStats();
    }
  },

  async saveUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...getDefaultSettings(), ...JSON.parse(data) } : getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return getDefaultSettings();
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export function calculateXPForTask(duration: number, type: string): number {
  const baseXP = Math.max(10, Math.floor(duration / 5));
  const typeMultiplier = type === 'Business' ? 1.2 : 1;
  return Math.floor(baseXP * typeMultiplier);
}

export function calculateLevel(xp: number): number {
  let level = 1;
  let xpRequired = 100;
  let remainingXP = xp;

  while (remainingXP >= xpRequired && level < 100) {
    remainingXP -= xpRequired;
    level++;
    xpRequired = Math.floor(xpRequired * 1.1);
  }

  return level;
}

export function getXPForNextLevel(level: number): number {
  let xpRequired = 100;
  for (let i = 1; i < level; i++) {
    xpRequired = Math.floor(xpRequired * 1.1);
  }
  return xpRequired;
}

export function checkAndAwardBadges(stats: UserStats): Badge[] {
  const newBadges: Badge[] = [];
  const existingBadgeIds = new Set(stats.badges.map(b => b.id));
  
  const { BADGES_DEFINITIONS } = require('./types');
  
  BADGES_DEFINITIONS.forEach((badge: any) => {
    if (existingBadgeIds.has(badge.id)) return;
    
    let earned = false;
    switch (badge.type) {
      case 'streak':
        earned = stats.streakDays >= badge.requirement;
        break;
      case 'tasks':
        earned = stats.totalTasksCompleted >= badge.requirement;
        break;
      case 'level':
        earned = stats.level >= badge.requirement;
        break;
    }
    
    if (earned) {
      newBadges.push({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: getBadgeIcon(badge.id),
        earnedAt: Date.now(),
      });
    }
  });
  
  return [...stats.badges, ...newBadges];
}

function getBadgeIcon(badgeId: string): string {
  const iconMap: Record<string, string> = {
    'streak-7': 'flame',
    'streak-30': 'trophy',
    'streak-100': 'crown',
    'tasks-50': 'checkmark-done',
    'tasks-100': 'star',
    'level-10': 'trending-up',
    'level-50': 'diamond',
  };
  return iconMap[badgeId] || 'medal';
}
