# Team Mechtrolicz: Habit & Routine Planner — Project Handover & System Architecture Documentation

**Team Name:** Mechtrolicz  
**Project Name:** Habit & Routine Planner (`HabitRoutine Productivity Suite — Swaphathon Edition`)  
**Version:** 2.0.0 (Swaphathon Milestone Release)  
**Generated Date:** September 2026  
**Repository Path:** `mechtrolicz habit tracker`  

---

## 1. Executive Summary & Technology Stack

The **Habit & Routine Planner** by **Team Mechtrolicz** is an all-in-one personal productivity, fitness conditioning, and nutritional wellness web application. Built for modern browsers, it unifies habit streak tracking, 24-hour block routine scheduling, milestone goal tracking, deep behavioral analytics, adaptive routine heuristics, gamification (XP, ranks, levels, trophy badges), a simulated smartwatch Calorie Count Watch, and three major new modules introduced for the **Swaphathon** hackathon:

1. **Goal-Based Nutrition & Recipe Hub:** Intelligent dietary planner filtered by Weight Loss, Weight Gain, and Micronutrient-Dense Maintenance with "Eat the Rainbow" tracking.
2. **Gender-Specific Workout & Training Scheduler:** Specialized training schedules for Men and Women with targeted routine focuses, interactive set/rep checkboxes, and built-in Pomodoro/rest timers.
3. **Unified Fitness & Food Planner:** A full-page split-screen dashboard pairing live workout routines with single-click macro-logging and a real-time progress gauge.

### Core Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | [React 19](https://react.dev/) | Modern functional components, hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) + Custom CSS3 | Tailwind utility classes paired with custom CSS custom properties (tokens), responsive glassmorphism, and micro-animations |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean vector iconography across all dashboard views, meal cards, and workout sets |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/) | Rollup/esbuild bundling, ultra-fast HMR compilation, zero-latency asset generation |
| **Audio Feedback** | Native Web Audio API | Zero external audio asset dependencies; synthesized harmonic chimes, click tones, and level-up fanfares |
| **Milestone Celebrations** | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | Multi-color dynamic particle bursts for workout completions, streak milestones, and goal achievements |
| **State Persistence** | Browser `localStorage` | Fully client-side, local-first offline storage with JSON backup and restore capabilities |
| **Typography** | Google Fonts | `Outfit` (headings & score gauges) and `Plus Jakarta Sans` (body and UI labels) |

---

## 2. Project Directory Structure

```text
mechtrolicz habit tracker/
├── index.html                           # App entry point, Tailwind CSS configuration, Google Fonts
├── package.json                         # Dependencies & scripts
├── vite.config.js                       # Vite build configuration with React plugin
├── serve.ps1                            # Standalone PowerShell HTTP web server (localhost:8080)
├── HANDOVER.md                          # Team Mechtrolicz handover & architecture documentation
├── Habit_Routine_Planner_Project (2).md # Original project requirement specifications
├── dist/                                # Compiled production bundle (HTML, JS, CSS, static guide)
├── src/
│   ├── main.jsx                         # React root mount point
│   ├── App.jsx                          # Main controller, global state management, modal controllers
│   ├── index.css                        # Complete design system tokens, animations, responsive layout
│   ├── components/
│   │   ├── Navbar.jsx                   # Top header with date, quick stats, theme/audio toggles & CTA
│   │   ├── Sidebar.jsx                  # Left vertical navigation with 12 tabs, badges & level XP
│   │   ├── DashboardView.jsx            # Central overview: habit checklist, timeline, consistency gauge
│   │   ├── CalorieWatch.jsx             # Smartwatch dial simulator, live workout stopwatch & logger
│   │   ├── NutritionHub.jsx             # [NEW] Goal-Based Nutrition & Recipe Hub
│   │   ├── WorkoutScheduler.jsx         # [NEW] Gender-Specific Workout & Training Scheduler
│   │   ├── FitnessPlanner.jsx           # [NEW] Full-Page Unified Fitness & Food Planner
│   │   ├── NutritionView.jsx            # Daily nutrition & fitness meal guide overview
│   │   ├── HabitsView.jsx               # Habit management, category & priority filtering, CRUD actions
│   │   ├── ScheduleView.jsx             # 24-hour block schedule timeline, time-of-day filters, postponement
│   │   ├── GoalsView.jsx                # Milestones & goals grid with progress adjustment & completion trigger
│   │   ├── AnalyticsView.jsx            # 35-day heatmap, consistency score, day-of-week trends, category balance
│   │   ├── RewardsView.jsx              # Gamification ranks, XP bar, points guide, trophy badge showcase
│   │   ├── SettingsView.jsx             # User profile editor, audio toggle, theme toggle, JSON backup & restore
│   │   └── Modals/
│   │       ├── HabitModal.jsx           # Create / Edit habit modal with full attribute form
│   │       ├── ScheduleModal.jsx        # Add routine schedule block with habit linking
│   │       ├── GoalModal.jsx            # Create milestone goal with target metrics and deadlines
│   │       └── CelebrationModal.jsx     # Full-screen pop-in modal with confetti & audio fanfare
│   └── utils/
│       ├── audio.js                     # Synthesized Web Audio API sound generator (chimes, clicks, fanfares)
│       ├── storage.js                   # LocalStorage persistence, seed data generator, 35-day completion mock
│       └── suggestions.js               # Personalized recommendations & adaptive routine heuristics
```

---

## 3. Comprehensive Feature Breakdown

### 3.1. Main Dashboard (`DashboardView.jsx`)
* **Hero Welcome Banner:** Greets the user dynamically by name, displays their active streak in days, remaining habits required to achieve 100% daily completion, daily progress percentage, active streak, and accumulated score points.
* **Smart Suggestion Banner:** Highlights the highest-priority personalized routine recommendation (generated by `suggestions.js`) with a 1-click **Apply** button.
* **Today's Habits Checklist:** Interactive checkmark button for each habit, category badge, priority badge, target amount (e.g. `500 ml`, `90 mins`), streak badge with flame icon, and real-time XP & point additions/deductions upon completion.
* **Today's Routine Timeline:** Chronologically ordered activities for the current day with instant completion status toggling and quick links to the full Schedule view.
* **Circular Consistency Gauge:** Animated SVG concentric ring displaying today's completion percentage (`0%` to `100%`) with dynamic motivational status text.
* **Calorie Count Watch Snapshot Card:** Live intake vs. burned calories and net calories balance.
* **Active Goals Preview & Unlocked Trophies:** Live progress bars and achievement trophy badges.

---

### 3.2. Calorie Count Watch Module (`CalorieWatch.jsx`)
* **Interactive Smartwatch Device Bezel:** Digital watch case with bezel, crown button, live digital clock, animated heart-rate indicator (`74 bpm` with pulsing glow), and battery level (`98% 🔋`).
* **Concentric Dual Activity Rings (SVG):** Outer Ring (Rose) tracking calorie intake vs. target, and Inner Ring (Emerald) tracking active calories burned vs. burn target.
* **Active Workout Live Stopwatch:** Live workout stopwatch supporting HIIT Cardio, Running, Cycling, Strength Training, and Brisk Walking with dynamic burn calculation and "+15 XP" saving.
* **Hydration Tracker:** Visual water progress bar tracking current intake against daily target (e.g. `1500 / 2500 ml`) with quick `+250 ml` button.
* **Quick Calorie Presets & Custom Meal Intake Logger:** One-click logging buttons (`+150 kcal`, `+280 kcal`, `+500 kcal`, `+750 kcal`) and custom food logging with macro fields.

---

### 3.3. [NEW] Goal-Based Nutrition & Recipe Hub (`NutritionHub.jsx`)
A specialized nutritional wellness section developed for the Swaphathon challenge:
* **Goal Selector:** Responsive tab toggle supporting three distinct dietary regimes:
  1. `Weight Loss`: High-protein, high-fiber, low-calorie-density meal suggestions with prep times and macros.
  2. `Weight Gain`: Calorie-dense, nutrient-rich meals, mass-builder smoothies, and healthy fats.
  3. `Nutrient-Dense Maintenance`: Micronutrient-rich meals categorized by core physiological benefits.
* **Core Benefit Filtering:** For `Nutrient-Dense Maintenance`, users can filter recipes using quick chips:
  * `🛡️ Immunity` (e.g., Rainbow Immunity Salad, Garlic & Ginger Bone Broth)
  * `⚡ High Energy` (e.g., Matcha Chia Energy Pudding, Turmeric Golden Milk Oats)
  * `🌱 Gut Health` (e.g., Kimchi & Brown Rice Bowl, Fermented Yogurt Gut-Heal Bowl)
* **Recipe & Meal Library Cards:**
  * Title, visual food emoji, prep time, difficulty badge, and dietary tags.
  * Complete macronutrient breakdown: **Calories**, **Protein (g)**, **Carbs (g)**, and **Fats (g)**.
  * Expandable ingredient checklist with accordion toggle.
* **Interactive Meal Tracker ("Add to Today's Routine"):**
  * One-click action on any recipe card automatically converts the meal into a scheduled item in today's 24-hour routine.
  * Simultaneously syncs the meal and its exact calories, protein, carbs, and fats into `data.calories.intake`.
  * Awards `+10` points and `+15 XP` to the user profile.
* **Micro-Nutrient Quick Log:**
  * **🌈 Eat the Rainbow Checklist:** 6-color phytonutrient tracker (Red Lycopene, Orange Beta-carotene, Yellow Vitamin A/C, Green Folate/Iron, Blue/Purple Anthocyanins, White Allicin/Quercetin) with interactive checkmarks and progress counter.
  * **Daily Targets:** Clean progress bars with `+` quick-log buttons for **Water** (2500ml), **Protein** (140g), **Fiber** (30g), and **Vitamins** (5 servings).

---

### 3.4. [NEW] Gender-Specific Workout & Training Scheduler (`WorkoutScheduler.jsx`)
A dedicated exercise scheduling module designed to cater to biological training adaptations:
* **Profile Setup & Onboarding:**
  * Switcher between **Women's Training** and **Men's Training**.
  * Goal alignment selector: `Weight Loss`, `Muscle Gain`, and `Tone & Mobility`.
* **Tailored Weekly Training Schedules:**
  * Complete 7-day calendar matrix displaying daily workout emojis, titles, durations, completion checkmarks, and rest days.
* **Dedicated Focus Routines:**
  * **Women's Focus Areas:**
    * *🍑 Glute/Leg Development* (Glute & Leg Sculpt, Glute & Hamstring Power, Lower Body Barre)
    * *💪 Upper Body Tone* (Upper Body Tone, Upper Body Sculpt, Upper Body Strength)
    * *🎯 Core Strength* (Core Strength Session, Pilates Core & Tone, Core & Conditioning)
    * *⚡ Low-Impact HIIT* (Full Body HIIT, Low-Impact HIIT, Full Body Circuit)
    * *🌊 Cycle-Syncing Mobility* (Cycle-Sync Mobility, Yoga Flow & Stretch, Mobility & Recovery)
  * **Men's Focus Areas:**
    * *🏋️ Push/Pull/Legs (PPL) Splits* (Push Day, Pull Day, Leg Day)
    * *💥 Hypertrophy* (Chest, Back, Leg, Shoulder, and Arm Hypertrophy days)
    * *🎯 Upper/Lower Splits* (Upper/Lower Strength A & B)
    * *🔥 High-Intensity Bodyweight Conditioning* (HIIT Bodyweight Conditioning, Metabolic AMRAP Circuit, Cardio Sprints)
* **Interactive Workout Card UI:**
  * Workout title, estimated duration, difficulty level, and target muscle tags.
  * Expandable exercise list with set count, rep range, and rest intervals.
  * Interactive set/rep counter buttons and checkboxes with strike-through completion styling.
* **Built-in Pomodoro / Rest Timer:**
  * "Start Workout Timer" button launching a dedicated rest timer.
  * Selectable rest presets: `30s`, `45s`, `60s`, `90s`, `120s`.
  * Play, Pause, and Reset controls with an animated progress bar and audio chime upon timer expiry.
* **Streak & Completion Sync:**
  * Completing all exercises in a workout automatically marks today's **Fitness Habit** as completed in the main dashboard.
  * Automatically advances the habit streak counter.
  * Automatically logs `+320 kcal` burned into the Calorie Watch history.
  * Awards `+25` points and `+30 XP` to the user profile.
  * Triggers harmonic Web Audio fanfare and canvas confetti particles.

---

### 3.5. [NEW] Unified Fitness & Food Planner Dashboard (`FitnessPlanner.jsx`)
A full-page split-screen command center uniting workouts and nutrition in real time:
* **Header Bar Profile Switcher:**
  * Quick profile switcher:
    * **Gender:** `♂ Male` / `♀ Female`
    * **Goal:** `Weight Loss` / `Weight Gain`
    * **Daily Energy Level:** `🔋 Low` / `⚡ Medium` / `🚀 High`
* **Main Split View:**
  * **Left Column (Today's Workout Schedule):**
    * Dynamic workout plan generated from the selected gender and goal combination.
    * Interactive set completion buttons for each exercise.
    * Real-time workout completion percentage bar.
    * Embedded **Between-Set Rest Timer** widget with countdown, play/pause, and reset controls.
    * Automatic completion celebration and habit sync when 100% of sets are checked off.
  * **Right Column (Nutrition & Meals):**
    * Meal suggestions organized by slot: *Breakfast*, *Snack*, *Lunch*, and *Dinner*.
    * Displays macros: Calories, Protein, Carbs, and Fats.
    * Single-click `+` button to log individual meals directly into the daily total.
    * Real-time counters for Calories logged, Protein consumed, and Meals completed.
* **Bottom Summary Bar:**
  * Circular SVG overall routine completion percentage gauge.
  * Status feedback: *"Outstanding!"*, *"Keep Going!"*, *"Just Started!"*.
  * Progress meters for Workout Sets, Meals Logged, Protein Target, and Calorie Target.
  * Persisted locally using React state hooks with sync to global planner data.

---

### 3.6. Nutrition Guide (`NutritionView.jsx`)
* Interactive guide covering foundational fitness nutrition, nutrient balance, and hydration timing.
* Embedded link to the full standalone nutrition guide (`nutrition.html`).

---

### 3.7. Habit Management (`HabitsView.jsx` & `HabitModal.jsx`)
* **Habit Creation & Editing:** Category, priority, frequency, target quantity, reminder time, and color coding.
* **Interactive Completion Tracking:** Click to complete with sound effects, streak calculation, and XP rewards.
* **Filtering System:** Filter by category (`Health`, `Fitness`, `Work`, `Study`, `Personal Development`) and priority (`High`, `Medium`, `Low`).

---

### 3.8. Daily Routine & Schedule Management (`ScheduleView.jsx` & `ScheduleModal.jsx`)
* **Chronological 24-Hour Timeline:** Visual blocks organizing activities from morning to night.
* **Time-of-Day Filter Tabs:** All Day, Morning, Afternoon, and Evening windows.
* **Task Postponement (+30 Min):** Advances any schedule item by 30 minutes with hour/minute rollover.
* **Habit Linking & Activity CRUD:** Link scheduled activities to habits and create custom blocks.

---

### 3.9. Goals & Milestones (`GoalsView.jsx` & `GoalModal.jsx`)
* **Progress Tracking:** Increment and decrement buttons directly on goal cards.
* **Automatic Goal Completion:** Reaching target unlocks the **Goal Crusher** badge (`+100 pts`) with confetti.

---

### 3.10. Productivity Analytics (`AnalyticsView.jsx`)
* **35-Day Consistency Heatmap:** Color-graded 5-week intensity grid with day tooltips.
* **Day-of-Week Trends:** Visual bar chart comparing productivity across days of the week.
* **Category Balance:** Percentage distribution across active habit categories.

---

### 3.11. Rewards, XP & Gamification (`RewardsView.jsx`)
* **Level Progression:** Dynamic XP meter with leveling formula (`nextLevelXP = Math.round(nextLevelXP * 1.4)`).
* **Trophy Badges:** First Step, 7-Day Blaze, Early Bird, Goal Crusher, 30-Day Master, and Night Owl Focus.

---

### 3.12. Adaptive Routine Engine (`suggestions.js`)
* Suggestion rules for target level-ups, timing optimization, and habit stacking with 1-click application.

---

### 3.13. Web Audio Engine (`audio.js`)
* Procedural sound synthesizers for success chimes, fanfares, and button clicks with global mute toggle.

---

### 3.14. Settings & Data Portability (`SettingsView.jsx`)
* User profile editing, theme toggle (Light/Dark), JSON export/import backup, and demo reset.

---

### 3.15. Global Navigation (`Sidebar.jsx` & `Navbar.jsx`)
* **12 Sidebar Navigation Tabs:**
  1. `Dashboard` (LayoutDashboard)
  2. `Habits` (CheckCircle2)
  3. `Calorie Watch` (Watch)
  4. `Daily Routine` (Calendar)
  5. `Goals` (Target)
  6. `Analytics` (BarChart3)
  7. `Rewards & XP` (Trophy)
  8. `Nutrition Guide` (Salad)
  9. `Nutrition Hub` (ChefHat) — *[Swaphathon]*
  10. `Workout Planner` (Dumbbell) — *[Swaphathon]*
  11. `Fit & Food Plan` (LayoutPanelLeft) — *[Swaphathon]*
  12. `Settings` (Settings)

---

## 4. State Management & Data Schema

The entire state is maintained in `App.jsx` and synchronized to `localStorage` under key `'habit_routine_planner_data_v1'`.

```typescript
interface PlannerState {
  user: {
    name: string;
    email: string;
    level: number;
    levelTitle: string;
    currentXP: number;
    nextLevelXP: number;
    totalPoints: number;
    streak: number;
    longestStreak: number;
    theme: 'light' | 'dark';
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  };
  habits: Array<{
    id: string;
    name: string;
    description: string;
    category: 'Health' | 'Work' | 'Fitness' | 'Study' | 'Personal Development';
    frequency: 'Daily' | 'Weekdays' | 'Custom';
    days: string[];
    target: number;
    unit: string;
    reminderTime: string;
    priority: 'High' | 'Medium' | 'Low';
    color: string;
    createdAt: string;
    isActive: boolean;
    streak: number;
  }>;
  completions: Record<string, {
    id: string;
    habitId: string;
    date: string;
    status: 'completed' | 'skipped' | 'missed';
    value: number;
    note: string;
  }>;
  schedule: Array<{
    id: string;
    title: string;
    time: string;
    duration: number;
    category: string;
    status: 'completed' | 'pending';
    linkedHabitId: string | null;
    source?: string;
    macros?: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
  }>;
  goals: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    target: number;
    currentProgress: number;
    unit: string;
    deadline: string;
    status: 'active' | 'completed';
    linkedHabitIds: string[];
  }>;
  badges: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    points: number;
    unlocked: boolean;
    unlockedAt: string | null;
  }>;
  calories: {
    dailyTarget: number;
    burnedTarget: number;
    waterTarget: number;
    waterConsumed: number;
    intake: Array<{
      id: string;
      name: string;
      calories: number;
      meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Quick Snack';
      time: string;
      protein?: number;
      carbs?: number;
      fat?: number;
    }>;
    burned: Array<{
      id: string;
      name: string;
      calories: number;
      time: string;
      source: string;
      duration?: number;
    }>;
  };
}
```

---

## 5. Development, Build & Execution Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **PowerShell**: v5.1 or PowerShell Core (Windows native)

### Running Locally on Localhost

#### Option A: Native Standalone HTTP Server (Recommended)
To run the production build immediately without starting Node dev daemons:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
The server will bind to `http://localhost:8080/` and serve all compiled assets from `dist/`.

#### Option B: Vite Development Server
```powershell
npm run dev
```
Starts the Vite dev server with instant HMR at `http://localhost:5173/`.

### Production Build
To re-compile and bundle all React components and Tailwind styling:
```powershell
npm run build
```
Optimized assets are written to `dist/index.html` and `dist/assets/`.

---

## 6. Swaphathon Highlights & Architecture Decisions

1. **Cross-Module Reactive Synchronization:**
   - Logging a meal from the **Nutrition Hub** automatically updates the 24-hour **Daily Routine** and registers in the **Calorie Count Watch**.
   - Completing a session in the **Workout Scheduler** automatically credits the daily **Fitness Habit**, bumps streaks, records active calories burned, and triggers celebration fanfares.
2. **Built-in Rest & Recovery Timer:**
   - Both the **Workout Scheduler** and **Fitness Planner** feature integrated countdown rest timers (with 30s, 45s, 60s, 90s, 120s presets), eliminating the need for third-party stopwatch apps.
3. **Gender-Specific Biological Adaptations:**
   - Workouts and macro distributions distinguish between Men's (PPL, Hypertrophy, Upper/Lower) and Women's (Glute/Leg, Cycle-Syncing, Low-Impact HIIT, Upper Tone) physiological recovery patterns.
4. **Tailwind CSS Utility Coexistence:**
   - Integrated with zero styling collisions alongside custom CSS design tokens by scoping utilities and disabling conflicting CSS resets (`preflight: false`).

---
*Document maintained and certified by **Team Mechtrolicz**.*
