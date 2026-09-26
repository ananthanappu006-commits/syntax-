// Personalized Suggestions and Adaptive Routines engine

export function generateSmartSuggestions(habits, completions, schedule) {
  const suggestions = [];

  // 1. Check for highly consistent habits that can be leveled up
  const hydrationHabit = habits.find(h => h.id === 'h-1');
  if (hydrationHabit && hydrationHabit.streak >= 7 && hydrationHabit.target < 1000) {
    suggestions.push({
      id: 'sug-level-up-hydration',
      type: 'level_up',
      badge: 'Consistency Win',
      title: 'Level Up Hydration Target',
      description: `You've sustained a ${hydrationHabit.streak}-day streak with ${hydrationHabit.target}${hydrationHabit.unit}! Ready to increase to ${hydrationHabit.target + 250}${hydrationHabit.unit} to optimize morning alertness?`,
      actionLabel: 'Increase to 750ml',
      habitId: 'h-1',
      apply: (currentHabits) => {
        return currentHabits.map(h => h.id === 'h-1' ? { ...h, target: 750 } : h);
      }
    });
  }

  // 2. Adaptive time suggestion for evening habits
  const eveningHabit = habits.find(h => h.id === 'h-5');
  if (eveningHabit && eveningHabit.reminderTime === '22:15') {
    suggestions.push({
      id: 'sug-shift-evening-time',
      type: 'adaptive_routine',
      badge: 'Adaptive Routine',
      title: 'Shift Reflection 30 Min Earlier',
      description: 'Activity logs show higher focus before 21:45. Moving Mindfulness to 21:45 will reduce late-night skipping by an estimated 35%.',
      actionLabel: 'Reschedule to 21:45',
      habitId: 'h-5',
      apply: (currentHabits) => {
        return currentHabits.map(h => h.id === 'h-5' ? { ...h, reminderTime: '21:45' } : h);
      }
    });
  }

  // 3. Spacing / rest day recommendation
  const workoutHabit = habits.find(h => h.id === 'h-3');
  if (workoutHabit) {
    suggestions.push({
      id: 'sug-workout-hydration',
      type: 'insight',
      badge: 'Optimization Tip',
      title: 'Stack Workout with Energy Hydration',
      description: 'Habit stacking: Pair your 17:30 Strength Workout with a 15-minute cool-down stretch for faster nervous system recovery.',
      actionLabel: 'Add Stretch Step',
      habitId: 'h-3',
      apply: (currentHabits) => {
        return currentHabits.map(h => h.id === 'h-3' ? { ...h, description: h.description + ' + 10m cool-down stretch' } : h);
      }
    });
  }

  return suggestions;
}
