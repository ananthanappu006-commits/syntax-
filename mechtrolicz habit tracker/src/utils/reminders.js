/**
 * Browser Notification Reminders for Habit & Routine Planner
 * Polls every 30 seconds and fires a browser notification when a habit's
 * reminderTime matches the current HH:MM.
 */

let reminderInterval = null;
const firedToday = new Set(); // track which habit IDs were already notified today

export function requestNotificationPermission() {
  if (!('Notification' in window)) return Promise.resolve('unsupported');
  if (Notification.permission === 'granted') return Promise.resolve('granted');
  if (Notification.permission === 'denied') return Promise.resolve('denied');
  return Notification.requestPermission();
}

export function getNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

function getCurrentHHMM() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function isHabitScheduledToday(habit) {
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const todayDay = dayNames[new Date().getDay()];
  if (!habit.days || habit.days.length === 0) return true;
  return habit.days.includes(todayDay);
}

export function startReminderEngine(getHabits, getCompletions) {
  stopReminderEngine();

  // Reset fired set at midnight
  const todayStr = getTodayStr();
  firedToday.clear();

  reminderInterval = setInterval(() => {
    // Reset on new day
    if (getTodayStr() !== todayStr) firedToday.clear();

    if (Notification.permission !== 'granted') return;

    const habits = getHabits();
    const completions = getCompletions();
    const now = getCurrentHHMM();
    const today = getTodayStr();

    habits.forEach(habit => {
      if (!habit.reminderTime || !habit.isActive) return;
      if (!isHabitScheduledToday(habit)) return;

      // Already completed today?
      const key = `${habit.id}_${today}`;
      if (completions[key]?.status === 'completed') return;

      // Already fired this reminder today?
      if (firedToday.has(habit.id)) return;

      // Time match (HH:MM)
      if (habit.reminderTime === now) {
        firedToday.add(habit.id);
        try {
          const n = new Notification(`⏰ Habit Reminder: ${habit.name}`, {
            body: `Target: ${habit.target} ${habit.unit} · Category: ${habit.category}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `habit-${habit.id}`,
            requireInteraction: false,
          });
          // Auto-close after 8 seconds
          setTimeout(() => n.close(), 8000);
        } catch (e) {
          console.warn('Notification error:', e);
        }
      }
    });
  }, 30_000); // check every 30 seconds
}

export function stopReminderEngine() {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
}

export function fireTestNotification() {
  if (Notification.permission !== 'granted') return;
  try {
    const n = new Notification('✅ Reminders Active!', {
      body: 'You will now receive habit reminders at your scheduled times.',
      icon: '/favicon.ico',
      tag: 'test-reminder',
    });
    setTimeout(() => n.close(), 5000);
  } catch (e) {
    console.warn('Test notification error:', e);
  }
}
