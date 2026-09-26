import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dumbbell, Timer, Play, Pause, RotateCcw, CheckSquare, Square,
  ChevronDown, ChevronUp, Flame, Clock, BarChart3, Zap, Shield,
  User, Users, Star, Check, Target, TrendingUp, Activity,
  Moon, Sun, Wind, Heart, ArrowRight
} from 'lucide-react';
import { soundEffects } from '../utils/audio';
import confetti from 'canvas-confetti';

/* ═══════════════════════════════════════════════════════════════
   DATA LAYER
═══════════════════════════════════════════════════════════════ */

const PROFILES = [
  {
    id: 'women', label: "Women's Training", icon: User, color: '#e11d48',
    gradient: 'linear-gradient(135deg,#e11d48,#fb7185)',
    goals: [
      { id: 'loss', label: 'Weight Loss', icon: TrendingUp },
      { id: 'muscle', label: 'Muscle Gain', icon: Dumbbell },
      { id: 'tone', label: 'Tone & Mobility', icon: Activity },
    ],
  },
  {
    id: 'men', label: "Men's Training", icon: Users, color: '#4f46e5',
    gradient: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    goals: [
      { id: 'loss', label: 'Weight Loss', icon: TrendingUp },
      { id: 'muscle', label: 'Muscle Gain', icon: Dumbbell },
      { id: 'tone', label: 'Tone & Mobility', icon: Activity },
    ],
  },
];

const FOCUS_OPTIONS = {
  women: [
    { id: 'all', label: 'All Focus Areas' },
    { id: 'Glute/Leg', label: '🍑 Glute/Leg Development' },
    { id: 'Upper Body', label: '💪 Upper Body Tone' },
    { id: 'Core', label: '🎯 Core Strength' },
    { id: 'HIIT', label: '⚡ Low-Impact HIIT' },
    { id: 'Mobility', label: '🌊 Cycle-Syncing Mobility' },
  ],
  men: [
    { id: 'all', label: 'All Focus Areas' },
    { id: 'PPL', label: '🏋️ Push/Pull/Legs (PPL)' },
    { id: 'Hypertrophy', label: '💥 Hypertrophy' },
    { id: 'Upper/Lower', label: '🎯 Upper/Lower Splits' },
    { id: 'Conditioning', label: '🔥 High-Intensity Bodyweight' },
  ],
};

const workoutMatchesFocus = (workout, focusId) => {
  if (!workout || focusId === 'all') return true;
  const t = (workout.title || '').toLowerCase();
  const m = (workout.muscles || []).join(' ').toLowerCase();
  if (focusId === 'Glute/Leg') return t.includes('glute') || t.includes('leg') || t.includes('barre') || m.includes('glute') || m.includes('hamstring') || m.includes('quad');
  if (focusId === 'Upper Body') return t.includes('upper') || t.includes('bicep') || t.includes('back') || m.includes('chest') || m.includes('shoulder') || m.includes('bicep');
  if (focusId === 'Core') return t.includes('core') || t.includes('pilates') || m.includes('abs') || m.includes('core');
  if (focusId === 'HIIT') return t.includes('hiit') || t.includes('circuit');
  if (focusId === 'Mobility') return t.includes('mobility') || t.includes('cycle') || t.includes('yoga') || t.includes('recovery');
  if (focusId === 'PPL') return t.includes('push') || t.includes('pull') || t.includes('leg');
  if (focusId === 'Hypertrophy') return t.includes('hypertrophy');
  if (focusId === 'Upper/Lower') return t.includes('upper/lower') || t.includes('strength');
  if (focusId === 'Conditioning') return t.includes('hiit') || t.includes('conditioning') || t.includes('amrap') || t.includes('cardio');
  return true;
};

const WEEKLY_SCHEDULES = {
  women: {
    loss: [
      { day: 'Mon', workout: { id: 'w-1', title: 'Full Body HIIT', duration: 40, difficulty: 'High', muscles: ['Full Body', 'Core', 'Cardio'], emoji: '🔥',
        exercises: [
          { name: 'Jump Squats', sets: 3, reps: '15', rest: '30s' },
          { name: 'Burpees', sets: 3, reps: '12', rest: '30s' },
          { name: 'Mountain Climbers', sets: 3, reps: '20', rest: '20s' },
          { name: 'High Knees', sets: 3, reps: '30s', rest: '20s' },
          { name: 'Plank Hold', sets: 3, reps: '40s', rest: '30s' },
        ]
      }},
      { day: 'Tue', workout: { id: 'w-2', title: 'Glute & Leg Sculpt', duration: 45, difficulty: 'Medium', muscles: ['Glutes', 'Hamstrings', 'Quads'], emoji: '🍑',
        exercises: [
          { name: 'Hip Thrusts', sets: 4, reps: '15', rest: '60s' },
          { name: 'Sumo Squats', sets: 3, reps: '12', rest: '60s' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '60s' },
          { name: 'Glute Kickbacks', sets: 3, reps: '15 each', rest: '30s' },
          { name: 'Calf Raises', sets: 3, reps: '20', rest: '30s' },
        ]
      }},
      { day: 'Wed', workout: { id: 'w-3', title: 'Cycle-Sync Mobility', duration: 30, difficulty: 'Low', muscles: ['Hips', 'Spine', 'Shoulders'], emoji: '🌊',
        exercises: [
          { name: 'Cat-Cow Flow', sets: 2, reps: '10', rest: '0s' },
          { name: 'Hip Flexor Stretch', sets: 2, reps: '60s each', rest: '0s' },
          { name: "Pigeon Pose", sets: 2, reps: '90s each', rest: '0s' },
          { name: 'Thread the Needle', sets: 2, reps: '8 each', rest: '0s' },
          { name: 'Child\'s Pose', sets: 1, reps: '2 mins', rest: '0s' },
        ]
      }},
      { day: 'Thu', workout: { id: 'w-4', title: 'Upper Body Tone', duration: 40, difficulty: 'Medium', muscles: ['Chest', 'Shoulders', 'Triceps', 'Back'], emoji: '💪',
        exercises: [
          { name: 'Push-Ups', sets: 3, reps: '12', rest: '45s' },
          { name: 'Dumbbell Rows', sets: 3, reps: '12 each', rest: '45s' },
          { name: 'Lateral Raises', sets: 3, reps: '15', rest: '30s' },
          { name: 'Overhead Press', sets: 3, reps: '12', rest: '45s' },
          { name: 'Tricep Dips', sets: 3, reps: '15', rest: '30s' },
        ]
      }},
      { day: 'Fri', workout: { id: 'w-5', title: 'Low-Impact HIIT', duration: 35, difficulty: 'Medium', muscles: ['Full Body', 'Core'], emoji: '✨',
        exercises: [
          { name: 'Step Jacks', sets: 3, reps: '40s', rest: '20s' },
          { name: 'Lateral Shuffles', sets: 3, reps: '40s', rest: '20s' },
          { name: 'Squat Pulses', sets: 3, reps: '25', rest: '30s' },
          { name: 'Modified Burpees', sets: 3, reps: '12', rest: '30s' },
          { name: 'Standing Core Twists', sets: 3, reps: '20', rest: '20s' },
        ]
      }},
      { day: 'Sat', workout: { id: 'w-6', title: 'Core Strength Session', duration: 30, difficulty: 'Medium', muscles: ['Abs', 'Obliques', 'Lower Back'], emoji: '🎯',
        exercises: [
          { name: 'Plank', sets: 3, reps: '45s', rest: '30s' },
          { name: 'Russian Twists', sets: 3, reps: '20', rest: '30s' },
          { name: 'Bicycle Crunches', sets: 3, reps: '20', rest: '30s' },
          { name: 'Leg Raises', sets: 3, reps: '15', rest: '30s' },
          { name: 'Dead Bugs', sets: 3, reps: '10 each', rest: '30s' },
        ]
      }},
      { day: 'Sun', workout: null },
    ],
    tone: [
      { day: 'Mon', workout: { id: 'wt-1', title: 'Pilates Core & Tone', duration: 45, difficulty: 'Medium', muscles: ['Core', 'Glutes', 'Inner Thighs'], emoji: '🌸',
        exercises: [
          { name: 'Hundred', sets: 1, reps: '100 pumps', rest: '0s' },
          { name: 'Single Leg Circles', sets: 2, reps: '10 each', rest: '0s' },
          { name: 'Rolling Like a Ball', sets: 2, reps: '10', rest: '0s' },
          { name: 'Side-Lying Leg Lifts', sets: 3, reps: '15 each', rest: '20s' },
          { name: 'Bridge Pulses', sets: 3, reps: '20', rest: '30s' },
        ]
      }},
      { day: 'Tue', workout: { id: 'wt-2', title: 'Upper Body Sculpt', duration: 40, difficulty: 'Medium', muscles: ['Shoulders', 'Arms', 'Back'], emoji: '💃',
        exercises: [
          { name: 'Light Dumbbell Curls', sets: 3, reps: '15', rest: '30s' },
          { name: 'Tricep Kickbacks', sets: 3, reps: '15', rest: '30s' },
          { name: 'Front Raises', sets: 3, reps: '12', rest: '30s' },
          { name: 'Face Pulls (Band)', sets: 3, reps: '15', rest: '30s' },
          { name: 'Bent Over Fly', sets: 3, reps: '12', rest: '30s' },
        ]
      }},
      { day: 'Wed', workout: { id: 'wt-3', title: 'Yoga Flow & Stretch', duration: 50, difficulty: 'Low', muscles: ['Full Body', 'Flexibility'], emoji: '🧘',
        exercises: [
          { name: 'Sun Salutation A', sets: 3, reps: '5 rounds', rest: '0s' },
          { name: 'Warrior I & II', sets: 1, reps: '5 breaths each', rest: '0s' },
          { name: 'Chair Pose', sets: 3, reps: '30s', rest: '0s' },
          { name: 'Downward Dog', sets: 3, reps: '60s', rest: '0s' },
          { name: 'Savasana', sets: 1, reps: '5 mins', rest: '0s' },
        ]
      }},
      { day: 'Thu', workout: { id: 'wt-4', title: 'Lower Body Barre', duration: 45, difficulty: 'Medium', muscles: ['Glutes', 'Thighs', 'Calves'], emoji: '🩰',
        exercises: [
          { name: 'Plie Squats', sets: 3, reps: '20', rest: '20s' },
          { name: 'Arabesque Lifts', sets: 3, reps: '15 each', rest: '20s' },
          { name: 'Inner Thigh Pulses', sets: 3, reps: '30s', rest: '20s' },
          { name: 'Standing Leg Curls', sets: 3, reps: '15 each', rest: '20s' },
          { name: 'Relevé Hold', sets: 3, reps: '30s', rest: '20s' },
        ]
      }},
      { day: 'Fri', workout: { id: 'wt-5', title: 'Full Body Circuit', duration: 40, difficulty: 'Medium', muscles: ['Full Body', 'Core', 'Legs'], emoji: '⚡',
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: '20', rest: '30s' },
          { name: 'Push-Ups', sets: 3, reps: '10', rest: '30s' },
          { name: 'Glute Bridges', sets: 3, reps: '20', rest: '20s' },
          { name: 'Plank', sets: 3, reps: '30s', rest: '30s' },
          { name: 'Jumping Jacks', sets: 3, reps: '30', rest: '20s' },
        ]
      }},
      { day: 'Sat', workout: { id: 'wt-6', title: 'Mobility & Recovery', duration: 30, difficulty: 'Low', muscles: ['Full Body', 'Joints', 'Flexibility'], emoji: '🌿',
        exercises: [
          { name: 'Foam Roll Full Body', sets: 1, reps: '10 mins', rest: '0s' },
          { name: 'Hip 90/90 Stretch', sets: 2, reps: '60s each', rest: '0s' },
          { name: 'Thoracic Rotation', sets: 2, reps: '10 each', rest: '0s' },
          { name: 'Butterfly Stretch', sets: 2, reps: '60s', rest: '0s' },
        ]
      }},
      { day: 'Sun', workout: null },
    ],
    muscle: [
      { day: 'Mon', workout: { id: 'wm-1', title: 'Glute & Hamstring Power', duration: 55, difficulty: 'High', muscles: ['Glutes', 'Hamstrings', 'Quads'], emoji: '🏋️',
        exercises: [
          { name: 'Barbell Hip Thrust', sets: 4, reps: '10', rest: '90s' },
          { name: 'Romanian Deadlift', sets: 4, reps: '8', rest: '90s' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', rest: '90s' },
          { name: 'Leg Curl', sets: 3, reps: '12', rest: '60s' },
          { name: 'Glute Kickbacks (Cable)', sets: 3, reps: '15 each', rest: '45s' },
        ]
      }},
      { day: 'Tue', workout: { id: 'wm-2', title: 'Upper Body Strength', duration: 50, difficulty: 'High', muscles: ['Back', 'Shoulders', 'Biceps', 'Chest'], emoji: '💪',
        exercises: [
          { name: 'Assisted Pull-Ups', sets: 4, reps: '8', rest: '90s' },
          { name: 'Dumbbell Press', sets: 3, reps: '10', rest: '75s' },
          { name: 'Bent-Over Row', sets: 3, reps: '10', rest: '75s' },
          { name: 'Arnold Press', sets: 3, reps: '12', rest: '60s' },
          { name: 'Hammer Curls', sets: 3, reps: '12', rest: '60s' },
        ]
      }},
      { day: 'Wed', workout: { id: 'wm-3', title: 'Active Recovery Yoga', duration: 30, difficulty: 'Low', muscles: ['Full Body', 'Recovery'], emoji: '🌺',
        exercises: [
          { name: 'Foam Rolling', sets: 1, reps: '10 mins', rest: '0s' },
          { name: 'Down Dog to Cobra', sets: 3, reps: '5', rest: '0s' },
          { name: 'Hip Flexor Lunge', sets: 2, reps: '60s each', rest: '0s' },
          { name: 'Seated Forward Fold', sets: 2, reps: '90s', rest: '0s' },
        ]
      }},
      { day: 'Thu', workout: { id: 'wm-4', title: 'Lower Body Hypertrophy', duration: 55, difficulty: 'High', muscles: ['Quads', 'Calves', 'Glutes'], emoji: '🦵',
        exercises: [
          { name: 'Back Squat', sets: 4, reps: '8', rest: '120s' },
          { name: 'Leg Press', sets: 4, reps: '12', rest: '90s' },
          { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: '60s' },
          { name: 'Leg Extension', sets: 3, reps: '15', rest: '45s' },
          { name: 'Standing Calf Raise', sets: 4, reps: '20', rest: '45s' },
        ]
      }},
      { day: 'Fri', workout: { id: 'wm-5', title: 'Back & Bicep Day', duration: 45, difficulty: 'High', muscles: ['Back', 'Biceps', 'Rear Delts'], emoji: '🎯',
        exercises: [
          { name: 'Lat Pulldown', sets: 4, reps: '10', rest: '75s' },
          { name: 'Seated Cable Row', sets: 4, reps: '12', rest: '75s' },
          { name: 'Dumbbell Curl', sets: 3, reps: '12', rest: '60s' },
          { name: 'Face Pulls', sets: 3, reps: '15', rest: '45s' },
          { name: 'Reverse Fly', sets: 3, reps: '15', rest: '45s' },
        ]
      }},
      { day: 'Sat', workout: { id: 'wm-6', title: 'Core & Conditioning', duration: 35, difficulty: 'Medium', muscles: ['Core', 'Abs', 'Obliques'], emoji: '🌟',
        exercises: [
          { name: 'Cable Crunch', sets: 3, reps: '15', rest: '45s' },
          { name: 'Side Plank', sets: 3, reps: '45s each', rest: '30s' },
          { name: 'Pallof Press', sets: 3, reps: '12 each', rest: '45s' },
          { name: 'Ab Wheel Rollout', sets: 3, reps: '10', rest: '60s' },
        ]
      }},
      { day: 'Sun', workout: null },
    ],
  },
  men: {
    muscle: [
      { day: 'Mon', workout: { id: 'mp-1', title: 'Push Day — Chest & Shoulders', duration: 60, difficulty: 'High', muscles: ['Chest', 'Shoulders', 'Triceps'], emoji: '🏋️',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '8', rest: '120s' },
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10', rest: '90s' },
          { name: 'Overhead Press', sets: 3, reps: '10', rest: '90s' },
          { name: 'Lateral Raises', sets: 4, reps: '15', rest: '60s' },
          { name: 'Tricep Pushdowns', sets: 3, reps: '15', rest: '60s' },
          { name: 'Skull Crushers', sets: 3, reps: '12', rest: '60s' },
        ]
      }},
      { day: 'Tue', workout: { id: 'mp-2', title: 'Pull Day — Back & Biceps', duration: 60, difficulty: 'High', muscles: ['Back', 'Biceps', 'Rear Delts'], emoji: '💪',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '5', rest: '180s' },
          { name: 'Pull-Ups', sets: 4, reps: '8', rest: '120s' },
          { name: 'Bent-Over Row', sets: 4, reps: '10', rest: '90s' },
          { name: 'Cable Row', sets: 3, reps: '12', rest: '75s' },
          { name: 'Barbell Curl', sets: 3, reps: '10', rest: '60s' },
          { name: 'Hammer Curls', sets: 3, reps: '12', rest: '60s' },
        ]
      }},
      { day: 'Wed', workout: { id: 'mp-3', title: 'Leg Day — Quad Dominant', duration: 65, difficulty: 'High', muscles: ['Quads', 'Glutes', 'Calves'], emoji: '🦵',
        exercises: [
          { name: 'Back Squat', sets: 5, reps: '6', rest: '180s' },
          { name: 'Leg Press', sets: 4, reps: '12', rest: '120s' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', rest: '90s' },
          { name: 'Leg Extension', sets: 3, reps: '15', rest: '60s' },
          { name: 'Standing Calf Raises', sets: 5, reps: '15', rest: '45s' },
        ]
      }},
      { day: 'Thu', workout: { id: 'mp-4', title: 'Push Day II — Shoulders Focus', duration: 55, difficulty: 'High', muscles: ['Shoulders', 'Chest', 'Triceps'], emoji: '🎯',
        exercises: [
          { name: 'Seated DB Press', sets: 4, reps: '10', rest: '90s' },
          { name: 'Front Raises', sets: 3, reps: '12', rest: '60s' },
          { name: 'Cable Lateral Raises', sets: 4, reps: '15', rest: '45s' },
          { name: 'Dips', sets: 3, reps: '12', rest: '75s' },
          { name: 'Close-Grip Bench', sets: 3, reps: '12', rest: '75s' },
        ]
      }},
      { day: 'Fri', workout: { id: 'mp-5', title: 'Pull Day II — Back Width', duration: 55, difficulty: 'High', muscles: ['Lats', 'Biceps', 'Traps'], emoji: '🔱',
        exercises: [
          { name: 'Weighted Pull-Ups', sets: 4, reps: '8', rest: '120s' },
          { name: 'Lat Pulldown', sets: 4, reps: '10', rest: '90s' },
          { name: 'Single-Arm DB Row', sets: 3, reps: '12 each', rest: '75s' },
          { name: 'Preacher Curls', sets: 3, reps: '12', rest: '60s' },
          { name: 'Shrugs', sets: 4, reps: '15', rest: '45s' },
        ]
      }},
      { day: 'Sat', workout: { id: 'mp-6', title: 'Leg Day II — Posterior Chain', duration: 60, difficulty: 'High', muscles: ['Hamstrings', 'Glutes', 'Lower Back'], emoji: '⚡',
        exercises: [
          { name: 'Romanian Deadlift', sets: 4, reps: '8', rest: '120s' },
          { name: 'Leg Curl', sets: 4, reps: '12', rest: '75s' },
          { name: 'Hip Thrust', sets: 4, reps: '12', rest: '75s' },
          { name: 'Good Mornings', sets: 3, reps: '12', rest: '75s' },
          { name: 'Seated Calf Raises', sets: 4, reps: '20', rest: '45s' },
        ]
      }},
      { day: 'Sun', workout: null },
    ],
    loss: [
      { day: 'Mon', workout: { id: 'ml-1', title: 'HIIT Bodyweight Conditioning', duration: 45, difficulty: 'High', muscles: ['Full Body', 'Cardio', 'Core'], emoji: '🔥',
        exercises: [
          { name: 'Burpees', sets: 4, reps: '15', rest: '30s' },
          { name: 'Jump Squats', sets: 4, reps: '20', rest: '30s' },
          { name: 'Push-Up to Row', sets: 3, reps: '12', rest: '30s' },
          { name: 'Box Jumps', sets: 4, reps: '10', rest: '45s' },
          { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '20s' },
        ]
      }},
      { day: 'Tue', workout: { id: 'ml-2', title: 'Upper/Lower Strength A', duration: 55, difficulty: 'High', muscles: ['Full Body', 'Strength'], emoji: '💪',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: '8', rest: '90s' },
          { name: 'Squat', sets: 4, reps: '8', rest: '90s' },
          { name: 'Row', sets: 4, reps: '8', rest: '90s' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10', rest: '75s' },
          { name: 'Pull-Ups', sets: 3, reps: '8', rest: '75s' },
        ]
      }},
      { day: 'Wed', workout: { id: 'ml-3', title: 'Cardio Sprint Intervals', duration: 30, difficulty: 'High', muscles: ['Cardio', 'Legs'], emoji: '🏃',
        exercises: [
          { name: '400m Sprint', sets: 6, reps: '1', rest: '90s' },
          { name: 'Jump Rope', sets: 5, reps: '1 min', rest: '30s' },
          { name: 'High Knees', sets: 4, reps: '45s', rest: '20s' },
        ]
      }},
      { day: 'Thu', workout: { id: 'ml-4', title: 'Upper/Lower Strength B', duration: 55, difficulty: 'High', muscles: ['Full Body', 'Strength'], emoji: '🎯',
        exercises: [
          { name: 'Overhead Press', sets: 4, reps: '8', rest: '90s' },
          { name: 'Front Squat', sets: 4, reps: '8', rest: '90s' },
          { name: 'Chin-Ups', sets: 4, reps: '8', rest: '90s' },
          { name: 'Hip Thrust', sets: 3, reps: '12', rest: '75s' },
          { name: 'Dips', sets: 3, reps: '10', rest: '60s' },
        ]
      }},
      { day: 'Fri', workout: { id: 'ml-5', title: 'Metabolic AMRAP Circuit', duration: 35, difficulty: 'High', muscles: ['Full Body', 'Metabolic'], emoji: '⚡',
        exercises: [
          { name: 'Kettlebell Swings', sets: 1, reps: 'AMRAP 20 min', rest: '0s' },
          { name: 'Goblet Squat', sets: 1, reps: 'In circuit', rest: '0s' },
          { name: 'Push-Ups', sets: 1, reps: 'In circuit', rest: '0s' },
          { name: 'Renegade Rows', sets: 1, reps: 'In circuit', rest: '0s' },
        ]
      }},
      { day: 'Sat', workout: { id: 'ml-6', title: 'Steady-State Cardio', duration: 45, difficulty: 'Medium', muscles: ['Cardio', 'Endurance'], emoji: '🚴',
        exercises: [
          { name: 'Rowing Machine', sets: 1, reps: '20 min', rest: '0s' },
          { name: 'Bike (Zone 2)', sets: 1, reps: '20 min', rest: '0s' },
          { name: 'Cool Down Walk', sets: 1, reps: '5 min', rest: '0s' },
        ]
      }},
      { day: 'Sun', workout: null },
    ],
    tone: [
      { day: 'Mon', workout: { id: 'mh-1', title: 'Chest Hypertrophy', duration: 60, difficulty: 'High', muscles: ['Chest', 'Front Delts', 'Triceps'], emoji: '🏋️',
        exercises: [
          { name: 'Incline Bench Press', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Flat Dumbbell Fly', sets: 3, reps: '12-15', rest: '75s' },
          { name: 'Cable Crossover', sets: 3, reps: '15', rest: '60s' },
          { name: 'Decline Push-Up', sets: 3, reps: '15', rest: '45s' },
          { name: 'Tricep Overhead Ext.', sets: 4, reps: '12', rest: '60s' },
        ]
      }},
      { day: 'Tue', workout: { id: 'mh-2', title: 'Back Hypertrophy', duration: 60, difficulty: 'High', muscles: ['Lats', 'Mid Back', 'Biceps'], emoji: '💪',
        exercises: [
          { name: 'Wide-Grip Pull-Up', sets: 4, reps: '10', rest: '90s' },
          { name: 'T-Bar Row', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Straight-Arm Pulldown', sets: 3, reps: '15', rest: '60s' },
          { name: 'Dumbbell Curl', sets: 4, reps: '12', rest: '60s' },
          { name: 'Incline DB Curl', sets: 3, reps: '12', rest: '60s' },
        ]
      }},
      { day: 'Wed', workout: { id: 'mh-3', title: 'Leg Hypertrophy', duration: 65, difficulty: 'High', muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'], emoji: '🦵',
        exercises: [
          { name: 'Hack Squat', sets: 4, reps: '10-12', rest: '120s' },
          { name: 'Leg Press (high foot)', sets: 4, reps: '12', rest: '90s' },
          { name: 'Lying Leg Curl', sets: 4, reps: '12', rest: '75s' },
          { name: 'Lunges', sets: 3, reps: '12 each', rest: '75s' },
          { name: 'Seated Calf Raise', sets: 5, reps: '15-20', rest: '45s' },
        ]
      }},
      { day: 'Thu', workout: { id: 'mh-4', title: 'Shoulder Hypertrophy', duration: 55, difficulty: 'High', muscles: ['All 3 Delt Heads', 'Traps'], emoji: '🎯',
        exercises: [
          { name: 'DB Shoulder Press', sets: 4, reps: '10-12', rest: '90s' },
          { name: 'Upright Row', sets: 3, reps: '12', rest: '75s' },
          { name: 'Cable Lateral Raise', sets: 4, reps: '15-20', rest: '45s' },
          { name: 'Rear Delt Fly', sets: 4, reps: '15', rest: '45s' },
          { name: 'Barbell Shrug', sets: 4, reps: '15', rest: '60s' },
        ]
      }},
      { day: 'Fri', workout: { id: 'mh-5', title: 'Arm Hypertrophy Day', duration: 50, difficulty: 'Medium', muscles: ['Biceps', 'Triceps', 'Forearms'], emoji: '💥',
        exercises: [
          { name: 'EZ-Bar Curl', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Close-Grip Bench', sets: 4, reps: '10-12', rest: '75s' },
          { name: 'Concentration Curl', sets: 3, reps: '12', rest: '60s' },
          { name: 'Overhead Tricep Ext.', sets: 3, reps: '12', rest: '60s' },
          { name: 'Reverse Curl', sets: 3, reps: '15', rest: '45s' },
        ]
      }},
      { day: 'Sat', workout: { id: 'mh-6', title: 'Weak Point Training', duration: 45, difficulty: 'Medium', muscles: ['Weak Points', 'Core'], emoji: '⭐',
        exercises: [
          { name: 'Abs: Cable Crunch', sets: 4, reps: '15', rest: '45s' },
          { name: 'Calves: Donkey Raise', sets: 5, reps: '20', rest: '30s' },
          { name: 'Traps: DB Shrug', sets: 4, reps: '20', rest: '30s' },
          { name: 'Forearms: Wrist Curl', sets: 3, reps: '20', rest: '30s' },
        ]
      }},
      { day: 'Sun', workout: null },
    ],
  },
};

const DIFF_COLORS = { High: '#e11d48', Medium: '#d97706', Low: '#059669' };

/* ═══════════════════════════════════════════════════════════════
   WORKOUT TIMER (POMODORO / REST TIMER)
═══════════════════════════════════════════════════════════════ */

function WorkoutTimer({ onClose }) {
  const [phase, setPhase] = useState('work'); // 'work' | 'rest'
  const [workSecs, setWorkSecs] = useState(25 * 60);
  const [restSecs, setRestSecs] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const total = phase === 'work' ? workSecs : restSecs;
  const remaining = total - elapsed;
  const pct = Math.round(((total - remaining) / total) * 100);
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          if (e + 1 >= total) {
            setPhase(p => p === 'work' ? 'rest' : 'work');
            setElapsed(0);
            return 0;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, total]);

  const RADIUS = 70;
  const CIRC = 2 * Math.PI * RADIUS;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: 28, padding: '36px', maxWidth: 360, width: '100%',
        textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', animation: 'popIn 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#000' }}>
            {phase === 'work' ? '💪 Work Phase' : '😮‍💨 Rest Phase'}
          </h3>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700 }}>
            ✕ Close
          </button>
        </div>

        <svg width={180} height={180} style={{ margin: '0 auto 20px', display: 'block' }}>
          <circle cx={90} cy={90} r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={10} />
          <circle
            cx={90} cy={90} r={RADIUS} fill="none"
            stroke={phase === 'work' ? '#4f46e5' : '#059669'} strokeWidth={10}
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - pct / 100)}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
          <text x={90} y={85} textAnchor="middle" fontSize={32} fontWeight={900} fill="#000" fontFamily="Outfit, sans-serif">
            {mm}:{ss}
          </text>
          <text x={90} y={112} textAnchor="middle" fontSize={13} fill="#64748b" fontFamily="Plus Jakarta Sans, sans-serif">
            {phase === 'work' ? 'Focus Time' : 'Rest Time'}
          </text>
        </svg>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              padding: '12px 28px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: running ? '#fef2f2' : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              color: running ? '#e11d48' : '#fff', fontWeight: 800, fontSize: 15,
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {running ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
          </button>
          <button
            onClick={() => { setElapsed(0); setRunning(false); setPhase('work'); }}
            style={{
              padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center',
            }}
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12 }}>
            <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Work Time</p>
            <select
              value={workSecs}
              onChange={e => { setWorkSecs(+e.target.value); setElapsed(0); setPhase('work'); setRunning(false); }}
              style={{ border: 'none', background: 'none', fontWeight: 800, fontSize: 14, color: '#4f46e5', cursor: 'pointer', width: '100%' }}
            >
              {[5*60,10*60,15*60,20*60,25*60,30*60,45*60].map(s => (
                <option key={s} value={s}>{s/60} min</option>
              ))}
            </select>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 12 }}>
            <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Rest Time</p>
            <select
              value={restSecs}
              onChange={e => { setRestSecs(+e.target.value); setElapsed(0); setPhase('work'); setRunning(false); }}
              style={{ border: 'none', background: 'none', fontWeight: 800, fontSize: 14, color: '#059669', cursor: 'pointer', width: '100%' }}
            >
              {[30,60,90,120,180,300].map(s => (
                <option key={s} value={s}>{s < 60 ? `${s}s` : `${s/60} min`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WORKOUT CARD
═══════════════════════════════════════════════════════════════ */

function WorkoutCard({ workout, profileColor, onComplete, isCompleted, todayDay }) {
  const [expanded, setExpanded] = useState(false);
  const [checkedExercises, setCheckedExercises] = useState(new Set());
  const [showTimer, setShowTimer] = useState(false);
  const allDone = workout.exercises.length > 0 && checkedExercises.size === workout.exercises.length;
  const color = profileColor;

  const toggleExercise = (idx) => {
    setCheckedExercises(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  useEffect(() => {
    if (allDone && !isCompleted) {
      onComplete();
    }
  }, [allDone]);

  return (
    <>
      {showTimer && <WorkoutTimer onClose={() => setShowTimer(false)} />}
      <div style={{
        background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px -2px rgba(0,0,0,0.06)',
        overflow: 'hidden', transition: 'all 0.2s ease',
      }}>
        {/* Card Header */}
        <div style={{
          background: isCompleted
            ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)'
            : `linear-gradient(135deg, ${color}10, ${color}1a)`,
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 28 }}>{workout.emoji}</span>
                {isCompleted && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                    background: '#059669', color: '#fff', letterSpacing: '0.05em',
                  }}>✓ COMPLETED</span>
                )}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#000', letterSpacing: '-0.02em', marginBottom: 8 }}>
                {workout.title}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569', fontWeight: 600 }}>
                  <Clock size={12} /> {workout.duration} min
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                  background: `${DIFF_COLORS[workout.difficulty]}18`, color: DIFF_COLORS[workout.difficulty],
                }}>
                  {workout.difficulty}
                </span>
                {workout.muscles.map(m => (
                  <span key={m} style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                    background: `${color}12`, color,
                  }}>{m}</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setExpanded(e => !e)}
              style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', borderRadius: 10, padding: 8 }}
            >
              {expanded ? <ChevronUp size={18} color="#475569" /> : <ChevronDown size={18} color="#475569" />}
            </button>
          </div>
        </div>

        {/* Exercises List */}
        {expanded && (
          <div className="animate-fade" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {workout.exercises.map((ex, idx) => {
                const done = checkedExercises.has(idx);
                return (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                    borderRadius: 12, background: done ? '#f0fdf4' : '#fafafa',
                    border: `1px solid ${done ? '#86efac' : '#f1f5f9'}`,
                    transition: 'all 0.15s ease',
                  }}>
                    <button
                      onClick={() => toggleExercise(idx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}
                    >
                      {done
                        ? <CheckSquare size={20} color="#059669" />
                        : <Square size={20} color="#cbd5e1" />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: 13, fontWeight: 700, color: done ? '#059669' : '#000',
                        textDecoration: done ? 'line-through' : 'none',
                      }}>
                        {ex.name}
                      </p>
                      <p style={{ fontSize: 11, color: '#64748b' }}>
                        {ex.sets} sets × {ex.reps}
                        {ex.rest !== '0s' && <span style={{ color: '#94a3b8', marginLeft: 6 }}>rest {ex.rest}</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setShowTimer(true)}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: '#fff', fontWeight: 800, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: `0 4px 12px ${color}30`,
                }}
              >
                <Timer size={15} /> Start Workout Timer
              </button>
              <div style={{
                padding: '11px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: '#475569',
              }}>
                <Check size={14} color={color} />
                {checkedExercises.size}/{workout.exercises.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function WorkoutScheduler({ data, setData }) {
  const [profileId, setProfileId] = useState('women');
  const [goalId, setGoalId] = useState('loss');
  const [focusFilter, setFocusFilter] = useState('all');
  const [completedWorkouts, setCompletedWorkouts] = useState(new Set());

  const profile = PROFILES.find(p => p.id === profileId);
  const goalIds = profile.goals.map(g => g.id);
  const activeGoalId = goalIds.includes(goalId) ? goalId : goalIds[0];

  const schedule = WEEKLY_SCHEDULES[profileId]?.[activeGoalId] || [];
  const today = new Date().getDay();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = dayNames[today];

  const handleCompleteWorkout = useCallback((workoutId, workoutTitle) => {
    setCompletedWorkouts(prev => new Set([...prev, workoutId]));
    // Sync to fitness habit in main app
    if (setData) {
      setData(prev => {
        const todayStr = new Date().toISOString().split('T')[0];
        const fitnessHabit = (prev.habits || []).find(h => h.category === 'Fitness') || (prev.habits || [])[0];
        const habitId = fitnessHabit ? fitnessHabit.id : 'h-fitness';
        const key = `${habitId}_${todayStr}`;

        const updatedCompletions = {
          ...prev.completions,
          [key]: {
            id: key,
            habitId: habitId,
            date: todayStr,
            status: 'completed',
            value: 1,
            note: `Completed workout: ${workoutTitle || workoutId}`
          }
        };

        const updatedHabits = (prev.habits || []).map(h => {
          if (h.id === habitId) {
            return { ...h, streak: (h.streak || 0) + 1 };
          }
          return h;
        });

        const newBurn = {
          id: `wburn-${Date.now()}`,
          name: `Workout: ${workoutTitle || 'Session'}`,
          calories: 320,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Workout Scheduler',
          duration: 45
        };

        const updatedCalories = prev.calories ? {
          ...prev.calories,
          burned: [newBurn, ...(prev.calories.burned || [])]
        } : prev.calories;

        return {
          ...prev,
          completions: updatedCompletions,
          habits: updatedHabits,
          calories: updatedCalories,
          user: prev.user ? {
            ...prev.user,
            totalPoints: (prev.user.totalPoints || 0) + 25,
            currentXP: (prev.user.currentXP || 0) + 30
          } : prev.user
        };
      });
    }

    try {
      soundEffects.playSuccess();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // Audio/confetti fallback
    }
  }, [setData]);

  const filteredSchedule = schedule.filter(s => s.workout && workoutMatchesFocus(s.workout, focusFilter));

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${profile.color}15, ${profile.color}08)`,
        border: `1px solid ${profile.color}25`, borderRadius: 24, padding: '24px 28px',
        display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.4s ease',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 18, background: profile.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 24px ${profile.color}35`, flexShrink: 0,
        }}>
          <Dumbbell size={28} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#000', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Gender-Specific Workout Scheduler
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
            Weekly training plan for <strong style={{ color: profile.color }}>{profile.label}</strong> · Goal: <strong style={{ color: profile.color }}>{profile.goals.find(g => g.id === activeGoalId)?.label}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: profile.color }}>{completedWorkouts.size}</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>Completed</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: profile.color }}>{schedule.filter(s => s.workout).length}</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>This Week</p>
          </div>
        </div>
      </div>

      {/* Profile Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {PROFILES.map(p => {
          const Icon = p.icon;
          const isActive = profileId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => { setProfileId(p.id); setGoalId(p.goals[0].id); setFocusFilter('all'); }}
              style={{
                padding: '16px 20px', borderRadius: 18, cursor: 'pointer',
                background: isActive ? p.gradient : '#f8fafc',
                border: `2px solid ${isActive ? p.color : '#e2e8f0'}`,
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.25s ease',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isActive ? `0 8px 24px ${p.color}30` : 'none',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: isActive ? 'rgba(255,255,255,0.25)' : `${p.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={22} color={isActive ? '#fff' : p.color} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: isActive ? '#fff' : '#000', letterSpacing: '-0.02em' }}>{p.label}</p>
                <p style={{ fontSize: 11, color: isActive ? 'rgba(255,255,255,0.75)' : '#64748b' }}>
                  {p.goals.map(g => g.label).join(' · ')}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Goal Selector */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {profile.goals.map(goal => {
          const GoalIcon = goal.icon;
          const isActive = activeGoalId === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => { setGoalId(goal.id); setFocusFilter('all'); }}
              style={{
                padding: '10px 18px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: isActive ? profile.gradient : '#f1f5f9',
                color: isActive ? '#fff' : '#475569',
                fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? `0 4px 12px ${profile.color}30` : 'none',
              }}
            >
              <GoalIcon size={15} />
              {goal.label}
            </button>
          );
        })}
      </div>

      {/* Tailored Focus Options Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#fff', borderRadius: 18, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#000' }}>
            🎯 Focus Routines ({profile.label}):
          </span>
          {focusFilter !== 'all' && (
            <button
              onClick={() => setFocusFilter('all')}
              style={{ fontSize: 11, color: profile.color, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Reset to All Focuses ✕
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(FOCUS_OPTIONS[profileId] || []).map(f => {
            const isSel = focusFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFocusFilter(f.id)}
                style={{
                  padding: '7px 14px', borderRadius: 99,
                  border: `1.5px solid ${isSel ? profile.color : '#e2e8f0'}`,
                  background: isSel ? profile.color : '#f8fafc',
                  color: isSel ? '#fff' : '#475569',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSel ? `0 2px 8px ${profile.color}35` : 'none'
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#000', letterSpacing: '-0.02em', marginBottom: 16 }}>
          📅 Weekly Training Schedule
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 20 }}>
          {schedule.map(({ day, workout }) => {
            const isToday = day === todayName;
            const isDone = workout && completedWorkouts.has(workout.id);
            const matchesCurrentFocus = workoutMatchesFocus(workout, focusFilter);
            return (
              <div key={day} style={{
                borderRadius: 16, padding: '12px 8px', textAlign: 'center',
                background: isToday
                  ? `linear-gradient(135deg, ${profile.color}15, ${profile.color}25)`
                  : isDone ? '#f0fdf4' : '#f8fafc',
                border: `2px solid ${isToday ? profile.color : isDone ? '#86efac' : '#e2e8f0'}`,
                opacity: matchesCurrentFocus ? 1 : 0.45,
                transition: 'all 0.2s ease',
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: isToday ? profile.color : '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {day}
                </p>
                {workout ? (
                  <>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{workout.emoji}</div>
                    <p style={{ fontSize: 9.5, fontWeight: 700, color: isToday ? profile.color : '#475569', lineHeight: 1.3, margin: '0 auto' }}>
                      {workout.title.split(' ').slice(0, 2).join(' ')}
                    </p>
                    <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 3 }}>{workout.duration}m</p>
                    {isDone && <div style={{ fontSize: 14, marginTop: 4 }}>✅</div>}
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 20 }}>😴</div>
                    <p style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 4 }}>Rest Day</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Today's Workout Detail */}
        {schedule.find(s => s.day === todayName)?.workout ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: profile.color }} />
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#000' }}>Today's Workout — {todayName}</h3>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                background: `${profile.color}15`, color: profile.color,
              }}>Today</span>
            </div>
            <WorkoutCard
              workout={schedule.find(s => s.day === todayName).workout}
              profileColor={profile.color}
              onComplete={() => handleCompleteWorkout(schedule.find(s => s.day === todayName).workout.id, schedule.find(s => s.day === todayName).workout.title)}
              isCompleted={completedWorkouts.has(schedule.find(s => s.day === todayName).workout?.id)}
              todayDay={todayName}
            />
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg,#f8fafc,#f0fdf4)', borderRadius: 20, padding: '32px',
            textAlign: 'center', border: '1px solid #e2e8f0',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#000', marginBottom: 8 }}>Rest Day — {todayName}</h3>
            <p style={{ fontSize: 14, color: '#64748b' }}>Recovery is where growth happens. Eat well, sleep well, and prepare for tomorrow.</p>
          </div>
        )}

        {/* All Week Cards */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#000' }}>
            📋 Full Week Workouts {focusFilter !== 'all' && `(${focusFilter})`}
          </h3>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
            {filteredSchedule.length} routines
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredSchedule.map(({ day, workout }) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              profileColor={profile.color}
              onComplete={() => handleCompleteWorkout(workout.id, workout.title)}
              isCompleted={completedWorkouts.has(workout.id)}
              todayDay={todayName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
