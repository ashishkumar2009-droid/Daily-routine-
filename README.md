# 🔥 Daily Discipline

A modern, minimal, and high-performance mobile app for daily task completion and habit building.

![Daily Discipline](https://img.shields.io/badge/Daily%20Discipline-Productivity%20App-6366F1)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020)

## ✅ Live Demo

📁 **Web Version:** [https://a4c2us.vercel.app](https://a4c2us.vercel.app)

## 🚀 Features

### 📊 User Dashboard
- Clean UI with **Dark & Light mode** support
- Today's tasks prominently displayed at the top
- **Streak counter** with fire emoji (🔥)
- **Productivity score** in percentage
- XP and Level progression system

### ✅ Daily Task System
- Add, edit, and delete tasks
- **Task categories:** Study, Fitness, Business, Personal
- Set time duration for each task (15-120 minutes)
- Checkbox to mark tasks as completed
- Swipe to edit/delete gestures

### 🏆 Gamification System
- **XP points** for each completed task
- **Level system** (Level 1 to 100)
- **Badge rewards:**
  - Week Warrior (7-day streak)
  - Monthly Master (30-day streak)
  - Century Champion (100-day streak)
  - Task Tackler (50 tasks)
  - Century Tasks (100 tasks)
  - Rising Star (Level 10)
  - Halfway Hero (Level 50)

### 📈 Statistics Page
- **Weekly and monthly** progress charts
- Task completion percentage
- Most consistent category tracking
- Category breakdown pie chart
- Badges showcase

### 🔔 Reminders & Notifications
- Smart daily reminders (configurable time)
- Motivational notification messages
- Push notification support

### 💾 Data Storage
- **Offline data storage** using AsyncStorage
- Persistent task and user stats
- Settings saved locally

### 🎨 Design Style
- Premium UI similar to top productivity apps
- Smooth animations with React Native Reanimated
- Rounded cards and modern typography
- Clean bottom navigation (Home / Stats / Profile)

### ⭐ Extra Features
- **Morning focus mode** - Hide distractions
- **Daily quotes** section
- Reset streak option with warning popup
- Pull-to-refresh on all screens
- Gradient accents and modern visual polish

## 📱 Screenshots

### Home Screen
- Streak counter with flame gradient
- Level and XP progress bar
- Today's tasks list
- Daily motivation quote

### Statistics Screen
- Weekly progress line chart
- Category distribution pie chart
- Completion rate statistics
- Badge collection showcase

### Profile Screen
- User level and XP display
- Settings (Dark mode, Notifications, Focus mode)
- Reset options

### Add Task Screen
- Task title input
- Category selector with color coding
- Duration picker
- Live preview

## 💻 Tech Stack

- **React Native** 0.81.5
- **Expo SDK** 54
- **TypeScript**
- **React Navigation** (Bottom Tabs + Native Stack)
- **React Native Reanimated** (Smooth animations)
- **React Native Gesture Handler** (Swipe gestures)
- **React Native Chart Kit** (Charts & graphs)
- **Expo Linear Gradient** (Gradient backgrounds)
- **AsyncStorage** (Local data persistence)
- **date-fns** (Date manipulation)

## 📝 Project Structure

```
/
├── App.tsx                 # Main entry with navigation
├── app.json               # Expo configuration
├── components/            # Reusable UI components
│   ├── Badge.tsx           # Badge display component
│   ├── Button.tsx          # Custom button with gradient support
│   ├── Card.tsx            # Card wrapper component
│   ├── EmptyState.tsx      # Empty state illustration
│   ├── ProgressBar.tsx     # Linear & circular progress bars
│   ├── QuoteCard.tsx       # Daily quote display
│   └── TaskItem.tsx        # Individual task component
├── screens/               # App screens
│   ├── HomeScreen.tsx      # Dashboard with tasks
│   ├── StatsScreen.tsx     # Statistics & charts
│   ├── ProfileScreen.tsx   # User profile & settings
│   └── AddTaskScreen.tsx   # Add/Edit task form
└── lib/                   # Utilities & context
    ├── context/
    │   └── AppContext.tsx    # Global state management
    ├── storage.ts          # AsyncStorage operations
    ├── theme.ts            # Colors, spacing, typography
    └── types.ts            # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/daily-discipline.git
cd daily-discipline
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npx expo start
```

4. Run on your device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 📱 Building Android APK

### Using EAS Build (Recommended)

1. Install EAS CLI
```bash
npm install -g eas-cli
```

2. Login to Expo account
```bash
eas login
```

3. Configure build
```bash
eas build:configure
```

4. Build APK
```bash
eas build -p android --profile preview
```

### Using Local Build

1. Install Android Studio and Android SDK

2. Build locally
```bash
npx expo prebuild

cd android
./gradlew assembleRelease
```

3. Find APK at `android/app/build/outputs/apk/release/app-release.apk`

## 🔧 Environment Variables

Create a `.env` file for any API keys or configuration:

```env
# Optional: For Google Sign-in (future feature)
GOOGLE_CLIENT_ID=your_client_id

# Optional: For cloud sync (future feature)
API_BASE_URL=https://api.dailydiscipline.app
```

## 📖 Usage Guide

### Creating Your First Task
1. Tap the **+** button on the Home screen
2. Enter a task name
3. Select a category (Study, Fitness, Business, Personal)
4. Choose duration
5. Tap "Create Task"

### Completing Tasks
- Tap the checkbox to mark a task complete
- Earn XP based on task duration
- Build your daily streak

### Tracking Progress
- Visit the **Stats** tab to see:
  - Weekly progress chart
  - Category breakdown
  - Completion rate
  - Earned badges

### Customizing Settings
- Go to **Profile** tab
- Toggle Dark Mode
- Enable/Disable notifications
- Set morning focus mode
- Configure reminder time

## 🎯 Roadmap

- [x] Core task management
- [x] Gamification system (XP, Levels, Badges)
- [x] Statistics and charts
- [x] Dark/Light mode
- [x] Local data persistence
- [ ] Cloud sync with Google account
- [ ] Push notifications
- [ ] Task categories customization
- [ ] Habit templates
- [ ] Social features (friends, leaderboards)
- [ ] iOS widget support
- [ ] Wear OS support

## 📸 Assets

The app uses the following assets:
- Icons from @expo/vector-icons (Ionicons)
- Gradient backgrounds from expo-linear-gradient
- Default splash screen and app icon

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Icons by [Ionicons](https://ionic.io/ionicons)
- Charts by [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit)

---

Made with ❤️ by Daily Discipline Team
