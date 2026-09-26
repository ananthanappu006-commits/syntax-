// Storage utility with realistic mock data and persistence
const STORAGE_KEY = 'habit_routine_planner_data_v1';

// Helper to format date YYYY-MM-DD
export function formatDate(date) {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();

  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

export function getTodayDate() {
  return formatDate(new Date());
}

// Generate past N days dates
export function getPastDates(numDays) {
  const dates = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

// Initial realistic default state
export function getInitialData() {
  const today = getTodayDate();
  const past30Days = getPastDates(35);

  const initialHabits = [
    {
      id: 'h-1',
      name: 'Morning Hydration & Electrolytes',
      description: 'Drink 500ml warm lemon water upon waking',
      category: 'Health',
      frequency: 'Daily',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      target: 500,
      unit: 'ml',
      reminderTime: '07:00',
      priority: 'High',
      color: '#06b6d4', // Cyan
      createdAt: '2026-08-01',
      isActive: true,
      streak: 14,
    },
    {
      id: 'h-2',
      name: 'Deep Work & Coding',
      description: 'Focus block on core software architecture without distractions',
      category: 'Work',
      frequency: 'Weekdays',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      target: 90,
      unit: 'mins',
      reminderTime: '09:30',
      priority: 'High',
      color: '#6366f1', // Indigo
      createdAt: '2026-08-05',
      isActive: true,
      streak: 9,
    },
    {
      id: 'h-3',
      name: 'Strength & Mobility Workout',
      description: 'Compound resistance training or calisthenics session',
      category: 'Fitness',
      frequency: 'Custom',
      days: ['Mon', 'Wed', 'Fri', 'Sat'],
      target: 45,
      unit: 'mins',
      reminderTime: '17:30',
      priority: 'Medium',
      color: '#10b981', // Emerald
      createdAt: '2026-08-10',
      isActive: true,
      streak: 6,
    },
    {
      id: 'h-4',
      name: 'Read Non-Fiction & Tech Books',
      description: 'Read 20 pages of system design or psychology',
      category: 'Study',
      frequency: 'Daily',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      target: 20,
      unit: 'pages',
      reminderTime: '21:00',
      priority: 'Medium',
      color: '#f59e0b', // Amber
      createdAt: '2026-08-12',
      isActive: true,
      streak: 11,
    },
    {
      id: 'h-5',
      name: 'Mindfulness & Evening Reflection',
      description: '10 minutes guided breathing and gratitude journaling',
      category: 'Personal Development',
      frequency: 'Daily',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      target: 10,
      unit: 'mins',
      reminderTime: '22:15',
      priority: 'Low',
      color: '#ec4899', // Pink
      createdAt: '2026-08-15',
      isActive: true,
      streak: 4,
    }
  ];

  // Prepopulate completions for heatmap and analytics
  const completions = {};
  past30Days.forEach((dateStr, idx) => {
    // Generate realistic completion pattern: mostly completed, occasional skip/miss
    initialHabits.forEach((habit) => {
      const isToday = dateStr === today;
      let status = 'completed';

      // Seed realistic variation
      const randomSeed = (idx * 17 + habit.name.length) % 10;
      if (isToday) {
        // Today: first 2 completed, rest pending
        status = habit.id === 'h-1' || habit.id === 'h-2' ? 'completed' : 'pending';
      } else if (randomSeed === 2) {
        status = 'skipped';
      } else if (randomSeed === 7) {
        status = 'missed';
      }

      if (status !== 'pending') {
        const key = `${habit.id}_${dateStr}`;
        completions[key] = {
          id: key,
          habitId: habit.id,
          date: dateStr,
          status: status,
          value: habit.target,
          note: status === 'completed' ? 'Felt energized!' : (status === 'skipped' ? 'Rest recovery day' : '')
        };
      }
    });
  });

  const initialSchedule = [
    {
      id: 'sch-1',
      title: 'Wake up, Hydrate & Stretch',
      time: '07:00',
      duration: 30,
      category: 'Health',
      status: 'completed',
      linkedHabitId: 'h-1'
    },
    {
      id: 'sch-2',
      title: 'Healthy High-Protein Breakfast',
      time: '08:00',
      duration: 30,
      category: 'Health',
      status: 'completed',
      linkedHabitId: null
    },
    {
      id: 'sch-3',
      title: 'Deep Work Block: Architecture Sprint',
      time: '09:30',
      duration: 90,
      category: 'Work',
      status: 'completed',
      linkedHabitId: 'h-2'
    },
    {
      id: 'sch-4',
      title: 'Team Sync & Product Strategy',
      time: '11:30',
      duration: 45,
      category: 'Work',
      status: 'pending',
      linkedHabitId: null
    },
    {
      id: 'sch-5',
      title: 'Strength & Mobility Workout',
      time: '17:30',
      duration: 50,
      category: 'Fitness',
      status: 'pending',
      linkedHabitId: 'h-3'
    },
    {
      id: 'sch-6',
      title: 'Evening Book Reading & Notes',
      time: '21:00',
      duration: 30,
      category: 'Study',
      status: 'pending',
      linkedHabitId: 'h-4'
    },
    {
      id: 'sch-7',
      title: 'Meditation & Sleep Wind-down',
      time: '22:15',
      duration: 15,
      category: 'Personal Development',
      status: 'pending',
      linkedHabitId: 'h-5'
    }
  ];

  const initialGoals = [
    {
      id: 'g-1',
      title: 'Read 6 Non-Fiction Books',
      description: 'Cover software architecture, human psychology, and finance',
      category: 'Study',
      target: 6,
      currentProgress: 4,
      unit: 'Books',
      deadline: '2026-11-30',
      status: 'active',
      linkedHabitIds: ['h-4']
    },
    {
      id: 'g-2',
      title: 'Maintain 30-Day Fitness Consistency',
      description: 'Exercise at least 4 times per week for a full month',
      category: 'Fitness',
      target: 30,
      currentProgress: 22,
      unit: 'Sessions',
      deadline: '2026-10-15',
      status: 'active',
      linkedHabitIds: ['h-3']
    },
    {
      id: 'g-3',
      title: 'Ship Habit Routine Planner App',
      description: 'Complete full MVP with analytics, streaks and gamification',
      category: 'Work',
      target: 100,
      currentProgress: 95,
      unit: '% Done',
      deadline: '2026-09-30',
      status: 'active',
      linkedHabitIds: ['h-2']
    }
  ];

  const initialBadges = [
    {
      id: 'b-1',
      title: 'First Step',
      description: 'Completed your very first scheduled habit',
      icon: 'Footprints',
      points: 20,
      unlocked: true,
      unlockedAt: '2026-08-01'
    },
    {
      id: 'b-2',
      title: '7-Day Blaze',
      description: 'Maintained a 7-day uninterrupted streak',
      icon: 'Flame',
      points: 50,
      unlocked: true,
      unlockedAt: '2026-08-08'
    },
    {
      id: 'b-3',
      title: 'Early Bird',
      description: 'Completed morning routine before 8:00 AM 5 times',
      icon: 'Sunrise',
      points: 40,
      unlocked: true,
      unlockedAt: '2026-08-14'
    },
    {
      id: 'b-4',
      title: 'Goal Crusher',
      description: 'Complete a major milestone goal',
      icon: 'Trophy',
      points: 100,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'b-5',
      title: '30-Day Master',
      description: 'Sustain a 30-day streak on any core habit',
      icon: 'Crown',
      points: 150,
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'b-6',
      title: 'Night Owl Focus',
      description: 'Complete evening mindfulness 10 days in a row',
      icon: 'Moon',
      points: 60,
      unlocked: false,
      unlockedAt: null
    }
  ];

  return {
    user: {
      name: 'Alex Rivera',
      email: 'alex.rivera@productivity.io',
      level: 3,
      levelTitle: 'Consistent Achiever',
      currentXP: 420,
      nextLevelXP: 600,
      totalPoints: 1240,
      streak: 14,
      longestStreak: 21,
      theme: 'light',
      soundEnabled: true,
      notificationsEnabled: true
    },
    habits: initialHabits,
    completions: completions,
    schedule: initialSchedule,
    goals: initialGoals,
    badges: initialBadges,
    calories: {
      dailyTarget: 2200,
      burnedTarget: 550,
      waterTarget: 2500,
      waterConsumed: 1500,
      intake: [
        { id: 'c-1', name: 'Oatmeal, Berries & Whey Protein', calories: 480, meal: 'Breakfast', time: '08:30', protein: 32, carbs: 64, fat: 9 },
        { id: 'c-2', name: 'Grilled Salmon Bowl & Brown Rice', calories: 650, meal: 'Lunch', time: '13:00', protein: 44, carbs: 58, fat: 22 },
        { id: 'c-3', name: 'Greek Yogurt & Mixed Nuts', calories: 260, meal: 'Snack', time: '16:30', protein: 18, carbs: 14, fat: 12 }
      ],
      burned: [
        { id: 'b-1', name: 'Morning Fasted Walk & Stretch', calories: 120, time: '07:15', source: 'Routine', duration: 25 },
        { id: 'b-2', name: 'Strength & Mobility Workout', calories: 340, time: '17:30', source: 'Habit', duration: 45 }
      ]
    }
  };
}

export function loadPlannerData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialData();
      savePlannerData(initial);
      return initial;
    }
    const data = JSON.parse(raw);
    if (data.user) {
      data.user.theme = 'light';
    }
    if (!data.calories) {
      const initial = getInitialData();
      data.calories = initial.calories;
    }
    return data;
  } catch (e) {
    console.error('Failed to load local storage data, resetting', e);
    const initial = getInitialData();
    savePlannerData(initial);
    return initial;
  }
}

export function savePlannerData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}
