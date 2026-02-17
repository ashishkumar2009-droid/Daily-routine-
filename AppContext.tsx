import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, UserStats, AppSettings, TaskType } from '../types';
import { 
  Storage, 
  calculateXPForTask, 
  calculateLevel, 
  checkAndAwardBadges,
  getDefaultUserStats,
  getDefaultSettings
} from '../storage';
import { format, isSameDay, parseISO, subDays } from 'date-fns';

interface AppState {
  tasks: Task[];
  userStats: UserStats;
  settings: AppSettings;
  isLoading: boolean;
  dailyQuote: { text: string; author: string };
}

type AppAction =
  | { type: 'SET_STATE'; payload: Partial<AppState> }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: { taskId: string; completed: boolean } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'UPDATE_STATS'; payload: Partial<UserStats> }
  | { type: 'RESET_STREAK' }
  | { type: 'SET_QUOTE'; payload: { text: string; author: string } };

interface AppContextType extends AppState {
  addTask: (title: string, type: TaskType, duration: number) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  resetStreak: () => Promise<void>;
  getTodaysTasks: () => Task[];
  getCompletionRate: () => number;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DAILY_QUOTES = [
  { text: "Success is the sum of small efforts repeated daily.", author: "Robert Collier" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { text: "Your habits determine your future.", author: "Jack Canfield" },
  { text: "Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.taskId ? { ...t, completed: action.payload.completed } : t
        ),
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'UPDATE_STATS':
      return { ...state, userStats: { ...state.userStats, ...action.payload } };
    case 'RESET_STREAK':
      return {
        ...state,
        userStats: { ...state.userStats, streakDays: 0, lastCompletedDate: null },
      };
    case 'SET_QUOTE':
      return { ...state, dailyQuote: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    tasks: [],
    userStats: getDefaultUserStats(),
    settings: getDefaultSettings(),
    isLoading: true,
    dailyQuote: getDailyQuote(),
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [tasks, userStats, settings] = await Promise.all([
        Storage.getTasks(),
        Storage.getUserStats(),
        Storage.getSettings(),
      ]);
      
      dispatch({
        type: 'SET_STATE',
        payload: { tasks, userStats, settings, isLoading: false },
      });
    } catch (error) {
      console.error('Error loading initial data:', error);
      dispatch({ type: 'SET_STATE', payload: { isLoading: false } });
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const addTask = async (title: string, type: TaskType, duration: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      type,
      duration,
      completed: false,
      date: format(new Date(), 'yyyy-MM-dd'),
      createdAt: Date.now(),
    };
    
    dispatch({ type: 'ADD_TASK', payload: newTask });
    await Storage.saveTasks([...state.tasks, newTask]);
  };

  const updateTask = async (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
    await Storage.saveTasks(state.tasks.map(t => t.id === task.id ? task : t));
  };

  const deleteTask = async (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    await Storage.saveTasks(state.tasks.filter(t => t.id !== taskId));
  };

  const toggleTask = async (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    dispatch({ type: 'TOGGLE_TASK', payload: { taskId, completed: newCompleted } });

    let updatedStats = { ...state.userStats };

    if (newCompleted) {
      const xp = calculateXPForTask(task.duration, task.type);
      updatedStats.xp += xp;
      updatedStats.level = calculateLevel(updatedStats.xp);
      updatedStats.totalTasksCompleted += 1;
      updatedStats.categoryStats[task.type] += 1;
      
      const today = format(new Date(), 'yyyy-MM-dd');
      if (updatedStats.lastCompletedDate !== today) {
        if (updatedStats.lastCompletedDate) {
          const lastDate = parseISO(updatedStats.lastCompletedDate);
          const yesterday = subDays(new Date(), 1);
          if (isSameDay(lastDate, yesterday)) {
            updatedStats.streakDays += 1;
          } else if (!isSameDay(lastDate, new Date())) {
            updatedStats.streakDays = 1;
          }
        } else {
          updatedStats.streakDays = 1;
        }
        updatedStats.lastCompletedDate = today;
      }
    } else {
      const xp = calculateXPForTask(task.duration, task.type);
      updatedStats.xp = Math.max(0, updatedStats.xp - xp);
      updatedStats.level = calculateLevel(updatedStats.xp);
      updatedStats.totalTasksCompleted = Math.max(0, updatedStats.totalTasksCompleted - 1);
      updatedStats.categoryStats[task.type] = Math.max(0, updatedStats.categoryStats[task.type] - 1);
    }

    updatedStats.badges = checkAndAwardBadges(updatedStats);
    dispatch({ type: 'UPDATE_STATS', payload: updatedStats });
    await Storage.saveUserStats(updatedStats);
    await Storage.saveTasks(state.tasks.map(t => t.id === taskId ? { ...t, completed: newCompleted } : t));
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    await Storage.saveSettings({ ...state.settings, ...newSettings });
  };

  const resetStreak = async () => {
    dispatch({ type: 'RESET_STREAK' });
    await Storage.saveUserStats({ ...state.userStats, streakDays: 0, lastCompletedDate: null });
  };

  const getTodaysTasks = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return state.tasks.filter(t => t.date === today);
  };

  const getCompletionRate = () => {
    const todayTasks = getTodaysTasks();
    if (todayTasks.length === 0) return 0;
    return Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        updateSettings,
        resetStreak,
        getTodaysTasks,
        getCompletionRate,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
