import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dumbbell, Salad, ChevronDown, Check, CheckSquare, Square,
  Flame, Droplets, Target, Zap, TrendingUp, Activity,
  Plus, Minus, Sun, Moon, Coffee, Sunset, Star, User, Users,
  BarChart3, Clock, Heart, Wind, ArrowRight, CheckCircle2,
  Timer, Play, Pause, RotateCcw
} from 'lucide-react';
import { soundEffects } from '../utils/audio';
import confetti from 'canvas-confetti';

/* ═══════════════════════════════════════════════════════════════
   DATA — WORKOUT PLANS (condensed for planner)
═══════════════════════════════════════════════════════════════ */

const PLANNER_WORKOUTS = {
  'male-muscle': {
    emoji: '🏋️', title: 'Push Day — Chest & Triceps', duration: 60,
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10' },
      { name: 'Overhead Press', sets: 3, reps: '10' },
      { name: 'Lateral Raises', sets: 4, reps: '15' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '15' },
    ],
  },
  'male-loss': {
    emoji: '🔥', title: 'HIIT Bodyweight Conditioning', duration: 45,
    muscles: ['Full Body', 'Cardio', 'Core'],
    exercises: [
      { name: 'Burpees', sets: 4, reps: '15' },
      { name: 'Jump Squats', sets: 4, reps: '20' },
      { name: 'Mountain Climbers', sets: 3, reps: '30s' },
      { name: 'Push-Up to Row', sets: 3, reps: '12' },
      { name: 'Box Jumps', sets: 3, reps: '10' },
    ],
  },
  'female-muscle': {
    emoji: '🍑', title: 'Glute & Hamstring Power', duration: 55,
    muscles: ['Glutes', 'Hamstrings', 'Quads'],
    exercises: [
      { name: 'Barbell Hip Thrust', sets: 4, reps: '12' },
      { name: 'Romanian Deadlift', sets: 4, reps: '10' },
      { name: 'Sumo Squat', sets: 3, reps: '12' },
      { name: 'Glute Kickbacks', sets: 3, reps: '15 each' },
      { name: 'Calf Raises', sets: 3, reps: '20' },
    ],
  },
  'female-loss': {
    emoji: '✨', title: 'Full Body HIIT', duration: 40,
    muscles: ['Full Body', 'Core', 'Cardio'],
    exercises: [
      { name: 'Jump Squats', sets: 3, reps: '15' },
      { name: 'Burpees', sets: 3, reps: '12' },
      { name: 'Mountain Climbers', sets: 3, reps: '20' },
      { name: 'High Knees', sets: 3, reps: '30s' },
      { name: 'Plank Hold', sets: 3, reps: '40s' },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════
   DATA — MEAL PLANS
═══════════════════════════════════════════════════════════════ */

const MEAL_PLANS = {
  loss: {
    dailyCal: 1600,
    proteinTarget: 130,
    meals: [
      {
        id: 'm1', slot: 'Breakfast', icon: Coffee, color: '#f59e0b', time: '7:00 AM',
        name: 'Egg White Veggie Scramble', calories: 195, protein: 28, carbs: 10, fats: 5, emoji: '🍳',
        desc: '5 egg whites, spinach, mushrooms, bell peppers',
      },
      {
        id: 'm2', slot: 'Snack', icon: Sun, color: '#059669', time: '10:30 AM',
        name: 'Greek Yogurt & Berries', calories: 210, protein: 22, carbs: 24, fats: 3, emoji: '🫐',
        desc: 'Plain Greek yogurt with mixed berries & chia seeds',
      },
      {
        id: 'm3', slot: 'Lunch', icon: Sun, color: '#059669', time: '1:00 PM',
        name: 'Grilled Chicken Kale Bowl', calories: 380, protein: 42, carbs: 28, fats: 9, emoji: '🥗',
        desc: 'Grilled chicken, kale, chickpeas, lemon-tahini',
      },
      {
        id: 'm4', slot: 'Dinner', icon: Sunset, color: '#0891b2', time: '7:30 PM',
        name: 'Salmon & Asparagus Bake', calories: 420, protein: 45, carbs: 6, fats: 24, emoji: '🐟',
        desc: 'Baked salmon, asparagus, lemon, garlic, dill',
      },
    ],
  },
  gain: {
    dailyCal: 3000,
    proteinTarget: 180,
    meals: [
      {
        id: 'm5', slot: 'Breakfast', icon: Coffee, color: '#f59e0b', time: '7:00 AM',
        name: 'Mass-Builder Eggs & Avocado Toast', calories: 680, protein: 34, carbs: 58, fats: 30, emoji: '🥑',
        desc: '3 whole eggs, sourdough toast, avocado, olive oil',
      },
      {
        id: 'm6', slot: 'Snack', icon: Sun, color: '#d97706', time: '10:30 AM',
        name: 'Peanut Butter Banana Smoothie', calories: 680, protein: 32, carbs: 82, fats: 22, emoji: '🥤',
        desc: 'Oats, banana, peanut butter, whole milk, whey protein',
      },
      {
        id: 'm7', slot: 'Lunch', icon: Sun, color: '#059669', time: '1:00 PM',
        name: 'Steak & Sweet Potato Plate', calories: 750, protein: 55, carbs: 62, fats: 28, emoji: '🥩',
        desc: '200g sirloin, roasted sweet potato, broccoli',
      },
      {
        id: 'm8', slot: 'Dinner', icon: Sunset, color: '#0891b2', time: '7:30 PM',
        name: 'Tuna Rice Gain Bowl', calories: 640, protein: 48, carbs: 65, fats: 18, emoji: '🍱',
        desc: 'Canned tuna, white rice, avocado, sesame, soy sauce',
      },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

function ProfileHeader({ gender, goal, energy, onGenderChange, onGoalChange, onEnergyChange }) {
  const genderColor = gender === 'male' ? '#4f46e5' : '#e11d48';
  const goalColor = goal === 'gain' ? '#d97706' : '#059669';

  return (
    <div style={{
      background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 14,
          background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Star size={20} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#000', letterSpacing: '-0.03em' }}>Fitness & Food Planner</h2>
          <p style={{ fontSize: 11, color: '#64748b' }}>Unified daily dashboard</p>
        </div>
      </div>

      <div style={{ width: 1, height: 40, background: '#e2e8f0' }} />

      {/* Gender Toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gender</label>
        <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {['male', 'female'].map(g => (
            <button
              key={g}
              onClick={() => onGenderChange(g)}
              style={{
                padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: gender === g ? genderColor : 'transparent',
                color: gender === g ? '#fff' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              {g === 'male' ? '♂ Male' : '♀ Female'}
            </button>
          ))}
        </div>
      </div>

      {/* Goal Toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Goal</label>
        <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {[{id:'gain', label:'Weight Gain'}, {id:'loss', label:'Weight Loss'}].map(g => (
            <button
              key={g.id}
              onClick={() => onGoalChange(g.id)}
              style={{
                padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: goal === g.id ? goalColor : 'transparent',
                color: goal === g.id ? '#fff' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 'auto' }}>
        <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Energy</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{id:'low', emoji:'🔋', label:'Low'}, {id:'medium', emoji:'⚡', label:'Medium'}, {id:'high', emoji:'🚀', label:'High'}].map(e => (
            <button
              key={e.id}
              onClick={() => onEnergyChange(e.id)}
              style={{
                padding: '7px 10px', borderRadius: 10, border: `1px solid ${energy === e.id ? '#4f46e5' : '#e2e8f0'}`,
                background: energy === e.id ? '#f0f0ff' : '#fafafa',
                cursor: 'pointer', fontSize: 11, fontWeight: 700,
                color: energy === e.id ? '#4f46e5' : '#64748b',
                transition: 'all 0.15s ease',
              }}
            >
              {e.emoji} {e.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RestTimerWidget({ color }) {
  const [isOpen, setIsOpen] = useState(false);
  const [restDuration, setRestDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      try {
        soundEffects.playSuccess();
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSelectTime = (sec) => {
    setRestDuration(sec);
    setTimeLeft(sec);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(restDuration);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;
  const pct = Math.round(((restDuration - timeLeft) / restDuration) * 100);

  return (
    <div style={{
      background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0',
      padding: '12px 16px', margin: '14px 20px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setIsOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Timer size={15} color={color} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#000' }}>Between-Set Rest Timer</span>
            <span style={{ fontSize: 11, color: isRunning ? color : '#64748b', marginLeft: 8, fontWeight: 700 }}>
              {isRunning ? `⏱️ ${timeStr} active` : `⏱️ ${timeStr}`}
            </span>
          </div>
        </button>
        <button
          onClick={() => {
            if (!isOpen) setIsOpen(true);
            setIsRunning(r => !r);
          }}
          style={{
            padding: '5px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: isRunning ? '#ef4444' : color, color: '#fff',
            fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          {isRunning ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Start</>}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[30, 45, 60, 90, 120].map(s => (
                <button
                  key={s}
                  onClick={() => handleSelectTime(s)}
                  style={{
                    padding: '4px 10px', borderRadius: 8, border: `1px solid ${restDuration === s ? color : '#e2e8f0'}`,
                    background: restDuration === s ? `${color}15` : '#fff',
                    color: restDuration === s ? color : '#64748b',
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {s}s
                </button>
              ))}
            </div>
            <button
              onClick={handleReset}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b', fontWeight: 700 }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: `linear-gradient(90deg, ${color}, ${color}99)`,
              width: `${pct}%`, transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutColumn({ workout, profileColor, checkedSets, onToggleSet, onCompleteAll }) {
  const totalSets = workout.exercises.reduce((s, e) => s + e.sets, 0);
  const completedSets = Object.values(checkedSets).filter(Boolean).length;
  const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div style={{
      background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${profileColor}15, ${profileColor}25)`,
        padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${profileColor}, ${profileColor}bb)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Dumbbell size={20} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: profileColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today's Workout</p>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#000', letterSpacing: '-0.02em' }}>
              {workout.emoji} {workout.title}
            </h3>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} /> {workout.duration} min
          </span>
          {workout.muscles.map(m => (
            <span key={m} style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
              background: `${profileColor}15`, color: profileColor,
            }}>{m}</span>
          ))}
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Completion</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: pct >= 100 ? '#059669' : profileColor }}>{pct}%</span>
          </div>
          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: pct >= 100 ? '#059669' : `linear-gradient(90deg, ${profileColor}, ${profileColor}88)`,
              width: `${pct}%`, transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{completedSets} / {totalSets} sets completed</p>
        </div>
      </div>

      {/* Built-in Rest Timer */}
      <RestTimerWidget color={profileColor} />

      {/* Exercise Checklist */}
      <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
        {workout.exercises.map((ex, exIdx) => (
          <div key={exIdx} style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#000', marginBottom: 8 }}>{ex.name}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: ex.sets }).map((_, setIdx) => {
                const key = `${exIdx}-${setIdx}`;
                const done = checkedSets[key];
                return (
                  <button
                    key={key}
                    onClick={() => onToggleSet(key)}
                    style={{
                      width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: done ? profileColor : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease',
                      transform: done ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {done
                      ? <Check size={16} color="#fff" strokeWidth={3} />
                      : <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8' }}>{setIdx + 1}</span>}
                  </button>
                );
              })}
              <span style={{ fontSize: 11, color: '#94a3b8', alignSelf: 'center', marginLeft: 4 }}>× {ex.reps}</span>
            </div>
          </div>
        ))}
      </div>

      {pct >= 100 && (
        <div style={{
          margin: '0 20px 20px', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
          borderRadius: 16, padding: '14px 16px', border: '1px solid #86efac',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <CheckCircle2 size={22} color="#059669" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>Workout Complete! 🎉</p>
            <p style={{ fontSize: 11, color: '#16a34a' }}>Your fitness habit has been marked done</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MealCard({ meal, logged, onLog }) {
  const Icon = meal.icon;
  return (
    <div style={{
      background: logged ? '#f0fdf4' : '#fff', borderRadius: 18,
      border: `1px solid ${logged ? '#86efac' : '#f1f5f9'}`,
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'all 0.2s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: `${meal.color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={18} color={meal.color} />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: meal.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {meal.slot} · {meal.time}
            </p>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#000', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{meal.emoji} {meal.name}</p>
          </div>
        </div>
        <button
          onClick={() => !logged && onLog(meal)}
          disabled={logged}
          style={{
            width: 32, height: 32, borderRadius: 10, border: 'none', cursor: logged ? 'default' : 'pointer',
            background: logged ? '#dcfce7' : `${meal.color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {logged ? <Check size={16} color="#059669" strokeWidth={3} /> : <Plus size={16} color={meal.color} />}
        </button>
      </div>
      <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{meal.desc}</p>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: `${meal.calories} kcal`, color: '#ea580c' },
          { label: `${meal.protein}g protein`, color: '#8b5cf6' },
          { label: `${meal.carbs}g carbs`, color: '#d97706' },
          { label: `${meal.fats}g fats`, color: '#059669' },
        ].map(tag => (
          <span key={tag.label} style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
            background: `${tag.color}12`, color: tag.color,
          }}>{tag.label}</span>
        ))}
      </div>
    </div>
  );
}

function BottomProgressBar({ completedSets, totalSets, loggedMeals, totalMeals, loggedProtein, proteinTarget, loggedCals, calTarget }) {
  const workoutPct = totalSets > 0 ? Math.min(100, Math.round((completedSets / totalSets) * 100)) : 0;
  const nutritionPct = totalMeals > 0 ? Math.round((loggedMeals / totalMeals) * 100) : 0;
  const proteinPct = Math.min(100, Math.round((loggedProtein / proteinTarget) * 100));
  const calPct = Math.min(100, Math.round((loggedCals / calTarget) * 100));
  const overall = Math.round((workoutPct + nutritionPct + proteinPct) / 3);

  const stats = [
    { label: 'Workout Sets', value: `${completedSets}/${totalSets}`, pct: workoutPct, color: '#4f46e5' },
    { label: 'Meals Logged', value: `${loggedMeals}/${totalMeals}`, pct: nutritionPct, color: '#059669' },
    { label: 'Protein', value: `${loggedProtein}g / ${proteinTarget}g`, pct: proteinPct, color: '#8b5cf6' },
    { label: 'Calories', value: `${loggedCals} / ${calTarget} kcal`, pct: calPct, color: '#ea580c' },
  ];

  return (
    <div style={{
      background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.04)', padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart3 size={18} color="#fff" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#000', letterSpacing: '-0.02em' }}>Daily Progress Summary</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            position: 'relative', width: 52, height: 52,
          }}>
            <svg width={52} height={52} viewBox="0 0 52 52">
              <circle cx={26} cy={26} r={22} fill="none" stroke="#f1f5f9" strokeWidth={5} />
              <circle
                cx={26} cy={26} r={22} fill="none"
                stroke={overall >= 80 ? '#059669' : overall >= 50 ? '#d97706' : '#e11d48'}
                strokeWidth={5}
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - overall / 100)}
                strokeLinecap="round"
                transform="rotate(-90 26 26)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#000' }}>{overall}%</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#000' }}>
              {overall >= 80 ? '🌟 Outstanding!' : overall >= 50 ? '💪 Keep Going!' : '🚀 Just Started!'}
            </p>
            <p style={{ fontSize: 11, color: '#64748b' }}>Overall completion</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: '#f8fafc', borderRadius: 16, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{stat.label}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: stat.color }}>{stat.pct}%</span>
            </div>
            <div style={{ height: 5, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: `linear-gradient(90deg, ${stat.color}, ${stat.color}88)`,
                width: `${stat.pct}%`, transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function FitnessPlanner({ data, setData }) {
  const [gender, setGender] = useState('male');
  const [goal, setGoal] = useState('gain');
  const [energy, setEnergy] = useState('medium');
  const [checkedSets, setCheckedSets] = useState({});
  const [loggedMealIds, setLoggedMealIds] = useState(new Set());

  const workoutKey = `${gender}-${goal}`;
  const workout = PLANNER_WORKOUTS[workoutKey] || PLANNER_WORKOUTS['male-muscle'];
  const mealPlan = MEAL_PLANS[goal];
  const profileColor = gender === 'male' ? '#4f46e5' : '#e11d48';

  const totalSets = useMemo(() => workout.exercises.reduce((s, e) => s + e.sets, 0), [workout]);
  const completedSets = Object.values(checkedSets).filter(Boolean).length;

  const loggedMeals = loggedMealIds.size;
  const loggedProtein = mealPlan.meals.filter(m => loggedMealIds.has(m.id)).reduce((s, m) => s + m.protein, 0);
  const loggedCals = mealPlan.meals.filter(m => loggedMealIds.has(m.id)).reduce((s, m) => s + m.calories, 0);

  const handleToggleSet = useCallback((key) => {
    setCheckedSets(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const completedCount = Object.values(next).filter(Boolean).length;
      if (completedCount === totalSets && totalSets > 0 && setData) {
        const todayStr = new Date().toISOString().split('T')[0];
        setData(d => {
          const fitnessHabit = (d.habits || []).find(h => h.category === 'Fitness') || (d.habits || [])[0];
          const habitId = fitnessHabit ? fitnessHabit.id : 'h-fitness';
          const compKey = `${habitId}_${todayStr}`;
          const isAlreadyDone = d.completions && d.completions[compKey]?.status === 'completed';
          if (isAlreadyDone) return d;

          const newBurn = {
            id: `pburn-${Date.now()}`,
            name: `Workout: ${workout.title}`,
            calories: 280,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'Fitness Planner',
            duration: workout.duration || 45
          };

          return {
            ...d,
            completions: {
              ...(d.completions || {}),
              [compKey]: { id: compKey, habitId, date: todayStr, status: 'completed', value: 1, note: 'Completed in Fitness & Food Planner' }
            },
            habits: (d.habits || []).map(h => h.id === habitId ? { ...h, streak: (h.streak || 0) + 1 } : h),
            calories: d.calories ? {
              ...d.calories,
              burned: [newBurn, ...(d.calories.burned || [])]
            } : d.calories,
            user: d.user ? {
              ...d.user,
              totalPoints: (d.user.totalPoints || 0) + 25,
              currentXP: (d.user.currentXP || 0) + 30
            } : d.user
          };
        });

        try {
          soundEffects.playSuccess();
          confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
      return next;
    });
  }, [totalSets, setData, workout]);

  const handleLogMeal = useCallback((meal) => {
    setLoggedMealIds(prev => new Set([...prev, meal.id]));
    // Sync to app calories
    if (setData) {
      setData(prev => ({
        ...prev,
        calories: {
          ...prev.calories,
          intake: [
            ...(prev.calories?.intake || []),
            {
              id: `planner-${meal.id}-${Date.now()}`,
              name: meal.name,
              calories: meal.calories,
              meal: meal.slot,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fats,
            }
          ]
        }
      }));
    }
  }, [setData]);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      {/* Header Bar */}
      <ProfileHeader
        gender={gender}
        goal={goal}
        energy={energy}
        onGenderChange={setGender}
        onGoalChange={g => { setGoal(g); setLoggedMealIds(new Set()); setCheckedSets({}); }}
        onEnergyChange={setEnergy}
      />

      {/* Main Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Left: Workout */}
        <WorkoutColumn
          workout={workout}
          profileColor={profileColor}
          checkedSets={checkedSets}
          onToggleSet={handleToggleSet}
          onCompleteAll={() => {}}
        />

        {/* Right: Nutrition */}
        <div style={{
          background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            background: `linear-gradient(135deg, #05966910, #05966920)`,
            padding: '20px 24px', borderBottom: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg,#059669,#0891b2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Salad size={20} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nutrition Plan</p>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#000', letterSpacing: '-0.02em' }}>
                  {goal === 'gain' ? 'Mass Gain' : 'Weight Loss'} Meals
                </h3>
              </div>
            </div>
            {/* Targets row */}
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: Flame, label: `${loggedCals} / ${mealPlan.dailyCal} kcal`, color: '#ea580c' },
                { icon: Target, label: `${loggedProtein} / ${mealPlan.proteinTarget}g protein`, color: '#8b5cf6' },
                { icon: CheckCircle2, label: `${loggedMeals} / ${mealPlan.meals.length} logged`, color: '#059669' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: item.color }}>
                    <Icon size={13} color={item.color} />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mealPlan.meals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                logged={loggedMealIds.has(meal.id)}
                onLog={handleLogMeal}
              />
            ))}

            {loggedMeals === mealPlan.meals.length && (
              <div className="animate-fade" style={{
                background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 16, padding: '14px 16px',
                border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 24 }}>🎉</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>All Meals Logged!</p>
                  <p style={{ fontSize: 11, color: '#16a34a' }}>Nutrition goals tracked for today</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <BottomProgressBar
        completedSets={completedSets}
        totalSets={totalSets}
        loggedMeals={loggedMeals}
        totalMeals={mealPlan.meals.length}
        loggedProtein={loggedProtein}
        proteinTarget={mealPlan.proteinTarget}
        loggedCals={loggedCals}
        calTarget={mealPlan.dailyCal}
      />
    </div>
  );
}
