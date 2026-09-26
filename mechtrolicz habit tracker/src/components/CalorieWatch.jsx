import React, { useState, useEffect } from 'react';
import {
  Flame,
  Utensils,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Watch,
  Heart,
  Droplet,
  Zap,
  TrendingDown,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function CalorieWatch({ data, setData }) {
  const calories = data.calories || {
    dailyTarget: 2200,
    burnedTarget: 550,
    waterTarget: 2500,
    waterConsumed: 1500,
    intake: [],
    burned: []
  };

  // Workout stopwatch state
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [workoutType, setWorkoutType] = useState('Strength Training');
  const [workoutCalories, setWorkoutCalories] = useState(0);

  // Quick meal entry state
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealCategory, setMealCategory] = useState('Snack');
  const [editingTarget, setEditingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState(calories.dailyTarget);

  // Calorie rates per minute
  const workoutRates = {
    'HIIT Cardio': 12,
    'Running / Jogging': 10,
    'Cycling': 8,
    'Strength Training': 7,
    'Brisk Walking': 4.5
  };

  // Live timer interval
  useEffect(() => {
    let interval = null;
    if (isWorkingOut) {
      interval = setInterval(() => {
        setWorkoutSeconds(sec => {
          const nextSec = sec + 1;
          const rate = workoutRates[workoutType] || 7;
          setWorkoutCalories(Math.round((nextSec / 60) * rate));
          return nextSec;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkingOut, workoutType]);

  // Calculations
  const totalConsumed = calories.intake.reduce((sum, item) => sum + item.calories, 0);
  const totalBurned = calories.burned.reduce((sum, item) => sum + item.calories, 0);
  const netCalories = totalConsumed - totalBurned;
  const remaining = calories.dailyTarget - totalConsumed;

  const intakePercent = Math.min(100, Math.round((totalConsumed / calories.dailyTarget) * 100));
  const burnedPercent = Math.min(100, Math.round((totalBurned / calories.burnedTarget) * 100));
  const waterPercent = Math.min(100, Math.round((calories.waterConsumed / calories.waterTarget) * 100));

  // Format time MM:SS
  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Add custom meal
  const handleAddMeal = (e) => {
    e.preventDefault();
    const cals = Number(mealCalories);
    if (!mealName.trim() || isNaN(cals) || cals <= 0) return;

    const newIntake = {
      id: `c-${Date.now()}`,
      name: mealName.trim(),
      calories: cals,
      meal: mealCategory,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setData(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        intake: [newIntake, ...(prev.calories?.intake || [])]
      }
    }));

    soundEffects.playSuccess();
    setMealName('');
    setMealCalories('');
  };

  // Quick preset add
  const handleQuickAdd = (cals, label) => {
    const newIntake = {
      id: `c-${Date.now()}`,
      name: label,
      calories: cals,
      meal: 'Quick Snack',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setData(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        intake: [newIntake, ...(prev.calories?.intake || [])]
      }
    }));
    soundEffects.playSuccess();
  };

  // Delete intake item
  const handleDeleteIntake = (id) => {
    setData(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        intake: prev.calories.intake.filter(item => item.id !== id)
      }
    }));
    soundEffects.playClick();
  };

  // Finish and log active workout from watch
  const handleFinishWorkout = () => {
    if (workoutCalories > 0) {
      const newBurnedItem = {
        id: `b-${Date.now()}`,
        name: `Live Watch: ${workoutType}`,
        calories: workoutCalories,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Smartwatch',
        duration: Math.max(1, Math.round(workoutSeconds / 60))
      };

      setData(prev => ({
        ...prev,
        calories: {
          ...prev.calories,
          burned: [newBurnedItem, ...(prev.calories?.burned || [])]
        },
        user: {
          ...prev.user,
          totalPoints: prev.user.totalPoints + 15
        }
      }));
      soundEffects.playLevelUp();
    }

    setIsWorkingOut(false);
    setWorkoutSeconds(0);
    setWorkoutCalories(0);
  };

  // Add water (+250ml)
  const handleAddWater = () => {
    setData(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        waterConsumed: Math.min(prev.calories.waterTarget + 1000, prev.calories.waterConsumed + 250)
      }
    }));
    soundEffects.playSuccess();
  };

  // Save new daily calorie target
  const handleSaveTarget = () => {
    const targetVal = Number(newTarget);
    if (!isNaN(targetVal) && targetVal > 500) {
      setData(prev => ({
        ...prev,
        calories: {
          ...prev.calories,
          dailyTarget: targetVal
        }
      }));
      soundEffects.playSuccess();
      setEditingTarget(false);
    }
  };

  return (
    <div className="calorie-watch-page animate-fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#fef3c7', color: '#b45309', padding: '6px 10px', borderRadius: 'var(--radius-md)' }}>
              <Watch size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Calorie Count Watch</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Real-time active burn monitor, smart concentric rings, and meal balance tracker
              </p>
            </div>
          </div>
        </div>

        {/* Target Editor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {editingTarget ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="form-input"
                style={{ width: '110px', padding: '6px 10px', fontSize: '0.85rem' }}
                autoFocus
              />
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={handleSaveTarget}>
                Save
              </button>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={() => setEditingTarget(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => setEditingTarget(true)}
              style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}
            >
              Goal: {calories.dailyTarget} kcal ✏️
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Smartwatch on Left, Workout Stopwatch & Logger on Right */}
      <div className="grid-sidebar-layout">
        
        {/* Left Column: Smartwatch Device Dial & Activity Rings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Smartwatch Frame Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}>
            
            {/* The Smartwatch Device Bezel */}
            <div style={{
              width: '320px',
              borderRadius: '54px',
              background: '#0f172a',
              padding: '16px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25), inset 0 0 0 2px #334155',
              position: 'relative',
              color: '#ffffff'
            }}>
              {/* Watch Crown Button Simulation */}
              <div style={{
                position: 'absolute',
                right: '-10px',
                top: '70px',
                width: '10px',
                height: '40px',
                background: '#475569',
                borderRadius: '0 4px 4px 0',
                boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.4)'
              }} />

              {/* Watch Glass Screen */}
              <div style={{
                background: '#020617',
                borderRadius: '42px',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '410px'
              }}>
                {/* Watch Top Bar */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '0 6px 12px' }}>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f43f5e' }}>
                    <Heart size={12} fill="#f43f5e" style={{ animation: 'pulseGlow 1.2s infinite' }} />
                    <span style={{ fontSize: '0.72rem' }}>74 bpm</span>
                  </div>
                  <span style={{ color: '#10b981' }}>98% 🔋</span>
                </div>

                {/* Concentric Dual Calorie Activity Rings */}
                <div style={{ position: 'relative', width: '210px', height: '210px', margin: '10px 0' }}>
                  <svg width="210" height="210" viewBox="0 0 210 210">
                    {/* Outer Ring Background (Intake) */}
                    <circle
                      cx="105"
                      cy="105"
                      r="84"
                      stroke="rgba(244, 63, 94, 0.2)"
                      strokeWidth="14"
                      fill="transparent"
                    />
                    {/* Outer Ring Progress (Consumed) */}
                    <circle
                      cx="105"
                      cy="105"
                      r="84"
                      stroke="#f43f5e"
                      strokeWidth="14"
                      strokeDasharray={2 * Math.PI * 84}
                      strokeDashoffset={2 * Math.PI * 84 * (1 - Math.min(1, totalConsumed / calories.dailyTarget))}
                      strokeLinecap="round"
                      fill="transparent"
                      transform="rotate(-90 105 105)"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />

                    {/* Inner Ring Background (Burned) */}
                    <circle
                      cx="105"
                      cy="105"
                      r="64"
                      stroke="rgba(16, 185, 129, 0.2)"
                      strokeWidth="14"
                      fill="transparent"
                    />
                    {/* Inner Ring Progress (Burned) */}
                    <circle
                      cx="105"
                      cy="105"
                      r="64"
                      stroke="#10b981"
                      strokeWidth="14"
                      strokeDasharray={2 * Math.PI * 64}
                      strokeDashoffset={2 * Math.PI * 64 * (1 - Math.min(1, totalBurned / calories.burnedTarget))}
                      strokeLinecap="round"
                      fill="transparent"
                      transform="rotate(-90 105 105)"
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                  </svg>

                  {/* Inside Rings Display */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      NET CALORIES
                    </span>
                    <span style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff', lineHeight: 1.1 }}>
                      {netCalories}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: remaining >= 0 ? '#10b981' : '#f43f5e', fontWeight: 700, marginTop: '2px' }}>
                      {remaining >= 0 ? `${remaining} kcal left` : `${Math.abs(remaining)} kcal over`}
                    </span>
                  </div>
                </div>

                {/* Watch Bottom Readout Metrics */}
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#fda4af', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      <Utensils size={12} /> INTAKE
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                      {totalConsumed} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>kcal</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6ee7b7', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      <Flame size={12} /> BURNED
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                      {totalBurned} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>kcal</span>
                    </div>
                  </div>
                </div>

                {/* Watch Interactive Ring Legend */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '0.7rem' }}>
                  <span style={{ color: '#f43f5e', fontWeight: 700 }}>● Consumed ({intakePercent}%)</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>● Active Burn ({burnedPercent}%)</span>
                </div>
              </div>
            </div>

            <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
              Smartwatch Sync: Active & Live Connected ⌚
            </p>
          </div>

          {/* Hydration Tracker Card */}
          <div className="card" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px', borderRadius: 'var(--radius-md)' }}>
                  <Droplet size={18} fill="#0284c7" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#000000' }}>Daily Hydration</h4>
                  <span style={{ fontSize: '0.78rem', color: '#0369a1', fontWeight: 600 }}>
                    {calories.waterConsumed} / {calories.waterTarget} ml ({waterPercent}%)
                  </span>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem', background: '#0284c7' }}
                onClick={handleAddWater}
              >
                +250 ml
              </button>
            </div>

            <div className="goal-progress-bar-bg" style={{ height: '8px', background: '#e0f2fe' }}>
              <div className="goal-progress-bar-fill" style={{ width: `${waterPercent}%`, background: '#0284c7' }} />
            </div>
          </div>

        </div>

        {/* Right Column: Live Workout Stopwatch & Calorie Meal Logger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Live Workout Watch Stopwatch */}
          <div className="card" style={{ border: '2px solid #fed7aa', background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)' }}>
            <div className="card-header" style={{ marginBottom: '14px' }}>
              <div className="card-title-group">
                <div className="card-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
                  <Flame size={20} fill="#ea580c" />
                </div>
                <div>
                  <h3 className="card-title" style={{ color: '#000000' }}>Active Workout Calorie Watch</h3>
                  <p className="card-subtitle" style={{ color: '#475569' }}>Real-time burn calculation with live stopwatch</p>
                </div>
              </div>
              {isWorkingOut && (
                <span className="badge-tag" style={{ background: '#ea580c', color: '#ffffff', fontWeight: 800 }}>
                  LIVE RECORDING 🔴
                </span>
              )}
            </div>

            {/* Workout Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {Object.keys(workoutRates).map((type) => (
                <button
                  key={type}
                  onClick={() => !isWorkingOut && setWorkoutType(type)}
                  style={{
                    background: workoutType === type ? '#ea580c' : '#ffffff',
                    color: workoutType === type ? '#ffffff' : '#000000',
                    border: '1px solid ' + (workoutType === type ? '#ea580c' : '#cbd5e1'),
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: isWorkingOut ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isWorkingOut}
                >
                  {type} (~{workoutRates[type]} kcal/m)
                </button>
              ))}
            </div>

            {/* Stopwatch Display */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #fed7aa',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginBottom: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  ELAPSED TIME
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'monospace', color: '#000000' }}>
                  {formatTimer(workoutSeconds)}
                </div>
              </div>

              <div style={{ width: '2px', height: '50px', background: '#fed7aa' }} />

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>
                  ESTIMATED BURN
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#ea580c' }}>
                  +{workoutCalories} <span style={{ fontSize: '1rem', color: '#000000' }}>kcal</span>
                </div>
              </div>
            </div>

            {/* Stopwatch Controls */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isWorkingOut ? (
                <button
                  className="btn-primary"
                  style={{ flex: 1, background: '#ea580c' }}
                  onClick={() => {
                    setIsWorkingOut(true);
                    soundEffects.playClick();
                  }}
                >
                  <Play size={18} fill="#ffffff" />
                  <span>{workoutSeconds > 0 ? 'Resume Workout' : 'Start Workout Watch'}</span>
                </button>
              ) : (
                <button
                  className="btn-secondary"
                  style={{ flex: 1, background: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' }}
                  onClick={() => {
                    setIsWorkingOut(false);
                    soundEffects.playClick();
                  }}
                >
                  <Pause size={18} />
                  <span>Pause Watch</span>
                </button>
              )}

              {workoutSeconds > 0 && (
                <button
                  className="btn-primary"
                  style={{ background: '#10b981' }}
                  onClick={handleFinishWorkout}
                >
                  <CheckCircle2 size={18} />
                  <span>Save to Watch</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Calorie Presets */}
          <div className="card">
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>Quick Calorie Presets</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <button
                className="btn-secondary"
                style={{ padding: '10px', fontSize: '0.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px' }}
                onClick={() => handleQuickAdd(150, 'Fruit / Healthy Snack')}
              >
                <span style={{ fontWeight: 800, color: '#4f46e5' }}>+150 kcal</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Fruit / Snack</span>
              </button>

              <button
                className="btn-secondary"
                style={{ padding: '10px', fontSize: '0.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px' }}
                onClick={() => handleQuickAdd(280, 'Protein Shake / Bar')}
              >
                <span style={{ fontWeight: 800, color: '#4f46e5' }}>+280 kcal</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Protein Shake</span>
              </button>

              <button
                className="btn-secondary"
                style={{ padding: '10px', fontSize: '0.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px' }}
                onClick={() => handleQuickAdd(500, 'Balanced Lunch / Meal')}
              >
                <span style={{ fontWeight: 800, color: '#4f46e5' }}>+500 kcal</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Regular Meal</span>
              </button>

              <button
                className="btn-secondary"
                style={{ padding: '10px', fontSize: '0.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px' }}
                onClick={() => handleQuickAdd(750, 'Hearty Dinner / Feast')}
              >
                <span style={{ fontWeight: 800, color: '#4f46e5' }}>+750 kcal</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Hearty Dinner</span>
              </button>
            </div>
          </div>

          {/* Add Custom Meal Intake Form */}
          <div className="card">
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px' }}>Log Custom Meal</h4>
            <form onSubmit={handleAddMeal}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Food / Meal Name (e.g. Avocado Toast)"
                  className="form-input"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Calories (kcal)"
                  className="form-input"
                  value={mealCalories}
                  onChange={(e) => setMealCalories(e.target.value)}
                  required
                />
                <select
                  className="form-select"
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value)}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Plus size={16} />
                <span>Log to Watch Today</span>
              </button>
            </form>
          </div>

          {/* Today's Logged Entries */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: '12px' }}>
              <div className="card-title-group">
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Today's Watch Logs</h4>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                {calories.intake.length} meals • {calories.burned.length} workouts
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Burned Items */}
              {calories.burned.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Flame size={18} color="#10b981" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#000000' }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#15803d' }}>
                        {item.time} • {item.duration ? `${item.duration} mins • ` : ''}Active Burn
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#15803d' }}>
                    -{item.calories} kcal
                  </span>
                </div>
              ))}

              {/* Intake Items */}
              {calories.intake.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Utensils size={18} color="#f43f5e" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#000000' }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {item.time} • {item.meal}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#000000' }}>
                      +{item.calories} kcal
                    </span>
                    <button
                      className="icon-action-btn"
                      style={{ width: '28px', height: '28px', color: '#dc2626' }}
                      onClick={() => handleDeleteIntake(item.id)}
                      title="Delete meal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
