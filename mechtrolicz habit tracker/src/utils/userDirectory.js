// Centralized user directory and health repository for Admin portal
const DIRECTORY_STORAGE_KEY = 'zenith_admin_users_directory_v1';

export function calculateBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return { bmi: null, category: 'Unknown' };
  const heightM = heightCm / 100;
  const bmiVal = (weightKg / (heightM * heightM)).toFixed(1);
  const num = parseFloat(bmiVal);
  let category = 'Normal';
  if (num < 18.5) category = 'Underweight';
  else if (num < 25) category = 'Normal weight';
  else if (num < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi: bmiVal, category };
}

// Initial realistic user dataset with diverse health conditions and personal metrics
const INITIAL_ADMIN_USERS = [
  {
    id: 'usr-alex-01',
    name: 'Alex Rivera',
    email: 'alex.rivera@productivity.io',
    phone: '+1 (555) 382-9014',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinedDate: '2026-08-01',
    lastActive: 'Today, 05:14 AM',
    level: 3,
    streak: 14,
    totalPoints: 1240,
    habitsCount: 6,
    personal: {
      age: 28,
      gender: 'Male',
      height: 178,
      weight: 74,
      bloodGroup: 'O+',
      emergencyContact: 'Elena Rivera (Sister) - +1 (555) 902-1423',
      occupation: 'Lead Systems Architect',
      location: 'San Francisco, CA'
    },
    health: {
      conditions: ['Mild Seasonal Asthma', 'Occasional Tension Headaches'],
      allergies: ['Peanuts (mild)', 'Penicillin'],
      medications: ['Albuterol Inhaler (PRN / as needed)', 'Daily Multivitamin & Omega-3'],
      dietaryPreference: 'High Protein / Mediterranean',
      sleepHours: 7.5,
      waterGoalLiters: 3.0,
      stressLevel: 'Moderate',
      activityLevel: 'Moderately Active',
      doctorNotes: 'BP normal (118/76). Keep up cardiovascular conditioning and hydration.'
    }
  },
  {
    id: 'usr-sarah-02',
    name: 'Sarah Connor',
    email: 'sarah.connor@cybercore.net',
    phone: '+1 (555) 714-8821',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    joinedDate: '2026-07-15',
    lastActive: 'Yesterday, 08:30 PM',
    level: 5,
    streak: 28,
    totalPoints: 2450,
    habitsCount: 7,
    personal: {
      age: 34,
      gender: 'Female',
      height: 168,
      weight: 65,
      bloodGroup: 'A+',
      emergencyContact: 'John Connor (Son) - +1 (555) 883-9912',
      occupation: 'Field Security Specialist',
      location: 'Austin, TX'
    },
    health: {
      conditions: ['Type 2 Diabetes (Managed)', 'Hypertension'],
      allergies: ['Sulfa drugs', 'Latex'],
      medications: ['Metformin 500mg BID', 'Lisinopril 10mg daily'],
      dietaryPreference: 'Low Carb / Diabetic Friendly',
      sleepHours: 6.8,
      waterGoalLiters: 2.8,
      stressLevel: 'High',
      activityLevel: 'Very Active',
      doctorNotes: 'HbA1c steady at 6.2%. Regular blood sugar tracking required.'
    }
  },
  {
    id: 'usr-marcus-03',
    name: 'Marcus Vance',
    email: 'm.vance@apexstrength.org',
    phone: '+1 (555) 492-3301',
    role: 'VIP Member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    joinedDate: '2026-06-20',
    lastActive: 'Today, 04:45 AM',
    level: 7,
    streak: 45,
    totalPoints: 3820,
    habitsCount: 9,
    personal: {
      age: 42,
      gender: 'Male',
      height: 185,
      weight: 88,
      bloodGroup: 'B+',
      emergencyContact: 'Claire Vance (Spouse) - +1 (555) 492-3302',
      occupation: 'High Performance Coach',
      location: 'Denver, CO'
    },
    health: {
      conditions: ['Healthy / Athletic Baseline'],
      allergies: ['None reported'],
      medications: ['Creatine Monohydrate 5g', 'Vitamin D3 5000 IU', 'Zinc Picolinate'],
      dietaryPreference: 'High Protein / Whole Foods',
      sleepHours: 8.2,
      waterGoalLiters: 4.0,
      stressLevel: 'Low',
      activityLevel: 'Athlete / Heavy Training',
      doctorNotes: 'Resting HR: 48 bpm. Exceptional cardiovascular endurance.'
    }
  },
  {
    id: 'usr-elena-04',
    name: 'Elena Rostova',
    email: 'elena.rostova@bioquant.io',
    phone: '+1 (555) 601-9944',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    joinedDate: '2026-08-10',
    lastActive: '2 days ago',
    level: 4,
    streak: 19,
    totalPoints: 1780,
    habitsCount: 5,
    personal: {
      age: 29,
      gender: 'Female',
      height: 172,
      weight: 61,
      bloodGroup: 'AB-',
      emergencyContact: 'Mikhail Rostov (Brother) - +1 (555) 601-9940',
      occupation: 'Biomedical Researcher',
      location: 'Boston, MA'
    },
    health: {
      conditions: ['Celiac Disease (Strict)', 'Iron-Deficiency Anemia'],
      allergies: ['Gluten (severe)', 'Tree nuts'],
      medications: ['Iron Bisglycinate 28mg', 'Methylfolate 400mcg', 'Vitamin B12'],
      dietaryPreference: 'Strict Gluten-Free & Plant-Forward',
      sleepHours: 7.0,
      waterGoalLiters: 2.5,
      stressLevel: 'Moderate',
      activityLevel: 'Lightly Active',
      doctorNotes: 'Monitor ferritin levels quarterly. Strict non-cross-contamination diet.'
    }
  },
  {
    id: 'usr-david-05',
    name: 'David Kim',
    email: 'david.kim@kimcapital.com',
    phone: '+1 (555) 238-1190',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    joinedDate: '2026-05-18',
    lastActive: '3 hours ago',
    level: 4,
    streak: 12,
    totalPoints: 1640,
    habitsCount: 4,
    personal: {
      age: 51,
      gender: 'Male',
      height: 175,
      weight: 82,
      bloodGroup: 'O-',
      emergencyContact: 'Grace Kim (Wife) - +1 (555) 238-1191',
      occupation: 'Investment Director',
      location: 'New York, NY'
    },
    health: {
      conditions: ['Hyperlipidemia', 'Mild Knee Osteoarthritis'],
      allergies: ['Shellfish', 'Codeine'],
      medications: ['Atorvastatin 20mg daily', 'Glucosamine Chondroitin', 'CoQ10 100mg'],
      dietaryPreference: 'Low Sodium / Heart Healthy',
      sleepHours: 6.5,
      waterGoalLiters: 2.4,
      stressLevel: 'High',
      activityLevel: 'Lightly Active',
      doctorNotes: 'Advised low-impact aerobic exercise (swimming/cycling). Lipid panel improving.'
    }
  },
  {
    id: 'usr-priya-06',
    name: 'Priya Patel',
    email: 'priya.patel@zenwellness.in',
    phone: '+1 (555) 839-4412',
    role: 'Member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinedDate: '2026-07-02',
    lastActive: 'Today, 01:20 PM',
    level: 6,
    streak: 31,
    totalPoints: 2900,
    habitsCount: 8,
    personal: {
      age: 26,
      gender: 'Female',
      height: 163,
      weight: 58,
      bloodGroup: 'B+',
      emergencyContact: 'Anand Patel (Father) - +1 (555) 839-4410',
      occupation: 'Holistic Nutritionist & Yogi',
      location: 'Seattle, WA'
    },
    health: {
      conditions: ['PCOS (Polycystic Ovary Syndrome)', 'Mild Hypothyroidism'],
      allergies: ['Dust mites', 'Aspirin'],
      medications: ['Levothyroxine 50mcg daily (fasting)', 'Myo-Inositol 2000mg', 'Ashwagandha'],
      dietaryPreference: 'Anti-inflammatory Vegetarian',
      sleepHours: 8.0,
      waterGoalLiters: 3.2,
      stressLevel: 'Low',
      activityLevel: 'Moderately Active (Yoga & Pilates)',
      doctorNotes: 'Thyroid TSH normalized. Insulin sensitivity managed with whole-food diet.'
    }
  }
];

export function getUsersDirectory() {
  try {
    const raw = localStorage.getItem(DIRECTORY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DIRECTORY_STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ADMIN_USERS;
  } catch (e) {
    console.error('Failed reading user directory from storage', e);
    return INITIAL_ADMIN_USERS;
  }
}

export function saveUsersDirectory(users) {
  try {
    localStorage.setItem(DIRECTORY_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed saving user directory', e);
  }
}

// Synchronize current app active user with the admin directory
export function syncActiveUserToDirectory(currentUser, habits = []) {
  if (!currentUser) return;
  const users = getUsersDirectory();
  const index = users.findIndex(u => u.id === 'usr-alex-01' || u.email === currentUser.email);

  const updatedActiveUser = {
    id: 'usr-alex-01',
    name: currentUser.name || 'Alex Rivera',
    email: currentUser.email || 'alex.rivera@productivity.io',
    phone: currentUser.phone || '+1 (555) 382-9014',
    role: 'Administrator / Owner',
    avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    joinedDate: currentUser.joinedDate || '2026-08-01',
    lastActive: 'Active Now',
    level: currentUser.level || 3,
    streak: currentUser.streak || 14,
    totalPoints: currentUser.totalPoints || 1240,
    habitsCount: habits.length || 6,
    personal: {
      age: currentUser.personal?.age ?? 28,
      gender: currentUser.personal?.gender ?? 'Male',
      height: currentUser.personal?.height ?? 178,
      weight: currentUser.personal?.weight ?? 74,
      bloodGroup: currentUser.personal?.bloodGroup ?? 'O+',
      emergencyContact: currentUser.personal?.emergencyContact ?? 'Elena Rivera (Sister) - +1 (555) 902-1423',
      occupation: currentUser.personal?.occupation ?? 'Lead Systems Architect',
      location: currentUser.personal?.location ?? 'San Francisco, CA'
    },
    health: {
      conditions: currentUser.health?.conditions?.length ? currentUser.health.conditions : ['Mild Seasonal Asthma', 'Occasional Tension Headaches'],
      allergies: currentUser.health?.allergies?.length ? currentUser.health.allergies : ['Peanuts (mild)', 'Penicillin'],
      medications: currentUser.health?.medications?.length ? currentUser.health.medications : ['Albuterol Inhaler (PRN)', 'Daily Multivitamin & Omega-3'],
      dietaryPreference: currentUser.health?.dietaryPreference || 'High Protein / Mediterranean',
      sleepHours: currentUser.health?.sleepHours ?? 7.5,
      waterGoalLiters: currentUser.health?.waterGoalLiters ?? 3.0,
      stressLevel: currentUser.health?.stressLevel || 'Moderate',
      activityLevel: currentUser.health?.activityLevel || 'Moderately Active',
      doctorNotes: currentUser.health?.doctorNotes || 'BP normal (118/76). Keep up cardiovascular conditioning.'
    }
  };

  if (index >= 0) {
    users[index] = { ...users[index], ...updatedActiveUser };
  } else {
    users.unshift(updatedActiveUser);
  }

  saveUsersDirectory(users);
  return users;
}

export function addUserToDirectory(newUser) {
  const users = getUsersDirectory();
  const id = `usr-${Date.now().toString(36)}`;
  const userRecord = {
    id,
    joinedDate: new Date().toISOString().slice(0, 10),
    lastActive: 'Just registered',
    streak: 0,
    level: 1,
    totalPoints: 0,
    habitsCount: 0,
    ...newUser,
    personal: {
      age: 25,
      gender: 'Prefer not to say',
      height: 170,
      weight: 70,
      bloodGroup: 'Unknown',
      emergencyContact: '',
      occupation: '',
      location: '',
      ...(newUser.personal || {})
    },
    health: {
      conditions: [],
      allergies: [],
      medications: [],
      dietaryPreference: 'Standard',
      sleepHours: 7.0,
      waterGoalLiters: 2.5,
      stressLevel: 'Low',
      activityLevel: 'Lightly Active',
      doctorNotes: '',
      ...(newUser.health || {})
    }
  };
  users.unshift(userRecord);
  saveUsersDirectory(users);
  return userRecord;
}

export function updateUserInDirectory(userId, updatedFields) {
  const users = getUsersDirectory();
  const idx = users.findIndex(u => u.id === userId);
  if (idx >= 0) {
    users[idx] = {
      ...users[idx],
      ...updatedFields,
      personal: {
        ...users[idx].personal,
        ...(updatedFields.personal || {})
      },
      health: {
        ...users[idx].health,
        ...(updatedFields.health || {})
      }
    };
    saveUsersDirectory(users);
    return users[idx];
  }
  return null;
}

export function deleteUserFromDirectory(userId) {
  const users = getUsersDirectory();
  const filtered = users.filter(u => u.id !== userId);
  saveUsersDirectory(filtered);
  return filtered;
}

export function exportUsersToJSON() {
  const users = getUsersDirectory();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `zenith_users_health_registry_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function exportUsersToCSV(subsetUsers = null) {
  const users = subsetUsers || getUsersDirectory();
  const headers = [
    'ID', 'Name', 'Email', 'Phone', 'Role', 'Age', 'Gender', 'Blood Group',
    'Height (cm)', 'Weight (kg)', 'BMI', 'Conditions', 'Allergies',
    'Medications', 'Dietary Preference', 'Sleep Hours', 'Water Goal (L)', 'Stress Level', 'Streak'
  ];

  const rows = users.map(u => {
    const { bmi } = calculateBMI(u.personal?.height, u.personal?.weight);
    return [
      u.id,
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      u.role || 'Member',
      u.personal?.age || '',
      u.personal?.gender || '',
      u.personal?.bloodGroup || '',
      u.personal?.height || '',
      u.personal?.weight || '',
      bmi || '',
      `"${(u.health?.conditions || []).join('; ')}"`,
      `"${(u.health?.allergies || []).join('; ')}"`,
      `"${(u.health?.medications || []).join('; ')}"`,
      `"${u.health?.dietaryPreference || ''}"`,
      u.health?.sleepHours || '',
      u.health?.waterGoalLiters || '',
      `"${u.health?.stressLevel || ''}"`,
      u.streak || 0
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows].join('\n'));
  const a = document.createElement('a');
  a.setAttribute('href', csvContent);
  a.setAttribute('download', `zenith_users_directory_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  addAuditLog('CSV Export', `Exported ${users.length} user records to CSV`, 'info');
}

// -------------------------------------------------------------
// Clinical Health Risk Score Calculator
// -------------------------------------------------------------
export function calculateHealthRiskScore(user) {
  if (!user) return { score: 10, level: 'Low', color: '#10b981', badge: 'Optimal', factors: [] };

  let score = 10;
  const factors = [];

  const age = user.personal?.age || 25;
  if (age >= 50) {
    score += 15;
    factors.push(`Age ${age} (Mature cohort +15)`);
  } else if (age >= 40) {
    score += 8;
    factors.push(`Age ${age} (Mid-career risk +8)`);
  }

  const { bmi, category } = calculateBMI(user.personal?.height, user.personal?.weight);
  if (category === 'Obese') {
    score += 25;
    factors.push(`BMI ${bmi} (${category} +25)`);
  } else if (category === 'Overweight') {
    score += 12;
    factors.push(`BMI ${bmi} (${category} +12)`);
  } else if (category === 'Underweight') {
    score += 10;
    factors.push(`BMI ${bmi} (${category} +10)`);
  }

  const conds = (user.health?.conditions || []).map(c => c.toLowerCase());
  const chronicKeywords = [
    { key: 'diabetes', label: 'Type 2 Diabetes', weight: 22 },
    { key: 'hypertension', label: 'Hypertension', weight: 20 },
    { key: 'asthma', label: 'Asthma/Respiratory', weight: 12 },
    { key: 'heart', label: 'Cardiac/Heart Condition', weight: 25 },
    { key: 'celiac', label: 'Celiac / Autoimmune', weight: 14 },
    { key: 'hypothyroid', label: 'Thyroid Dysregulation', weight: 10 },
    { key: 'hyperlipidemia', label: 'Hyperlipidemia', weight: 15 }
  ];

  chronicKeywords.forEach(k => {
    if (conds.some(c => c.includes(k.key))) {
      score += k.weight;
      factors.push(`${k.label} (+${k.weight})`);
    }
  });

  const stress = (user.health?.stressLevel || 'Moderate').toLowerCase();
  if (stress === 'severe') {
    score += 20;
    factors.push('Severe Daily Stress (+20)');
  } else if (stress === 'high') {
    score += 12;
    factors.push('High Daily Stress (+12)');
  }

  const sleep = user.health?.sleepHours ?? 7;
  if (sleep < 6) {
    score += 15;
    factors.push(`Sleep Deficit (${sleep}h/night +15)`);
  }

  const normalized = Math.min(100, Math.max(5, score));
  let level = 'Low';
  let color = '#10b981';
  let badge = 'Optimal Baseline';

  if (normalized >= 70) {
    level = 'Critical';
    color = '#ef4444';
    badge = 'High Attention Required';
  } else if (normalized >= 50) {
    level = 'Elevated';
    color = '#f97316';
    badge = 'Active Monitoring';
  } else if (normalized >= 30) {
    level = 'Moderate';
    color = '#f59e0b';
    badge = 'Moderate Lifestyle Risk';
  }

  return { score: normalized, level, color, badge, factors };
}

// -------------------------------------------------------------
// System Audit Trail & Event Logging
// -------------------------------------------------------------
const AUDIT_STORAGE_KEY = 'zenith_admin_audit_logs_v1';

const INITIAL_AUDIT_LOGS = [
  { id: 'aud-01', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), action: 'System Init', details: 'Admin Health Vault & User Directory initialized', severity: 'info', user: 'System Admin' },
  { id: 'aud-02', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Directory Sync', details: 'Synchronized 6 clinical user records with local vault', severity: 'success', user: 'Alex Rivera' },
  { id: 'aud-03', timestamp: new Date(Date.now() - 1800000).toISOString(), action: 'Triage Inspection', details: 'Reviewed chronic telemetry for Sarah Connor (Hypertension)', severity: 'warning', user: 'Admin' }
];

export function getAuditLogs() {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_AUDIT_LOGS;
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLog(action, details, severity = 'info', adminName = 'System Admin') {
  try {
    const logs = getAuditLogs();
    const newLog = {
      id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      severity,
      user: adminName
    };
    logs.unshift(newLog);
    // Keep last 100 logs
    const trimmed = logs.slice(0, 100);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch (e) {
    console.error('Failed writing audit log', e);
    return [];
  }
}

export function clearAuditLogs() {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([]));
  } catch (e) {}
}

// -------------------------------------------------------------
// Global Habit & Routine Presets Catalog
// -------------------------------------------------------------
const PRESETS_STORAGE_KEY = 'zenith_admin_habit_presets_v1';

const INITIAL_HABIT_PRESETS = [
  {
    id: 'pst-01',
    name: 'Diabetic Post-Meal 15m Walk',
    category: 'health',
    timeOfDay: 'afternoon',
    frequency: 'daily',
    target: 1,
    unit: 'walk',
    icon: 'Activity',
    description: 'Postprandial light ambulation to blunt glucose spikes and improve insulin sensitivity.',
    prescribedFor: 'Type 2 Diabetes, Metabolic Health',
    priority: 'high'
  },
  {
    id: 'pst-02',
    name: 'Circadian Sunlight & Hydration',
    category: 'wellness',
    timeOfDay: 'morning',
    frequency: 'daily',
    target: 1,
    unit: 'session',
    icon: 'Sun',
    description: '10 mins of outdoor morning sunlight paired with 500ml electrolyte water to anchor cortisol rhythm.',
    prescribedFor: 'General Baseline, Sleep Disorders',
    priority: 'medium'
  },
  {
    id: 'pst-03',
    name: 'Blood Pressure / DASH Sodium Check',
    category: 'health',
    timeOfDay: 'evening',
    frequency: 'daily',
    target: 1,
    unit: 'log',
    icon: 'HeartPulse',
    description: 'Evening BP cuff reading log and sodium restriction review (<1500mg).',
    prescribedFor: 'Hypertension, Cardiac Patients',
    priority: 'critical'
  },
  {
    id: 'pst-04',
    name: 'Zone 2 Cardio Base Conditioning',
    category: 'fitness',
    timeOfDay: 'morning',
    frequency: 'weekly',
    target: 4,
    unit: 'sessions',
    icon: 'Dumbbell',
    description: '45 mins conversational steady-state cardio (125-138 bpm) for mitochondrial density.',
    prescribedFor: 'Athletic, Longevity, Weight Management',
    priority: 'medium'
  },
  {
    id: 'pst-05',
    name: 'Box Breathing Cortisol Reset (4x4)',
    category: 'mindfulness',
    timeOfDay: 'afternoon',
    frequency: 'daily',
    target: 2,
    unit: 'rounds',
    icon: 'Sparkles',
    description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Activates parasympathetic vagal brake.',
    prescribedFor: 'High Stress, Anxiety, Hypertension',
    priority: 'high'
  }
];

export function getHabitPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(INITIAL_HABIT_PRESETS));
      return INITIAL_HABIT_PRESETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_HABIT_PRESETS;
  } catch (e) {
    return INITIAL_HABIT_PRESETS;
  }
}

export function saveHabitPresets(presets) {
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (e) {}
}

export function addHabitPreset(newPreset) {
  const presets = getHabitPresets();
  const item = {
    id: `pst-${Date.now().toString(36)}`,
    ...newPreset
  };
  presets.unshift(item);
  saveHabitPresets(presets);
  addAuditLog('Preset Added', `Created global habit preset: "${item.name}"`, 'success');
  return presets;
}

export function deleteHabitPreset(presetId) {
  const presets = getHabitPresets();
  const target = presets.find(p => p.id === presetId);
  const filtered = presets.filter(p => p.id !== presetId);
  saveHabitPresets(filtered);
  addAuditLog('Preset Deleted', `Removed habit preset: "${target?.name || presetId}"`, 'warning');
  return filtered;
}

// -------------------------------------------------------------
// System Broadcasts & Health Advisories Dispatcher
// -------------------------------------------------------------
const BROADCAST_STORAGE_KEY = 'zenith_system_broadcasts_v1';

const INITIAL_BROADCASTS = [
  {
    id: 'bc-01',
    title: 'Seasonal Flu & Respiratory Health Advisory',
    message: 'Asthma and respiratory patients: Please ensure backup inhalers are current as pollen and seasonal triggers rise this week.',
    type: 'warning',
    targetCohort: 'All Patients / Respiratory',
    active: true,
    created: '2026-09-24'
  },
  {
    id: 'bc-02',
    title: 'Hydration Goal Upgrade Active',
    message: 'Summer heatwave notice: daily hydration targets increased by +500ml automatically across all profiles.',
    type: 'info',
    targetCohort: 'All Active Users',
    active: true,
    created: '2026-09-25'
  }
];

export function getBroadcasts() {
  try {
    const raw = localStorage.getItem(BROADCAST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(INITIAL_BROADCASTS));
      return INITIAL_BROADCASTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_BROADCASTS;
  } catch (e) {
    return INITIAL_BROADCASTS;
  }
}

export function saveBroadcasts(broadcasts) {
  try {
    localStorage.setItem(BROADCAST_STORAGE_KEY, JSON.stringify(broadcasts));
  } catch (e) {}
}

export function addBroadcast(item) {
  const list = getBroadcasts();
  const record = {
    id: `bc-${Date.now().toString(36)}`,
    created: new Date().toISOString().slice(0, 10),
    active: true,
    ...item
  };
  list.unshift(record);
  saveBroadcasts(list);
  addAuditLog('Broadcast Sent', `Dispatched broadcast: "${record.title}"`, 'info');
  return list;
}

export function deleteBroadcast(id) {
  const list = getBroadcasts();
  const filtered = list.filter(b => b.id !== id);
  saveBroadcasts(filtered);
  addAuditLog('Broadcast Deleted', `Removed broadcast ID: ${id}`, 'info');
  return filtered;
}

// -------------------------------------------------------------
// Admin PIN Security Lock Helpers
// -------------------------------------------------------------
const PIN_STORAGE_KEY = 'zenith_admin_pin_config_v1';

export function getAdminPinConfig() {
  try {
    const raw = localStorage.getItem(PIN_STORAGE_KEY);
    if (!raw) {
      return { enabled: false, pin: '1234' };
    }
    return JSON.parse(raw);
  } catch (e) {
    return { enabled: false, pin: '1234' };
  }
}

export function saveAdminPinConfig(config) {
  try {
    localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(config));
    addAuditLog('Security Config', `Admin PIN protection ${config.enabled ? 'Enabled' : 'Disabled'}`, 'warning');
  } catch (e) {}
}

// -------------------------------------------------------------
// Batch Operations & Import / Seed Management
// -------------------------------------------------------------
export function batchDeleteUsers(userIds) {
  const current = getUsersDirectory();
  const updated = current.filter(u => !userIds.includes(u.id));
  saveUsersDirectory(updated);
  addAuditLog('Batch Delete', `Permanently deleted ${userIds.length} user records`, 'warning');
  return updated;
}

export function importUsersFromJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Import data must be a non-empty array of user objects.');
    }
    const current = getUsersDirectory();
    // Merge by id or append
    let addedCount = 0;
    let updatedCount = 0;
    const merged = [...current];

    parsed.forEach(item => {
      if (!item.name || !item.email) return;
      const existingIdx = merged.findIndex(u => u.id === item.id || u.email === item.email);
      if (existingIdx >= 0) {
        merged[existingIdx] = { ...merged[existingIdx], ...item };
        updatedCount++;
      } else {
        merged.push({
          id: item.id || `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
          joinedDate: item.joinedDate || new Date().toISOString().slice(0, 10),
          ...item
        });
        addedCount++;
      }
    });

    saveUsersDirectory(merged);
    addAuditLog('JSON Import', `Imported ${parsed.length} records (${addedCount} added, ${updatedCount} merged)`, 'success');
    return { success: true, count: parsed.length, added: addedCount, updated: updatedCount };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function resetDirectoryToDefault() {
  localStorage.setItem(DIRECTORY_STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
  addAuditLog('Directory Reset', 'Reset user directory to default baseline records', 'warning');
  return INITIAL_ADMIN_USERS;
}
