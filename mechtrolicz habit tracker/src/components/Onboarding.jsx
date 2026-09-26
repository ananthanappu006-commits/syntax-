import React, { useState } from 'react';
import { Sparkles, Target, Clock, ChevronRight, CheckCircle2, Flame } from 'lucide-react';

const STARTER_HABITS = [
  { id: 'sg-1', name: 'Morning Hydration', category: 'Health', frequency: 'Daily', target: 500, unit: 'ml', reminderTime: '07:00', priority: 'High', color: '#06b6d4', emoji: '💧' },
  { id: 'sg-2', name: 'Daily Exercise', category: 'Fitness', frequency: 'Daily', target: 30, unit: 'mins', reminderTime: '17:30', priority: 'High', color: '#10b981', emoji: '🏃' },
  { id: 'sg-3', name: 'Deep Work / Study', category: 'Work', frequency: 'Weekdays', target: 60, unit: 'mins', reminderTime: '09:00', priority: 'High', color: '#6366f1', emoji: '🧠' },
  { id: 'sg-4', name: 'Reading', category: 'Personal Development', frequency: 'Daily', target: 20, unit: 'mins', reminderTime: '21:00', priority: 'Medium', color: '#f59e0b', emoji: '📚' },
  { id: 'sg-5', name: 'Meditation / Mindfulness', category: 'Health', frequency: 'Daily', target: 10, unit: 'mins', reminderTime: '07:30', priority: 'Medium', color: '#a78bfa', emoji: '🧘' },
  { id: 'sg-6', name: 'Healthy Eating', category: 'Health', frequency: 'Daily', target: 3, unit: 'meals', reminderTime: '12:00', priority: 'Medium', color: '#f97316', emoji: '🥗' },
];

const GOAL_CATEGORIES = ['Health & Wellness', 'Fitness', 'Career & Work', 'Learning', 'Personal Growth'];

const STEPS = ['welcome', 'name', 'goals', 'habits', 'done'];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedHabits, setSelectedHabits] = useState(['sg-1', 'sg-2']);

  const toggleGoal = (g) => setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  const toggleHabit = (id) => setSelectedHabits(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canNext = () => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return selectedGoals.length > 0;
    if (step === 3) return selectedHabits.length > 0;
    return true;
  };

  const handleFinish = () => {
    const pickedHabits = STARTER_HABITS
      .filter(h => selectedHabits.includes(h.id))
      .map(h => ({
        ...h,
        id: `h-${Date.now()}-${h.id}`,
        streak: 0,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        days: h.frequency === 'Daily' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : ['Mon','Tue','Wed','Thu','Fri'],
        description: '',
      }));
    onComplete({ name: name.trim(), habits: pickedHabits, goalCategories: selectedGoals });
  };

  const stepContent = [
    // Step 0 — Welcome
    <div key="welcome" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎯</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Welcome to Your Habit Coach</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 32px' }}>
        Let's set up your personal routine planner in 3 quick steps. It takes less than 60 seconds!
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
        {[['🔥','Track Streaks'],['📊','View Analytics'],['🏆','Earn Rewards'],['🤖','AI Coach']].map(([e, l]) => (
          <div key={l} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '10px 16px', fontSize: '0.82rem', fontWeight: 600 }}>
            {e} {l}
          </div>
        ))}
      </div>
    </div>,

    // Step 1 — Name
    <div key="name" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>👋</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>What's your name?</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>We'll personalize your dashboard with it</p>
      <input
        autoFocus
        type="text"
        placeholder="Enter your first name..."
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && canNext() && setStep(2)}
        style={{
          width: '100%', maxWidth: 340, padding: '14px 20px',
          border: '2px solid var(--border-subtle)', borderRadius: 14,
          fontSize: '1rem', fontFamily: 'var(--font-sans)', outline: 'none',
          textAlign: 'center', transition: 'border-color 0.2s',
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
      />
    </div>,

    // Step 2 — Goals
    <div key="goals">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎯</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', fontWeight: 800, marginBottom: 6 }}>
          Hey {name || 'there'}! What are your goals?
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Pick all that apply — we'll tailor your suggestions</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {GOAL_CATEGORIES.map(g => {
          const sel = selectedGoals.includes(g);
          return (
            <button key={g} onClick={() => toggleGoal(g)} style={{
              padding: '12px 20px', borderRadius: 12,
              background: sel ? 'var(--primary)' : 'var(--bg-surface-elevated)',
              border: `2px solid ${sel ? 'var(--primary)' : 'var(--border-subtle)'}`,
              color: sel ? '#fff' : 'var(--text-primary)',
              fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
              transform: sel ? 'scale(1.04)' : 'scale(1)',
            }}>
              {sel && <CheckCircle2 size={15} />}
              {g}
            </button>
          );
        })}
      </div>
    </div>,

    // Step 3 — Habits
    <div key="habits">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚡</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', fontWeight: 800, marginBottom: 6 }}>Pick your starter habits</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Choose at least 1 — you can add more later</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {STARTER_HABITS.map(h => {
          const sel = selectedHabits.includes(h.id);
          return (
            <button key={h.id} onClick={() => toggleHabit(h.id)} style={{
              padding: '14px 16px', borderRadius: 14, textAlign: 'left',
              background: sel ? `${h.color}15` : 'var(--bg-surface-elevated)',
              border: `2px solid ${sel ? h.color : 'var(--border-subtle)'}`,
              cursor: 'pointer', transition: 'all 0.15s',
              transform: sel ? 'scale(1.03)' : 'scale(1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: '1.4rem' }}>{h.emoji}</span>
                {sel && <CheckCircle2 size={14} style={{ color: h.color, marginLeft: 'auto' }} />}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 3 }}>{h.name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                {h.reminderTime} · {h.target} {h.unit}
              </div>
            </button>
          );
        })}
      </div>
    </div>,

    // Step 4 — Done
    <div key="done" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🚀</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
        You're all set, {name}!
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 360, margin: '0 auto 24px' }}>
        Your planner is ready. You've got <strong>{selectedHabits.length} habit{selectedHabits.length !== 1 ? 's' : ''}</strong> to start with.
        Complete them daily to build your streak!
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
        {STARTER_HABITS.filter(h => selectedHabits.includes(h.id)).map(h => (
          <div key={h.id} style={{ background: `${h.color}15`, border: `1px solid ${h.color}40`, borderRadius: 10, padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700, color: h.color }}>
            {h.emoji} {h.name}
          </div>
        ))}
      </div>
    </div>
  ];

  const isLastStep = step === STEPS.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: 'var(--bg-surface)', borderRadius: 28, padding: '40px 36px',
        width: '100%', maxWidth: 560, boxShadow: '0 32px 80px -16px rgba(0,0,0,0.4)',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                height: 4, flex: 1, borderRadius: 4,
                background: i <= step ? 'var(--primary)' : 'var(--border-subtle)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        {/* Step content */}
        <div style={{ minHeight: 280 }}>
          {stepContent[step]}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && !isLastStep && (
            <button onClick={() => setStep(s => s - 1)} style={{
              padding: '12px 24px', borderRadius: 12, background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)',
            }}>Back</button>
          )}
          <button
            onClick={isLastStep ? handleFinish : () => setStep(s => s + 1)}
            disabled={!canNext()}
            style={{
              flex: 1, padding: '14px 24px', borderRadius: 12,
              background: canNext() ? 'var(--primary)' : 'var(--border-subtle)',
              color: canNext() ? '#fff' : 'var(--text-muted)',
              fontWeight: 800, fontSize: '1rem', border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
          >
            {isLastStep ? (
              <><Flame size={18} /> Start My Journey</>
            ) : step === 0 ? (
              <><Sparkles size={18} /> Let's Go</>
            ) : (
              <>Continue <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
