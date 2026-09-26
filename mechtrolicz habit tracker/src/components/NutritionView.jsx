import React, { useState } from 'react';
import {
  Salad, Flame, Droplets, Apple, Clock, ChevronDown, ChevronUp,
  User, Users, Dumbbell, Coffee, Sun, Sunset, Moon, Info, Star
} from 'lucide-react';

/* ─── Nutrition Data ─── */
const mealPlans = {
  female: {
    label: 'Women',
    emoji: '♀️',
    calories: { sedentary: 1800, active: 2100, athlete: 2400 },
    macros: { protein: '25%', carbs: '45%', fat: '30%' },
    meals: [
      {
        time: '6:30 AM',
        label: 'Pre-Workout Breakfast',
        icon: Coffee,
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)',
        items: [
          { name: 'Overnight Oats with Berries', calories: 320, protein: '12g', carbs: '52g', note: 'Slow-release energy for your workout' },
          { name: 'Half Banana', calories: 50, protein: '0.6g', carbs: '13g', note: 'Quick potassium boost' },
          { name: 'Black Coffee / Green Tea', calories: 5, protein: '0g', carbs: '0g', note: 'Metabolism booster' },
        ]
      },
      {
        time: '9:30 AM',
        label: 'Post-Workout Snack',
        icon: Dumbbell,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
        items: [
          { name: 'Greek Yogurt (plain, low-fat)', calories: 100, protein: '17g', carbs: '6g', note: 'Muscle repair & gut health' },
          { name: 'Handful of Mixed Nuts', calories: 160, protein: '5g', carbs: '6g', note: 'Healthy fats & sustained energy' },
        ]
      },
      {
        time: '1:00 PM',
        label: 'Lunch',
        icon: Sun,
        color: '#059669',
        gradient: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
        items: [
          { name: 'Grilled Chicken Breast (150g)', calories: 250, protein: '47g', carbs: '0g', note: 'Lean protein powerhouse' },
          { name: 'Quinoa (½ cup cooked)', calories: 110, protein: '4g', carbs: '20g', note: 'Complete plant protein + fiber' },
          { name: 'Steamed Broccoli & Spinach', calories: 55, protein: '4g', carbs: '8g', note: 'Iron, calcium, vitamins' },
          { name: 'Olive Oil Dressing (1 tbsp)', calories: 120, protein: '0g', carbs: '0g', note: 'Anti-inflammatory omega fats' },
        ]
      },
      {
        time: '4:00 PM',
        label: 'Afternoon Snack',
        icon: Apple,
        color: '#e11d48',
        gradient: 'linear-gradient(135deg,#ffe4e6,#fecdd3)',
        items: [
          { name: 'Apple with Almond Butter', calories: 200, protein: '4g', carbs: '28g', note: 'Blood sugar balance + crunch' },
          { name: 'Protein Shake (if active day)', calories: 130, protein: '25g', carbs: '5g', note: 'Optional muscle support' },
        ]
      },
      {
        time: '7:30 PM',
        label: 'Dinner',
        icon: Sunset,
        color: '#0891b2',
        gradient: 'linear-gradient(135deg,#cffafe,#a5f3fc)',
        items: [
          { name: 'Baked Salmon (150g)', calories: 280, protein: '39g', carbs: '0g', note: 'Omega-3 for recovery & hormones' },
          { name: 'Sweet Potato (medium)', calories: 103, protein: '2.3g', carbs: '24g', note: 'Complex carbs & Vitamin A' },
          { name: 'Mixed Salad with Lemon', calories: 40, protein: '2g', carbs: '7g', note: 'Antioxidants & fiber' },
        ]
      },
      {
        time: '9:30 PM',
        label: 'Evening Snack (optional)',
        icon: Moon,
        color: '#7c3aed',
        gradient: 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
        items: [
          { name: 'Cottage Cheese (½ cup)', calories: 90, protein: '13g', carbs: '3g', note: 'Casein protein for overnight recovery' },
          { name: 'Chamomile Tea', calories: 2, protein: '0g', carbs: '0g', note: 'Better sleep = better gains' },
        ]
      },
    ],
    tips: [
      { icon: '🩷', text: 'Iron is crucial — include leafy greens, lentils, and lean red meat 2–3x/week' },
      { icon: '🦴', text: 'Calcium matters — aim for 1000mg/day via dairy, tofu, or fortified plant milk' },
      { icon: '⚡', text: 'Eat within 30 min after workout to maximize muscle repair' },
      { icon: '🔄', text: 'Cycle carbs higher on training days, lower on rest days' },
      { icon: '😴', text: 'Protein before bed (casein) reduces muscle breakdown during sleep' },
    ]
  },
  male: {
    label: 'Men',
    emoji: '♂️',
    calories: { sedentary: 2200, active: 2700, athlete: 3200 },
    macros: { protein: '30%', carbs: '45%', fat: '25%' },
    meals: [
      {
        time: '6:30 AM',
        label: 'Pre-Workout Breakfast',
        icon: Coffee,
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)',
        items: [
          { name: 'Scrambled Eggs (3 whole)', calories: 210, protein: '18g', carbs: '1g', note: 'Complete amino acid profile' },
          { name: 'Whole Wheat Toast (2 slices)', calories: 160, protein: '8g', carbs: '30g', note: 'Complex carbs for sustained energy' },
          { name: 'Avocado (half)', calories: 120, protein: '1.5g', carbs: '6g', note: 'Healthy fats & potassium' },
          { name: 'Black Coffee', calories: 5, protein: '0g', carbs: '0g', note: 'Pre-workout performance boost' },
        ]
      },
      {
        time: '9:30 AM',
        label: 'Post-Workout Snack',
        icon: Dumbbell,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
        items: [
          { name: 'Protein Shake (whey, 1 scoop)', calories: 130, protein: '25g', carbs: '5g', note: 'Fast-absorbing post-workout protein' },
          { name: 'Banana', calories: 90, protein: '1g', carbs: '23g', note: 'Replenish glycogen fast' },
          { name: 'Rice Cake (2)', calories: 70, protein: '1.5g', carbs: '15g', note: 'Light carb refuel' },
        ]
      },
      {
        time: '1:00 PM',
        label: 'Lunch',
        icon: Sun,
        color: '#059669',
        gradient: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
        items: [
          { name: 'Grilled Chicken Breast (200g)', calories: 330, protein: '62g', carbs: '0g', note: 'King of lean protein sources' },
          { name: 'Brown Rice (1 cup cooked)', calories: 215, protein: '5g', carbs: '45g', note: 'Steady energy, high fiber' },
          { name: 'Mixed Vegetables (stir-fried)', calories: 80, protein: '3g', carbs: '14g', note: 'Vitamins & minerals' },
          { name: 'Olive Oil (1 tbsp)', calories: 120, protein: '0g', carbs: '0g', note: 'Heart-healthy fat' },
        ]
      },
      {
        time: '4:00 PM',
        label: 'Afternoon Snack',
        icon: Apple,
        color: '#e11d48',
        gradient: 'linear-gradient(135deg,#ffe4e6,#fecdd3)',
        items: [
          { name: 'Peanut Butter (2 tbsp) + Apple', calories: 280, protein: '8g', carbs: '35g', note: 'Perfect protein-carb combo' },
          { name: 'Hard-Boiled Eggs (2)', calories: 140, protein: '12g', carbs: '1g', note: 'Portable protein hit' },
        ]
      },
      {
        time: '7:30 PM',
        label: 'Dinner',
        icon: Sunset,
        color: '#0891b2',
        gradient: 'linear-gradient(135deg,#cffafe,#a5f3fc)',
        items: [
          { name: 'Lean Beef / Turkey (200g)', calories: 340, protein: '52g', carbs: '0g', note: 'Creatine + zinc for testosterone' },
          { name: 'Sweet Potato or Pasta (1 cup)', calories: 220, protein: '5g', carbs: '45g', note: 'Carb-load for next day training' },
          { name: 'Large Mixed Salad', calories: 60, protein: '3g', carbs: '10g', note: 'Fiber + micronutrients' },
          { name: 'Greek Yogurt Dressing', calories: 40, protein: '3g', carbs: '3g', note: 'Probiotic gut support' },
        ]
      },
      {
        time: '9:30 PM',
        label: 'Evening Snack (optional)',
        icon: Moon,
        color: '#7c3aed',
        gradient: 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
        items: [
          { name: 'Cottage Cheese (1 cup)', calories: 180, protein: '25g', carbs: '6g', note: 'Slow casein feeds muscles overnight' },
          { name: 'Mixed Berries', calories: 50, protein: '0.5g', carbs: '12g', note: 'Antioxidants for recovery' },
        ]
      },
    ],
    tips: [
      { icon: '💪', text: 'Aim for 0.7–1g protein per lb of bodyweight on training days' },
      { icon: '🥩', text: 'Red meat 2–3x/week for iron, zinc, and creatine to support testosterone' },
      { icon: '⏰', text: 'Eat carbs strategically — pre and post workout for maximum performance' },
      { icon: '💧', text: 'Hydrate with 3–4L of water daily; add electrolytes on intense training days' },
      { icon: '🍳', text: 'Never skip breakfast — it sets your metabolism and hormone rhythm for the day' },
    ]
  }
};

const workoutIntensityCalories = {
  sedentary: { label: 'Light Activity (1–2 days/week)', desc: 'Walking, yoga, light movement' },
  active: { label: 'Moderate (3–5 days/week)', desc: 'Gym, running, cycling, sports' },
  athlete: { label: 'Intense (6–7 days/week)', desc: 'Heavy lifting, HIIT, competitive training' },
};

/* ─── Sub-components ─── */
function MacroPill({ label, pct, color }) {
  return (
    <div className="nv-macro-pill" style={{ '--macro-color': color }}>
      <div className="nv-macro-bar">
        <div className="nv-macro-fill" style={{ width: pct, background: color }} />
      </div>
      <span className="nv-macro-label">{label}</span>
      <span className="nv-macro-pct" style={{ color }}>{pct}</span>
    </div>
  );
}

function MealCard({ meal }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = meal.icon;
  const totalCal = meal.items.reduce((s, i) => s + i.calories, 0);

  return (
    <div className="nv-meal-card">
      <button className="nv-meal-header" onClick={() => setExpanded(e => !e)}>
        <div className="nv-meal-icon-wrap" style={{ background: meal.gradient }}>
          <Icon size={18} color={meal.color} />
        </div>
        <div className="nv-meal-title-group">
          <span className="nv-meal-time">{meal.time}</span>
          <span className="nv-meal-label">{meal.label}</span>
        </div>
        <div className="nv-meal-right">
          <span className="nv-meal-cal-badge">
            <Flame size={12} />
            {totalCal} kcal
          </span>
          {expanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
        </div>
      </button>

      {expanded && (
        <div className="nv-meal-items">
          {meal.items.map((item, i) => (
            <div className="nv-food-row" key={i}>
              <div className="nv-food-info">
                <span className="nv-food-name">{item.name}</span>
                <span className="nv-food-note">{item.note}</span>
              </div>
              <div className="nv-food-macros">
                <span className="nv-macro-tag nv-tag-cal">{item.calories} kcal</span>
                <span className="nv-macro-tag nv-tag-prot">P: {item.protein}</span>
                <span className="nv-macro-tag nv-tag-carb">C: {item.carbs}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function NutritionView() {
  const [gender, setGender] = useState('female');
  const [intensity, setIntensity] = useState('active');

  const plan = mealPlans[gender];
  const targetCalories = plan.calories[intensity];
  const intensityInfo = workoutIntensityCalories[intensity];

  const totalMealCals = plan.meals.reduce(
    (sum, meal) => sum + meal.items.reduce((s, i) => s + i.calories, 0), 0
  );

  return (
    <div className="nv-container">
      {/* Hero Header */}
      <div className="nv-hero">
        <div className="nv-hero-icon">
          <Salad size={28} color="#fff" />
        </div>
        <div>
          <h2 className="nv-hero-title">Fitness Nutrition Guide</h2>
          <p className="nv-hero-sub">Daily meal plans tailored for your body & workout routine</p>
        </div>
      </div>

      {/* Gender Toggle */}
      <div className="nv-toggle-row">
        <div className="nv-segment">
          <button
            id="nv-btn-female"
            className={`nv-seg-btn ${gender === 'female' ? 'nv-seg-active' : ''}`}
            onClick={() => setGender('female')}
          >
            <User size={15} /> Women ♀️
          </button>
          <button
            id="nv-btn-male"
            className={`nv-seg-btn ${gender === 'male' ? 'nv-seg-active' : ''}`}
            onClick={() => setGender('male')}
          >
            <Users size={15} /> Men ♂️
          </button>
        </div>

        {/* Intensity Selector */}
        <div className="nv-intensity-wrap">
          {Object.entries(workoutIntensityCalories).map(([key, val]) => (
            <button
              key={key}
              id={`nv-intensity-${key}`}
              className={`nv-intensity-btn ${intensity === key ? 'nv-intensity-active' : ''}`}
              onClick={() => setIntensity(key)}
              title={val.desc}
            >
              {val.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Calorie + Intensity Info */}
      <div className="nv-stats-row">
        <div className="nv-stat-card nv-stat-fire">
          <Flame size={22} color="#ea580c" />
          <div>
            <p className="nv-stat-num">{targetCalories}</p>
            <p className="nv-stat-lbl">Daily Target (kcal)</p>
          </div>
        </div>
        <div className="nv-stat-card nv-stat-water">
          <Droplets size={22} color="#0891b2" />
          <div>
            <p className="nv-stat-num">{gender === 'female' ? '2.5L' : '3.5L'}</p>
            <p className="nv-stat-lbl">Water / Day</p>
          </div>
        </div>
        <div className="nv-stat-card nv-stat-clock">
          <Clock size={22} color="#7c3aed" />
          <div>
            <p className="nv-stat-num">{plan.meals.length}</p>
            <p className="nv-stat-lbl">Meals / Day</p>
          </div>
        </div>
        <div className="nv-stat-card nv-stat-info">
          <Info size={22} color="#059669" />
          <div>
            <p className="nv-stat-num nv-stat-intensity">{intensityInfo.label.split('(')[0].trim()}</p>
            <p className="nv-stat-lbl">{intensityInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* Macro Split */}
      <div className="nv-macros-card">
        <h3 className="nv-section-title">Recommended Macro Split</h3>
        <div className="nv-macros-row">
          <MacroPill label="Protein" pct={plan.macros.protein} color="#8b5cf6" />
          <MacroPill label="Carbs" pct={plan.macros.carbs} color="#f59e0b" />
          <MacroPill label="Healthy Fats" pct={plan.macros.fat} color="#059669" />
        </div>
        <p className="nv-macros-note">
          <Star size={12} /> Plan covers approx <strong>{totalMealCals} kcal</strong> — adjust portions to reach your {targetCalories} kcal target.
        </p>
      </div>

      {/* Daily Meal Plan */}
      <div className="nv-meals-section">
        <h3 className="nv-section-title">Daily Meal Plan — {plan.label}</h3>
        <p className="nv-meals-hint">Tap each meal to expand food details & macros</p>
        <div className="nv-meals-list">
          {plan.meals.map((meal, i) => (
            <MealCard key={i} meal={meal} />
          ))}
        </div>
      </div>

      {/* Hydration Guide */}
      <div className="nv-hydration-card">
        <div className="nv-hydration-header">
          <Droplets size={20} color="#0891b2" />
          <h3>Hydration Schedule</h3>
        </div>
        <div className="nv-hydration-grid">
          {[
            { time: 'Wake Up', amount: '500ml', note: 'Kickstart metabolism & flush toxins' },
            { time: 'Pre-Workout', amount: '300ml', note: '20–30 min before training' },
            { time: 'During Workout', amount: '500ml', note: 'Sip every 15 min' },
            { time: 'Post-Workout', amount: '500ml', note: 'Rehydrate & support recovery' },
            { time: 'With Meals', amount: '250ml', note: 'Aids digestion' },
            { time: 'Before Bed', amount: '200ml', note: 'Prevent overnight dehydration' },
          ].map((h, i) => (
            <div className="nv-hydration-item" key={i}>
              <span className="nv-hydration-time">{h.time}</span>
              <span className="nv-hydration-amount">{h.amount}</span>
              <span className="nv-hydration-note">{h.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="nv-tips-card">
        <h3 className="nv-section-title">💡 Nutrition Tips for {plan.label}</h3>
        <ul className="nv-tips-list">
          {plan.tips.map((tip, i) => (
            <li key={i} className="nv-tip-item">
              <span className="nv-tip-emoji">{tip.icon}</span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Foods to Avoid */}
      <div className="nv-avoid-card">
        <h3 className="nv-section-title">🚫 Foods to Minimize</h3>
        <div className="nv-avoid-grid">
          {[
            { name: 'Processed Sugar', reason: 'Spikes insulin, causes fat storage & energy crashes' },
            { name: 'Fried Foods', reason: 'Trans fats impair recovery & increase inflammation' },
            { name: 'Alcohol', reason: 'Disrupts protein synthesis & muscle recovery by up to 37%' },
            { name: 'Sugary Drinks', reason: 'Empty calories with zero nutritional benefit' },
            { name: 'White Bread / Refined Carbs', reason: 'Fast-digesting — causes energy spikes then crashes' },
            { name: 'Excessive Sodium', reason: 'Causes water retention and elevated blood pressure' },
          ].map((item, i) => (
            <div className="nv-avoid-item" key={i}>
              <span className="nv-avoid-name">❌ {item.name}</span>
              <span className="nv-avoid-reason">{item.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
