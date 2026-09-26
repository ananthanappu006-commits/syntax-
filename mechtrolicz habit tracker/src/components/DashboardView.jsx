import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Watch,
  Dumbbell,
  ChefHat,
  LayoutPanelLeft,
  Target,
  BarChart3,
  Trophy,
  Settings,
  Sparkles,
  Flame,
  Check,
  Heart,
  Clock,
  MapPin,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Droplets,
  Activity,
  Plus
} from 'lucide-react';
import { getTodayDate } from '../utils/storage';
import { soundEffects } from '../utils/audio';

export default function DashboardView({
  data,
  onToggleHabit,
  onCompleteScheduleItem,
  suggestions,
  onApplySuggestion,
  setActiveTab
}) {
  const today = getTodayDate();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Stats calculation
  const totalHabitsToday = data.habits.length;
  const completedHabitsToday = data.habits.filter(h => {
    const record = data.completions[`${h.id}_${today}`];
    return record && record.status === 'completed';
  }).length;
  const completionRate = totalHabitsToday > 0 ? Math.round((completedHabitsToday / totalHabitsToday) * 100) : 0;

  const totalCaloriesConsumed = data.calories?.intake?.reduce((acc, item) => acc + item.calories, 0) || 1390;
  const totalCaloriesBurned = data.calories?.burned?.reduce((acc, item) => acc + item.calories, 0) || 460;
  const targetCalories = data.calories?.dailyTarget || 2200;
  const waterConsumed = data.calories?.waterConsumed || 1750;
  const waterTarget = data.calories?.waterTarget || 2500;

  // Squircle cards for "What do you need?" - Exact replica of the reference UI
  const requirementCards = [
    {
      id: 'habits',
      title: 'Habit Tracker',
      count: `${completedHabitsToday}/${totalHabitsToday} Done`,
      icon: CheckCircle2,
      tab: 'habits',
      activeColor: '#121624'
    },
    {
      id: 'schedule',
      title: 'Daily Routine',
      count: `${data.schedule.length} Blocks`,
      icon: Calendar,
      tab: 'schedule'
    },
    {
      id: 'calories',
      title: 'Calorie Watch',
      count: `${totalCaloriesConsumed} kcal`,
      icon: Watch,
      tab: 'calories'
    },
    {
      id: 'workout',
      title: 'Workout Plan',
      count: 'Split Routine',
      icon: Dumbbell,
      tab: 'workout'
    },
    {
      id: 'nutrition-hub',
      title: 'Nutrition Hub',
      count: 'Recipe Bank',
      icon: ChefHat,
      tab: 'nutrition-hub'
    },
    {
      id: 'planner',
      title: 'Fit & Food',
      count: 'Split Planner',
      icon: LayoutPanelLeft,
      tab: 'planner'
    },
    {
      id: 'goals',
      title: 'Goals & Targets',
      count: `${data.goals.filter(g => g.status === 'active').length} Active`,
      icon: Target,
      tab: 'goals'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      count: `${completionRate}% Score`,
      icon: BarChart3,
      tab: 'analytics'
    },
    {
      id: 'rewards',
      title: 'Rewards & XP',
      count: `${data.user.totalPoints} pts`,
      icon: Trophy,
      tab: 'rewards'
    },
    {
      id: 'settings',
      title: 'Settings',
      count: 'Preferences',
      icon: Settings,
      tab: 'settings'
    },
  ];

  // Quick hydration log
  const handleQuickWater = () => {
    soundEffects.playWater();
  };

  return (
    <div className="replica-dashboard-container animate-fade">
      {/* 2-Column Split: Left "What do you need?" + Right "Find Doctor / Appointments" Replica */}
      <div className="replica-split-grid">
        
        {/* =========================================================
            LEFT COLUMN: "What do you need?" / "Select your requirement"
            ========================================================= */}
        <section className="requirements-column">
          <div className="requirements-header">
            <h2 className="editorial-title">What do you need?</h2>
            <p className="editorial-subtitle">Select your requirement</p>
          </div>

          <div className="squircle-grid">
            {requirementCards.map((card, idx) => {
              const Icon = card.icon;
              const isFirst = idx === 0; // In reference image, first card is active with dark circle
              return (
                <div
                  key={card.id}
                  className={`squircle-card ${isFirst ? 'active-squircle' : ''}`}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveTab(card.tab);
                  }}
                  title={`Open ${card.title}`}
                >
                  <div className={`squircle-icon-circle ${isFirst ? 'active-circle' : ''}`}>
                    <Icon size={22} strokeWidth={isFirst ? 2.4 : 1.9} />
                  </div>
                  <span className="squircle-label">{card.title}</span>
                  <span className="squircle-sub">{card.count}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Smart Suggestion Card embedded elegantly */}
          {suggestions.length > 0 && (
            <div className="sidebar-suggestion-squircle animate-pop">
              <div className="sug-header-row">
                <Sparkles size={16} className="text-amber-500" />
                <span className="sug-pill-tag">{suggestions[0].badge}</span>
              </div>
              <h4 className="sug-mini-title">{suggestions[0].title}</h4>
              <p className="sug-mini-desc">{suggestions[0].description}</p>
              <button 
                className="sug-apply-btn"
                onClick={() => onApplySuggestion(suggestions[0])}
              >
                {suggestions[0].actionLabel}
              </button>
            </div>
          )}
        </section>


        {/* =========================================================
            RIGHT COLUMN: "Find Doctor" & "Your Appointments" Replica
            ========================================================= */}
        <section className="hub-column">
          
          {/* Top Section: "Find Doctor" / Wellness & Routine Mosaic */}
          <div className="hub-top-section">
            <div className="hub-header">
              <h2 className="editorial-title">Productivity & Wellness Hub</h2>
              <p className="editorial-subtitle">Make progress every day. Master your habits.</p>
            </div>

            {/* Mosaic of Pastel Pill Cards matching reference image */}
            <div className="pastel-mosaic-grid">
              
              {/* Card 1: Soft Mint / Cyan Pill: Heart & Hydration */}
              <div 
                className="mosaic-pill-card pill-mint"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('calories');
                }}
                title="Hydration & Heart Rate"
              >
                <div className="mosaic-pill-icon">
                  <Heart size={20} className="text-emerald-700" />
                </div>
                <span className="mosaic-pill-title">Hydration</span>
                <span className="mosaic-pill-value">{waterConsumed} / {waterTarget} ml</span>
              </div>

              {/* Card 2: Hero Coach Card (Peach / Coral) - Replicating Dr. Segril Grille */}
              <div 
                className="mosaic-hero-card pill-peach"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('workout');
                }}
                title="Wellness & Habit Coach"
              >
                <div className="hero-coach-avatar-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                    alt="Maya Lin"
                    className="hero-coach-avatar"
                  />
                  <span className="hero-coach-online"></span>
                </div>
                <h4 className="hero-coach-name">Maya Lin</h4>
                <p className="hero-coach-role">Habit & Wellness Guide</p>
                <div className="hero-coach-badge">
                  <span>⭐ 4.9 Coach Rating</span>
                </div>
              </div>

              {/* Card 3: Soft Sky / Cyan Pill: Ortho / Posture & Strength */}
              <div 
                className="mosaic-pill-card pill-sky"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('workout');
                }}
                title="Active Physical Training"
              >
                <div className="mosaic-pill-icon">
                  <Dumbbell size={20} className="text-cyan-700" />
                </div>
                <span className="mosaic-pill-title">Fitness</span>
                <span className="mosaic-pill-value">{totalCaloriesBurned} kcal burned</span>
              </div>

              {/* Card 4: Soft Lavender Wide Pill: Deep Focus Sprint */}
              <div 
                className="mosaic-wide-pill pill-lavender"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('schedule');
                }}
                title="Deep Work & Cognitive Focus"
              >
                <div className="mosaic-pill-icon">
                  <Clock size={20} className="text-purple-700" />
                </div>
                <div className="wide-pill-content">
                  <span className="mosaic-pill-title">Deep Focus Sprint</span>
                  <span className="mosaic-pill-sub">90 Min Deep Work Block</span>
                </div>
              </div>

              {/* Card 5: Soft Warm Butter / Amber Pill: Macro & Nutrition */}
              <div 
                className="mosaic-pill-card pill-butter"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('nutrition-hub');
                }}
                title="Goal-Based Nutrition & Macros"
              >
                <div className="mosaic-pill-icon">
                  <ChefHat size={20} className="text-amber-700" />
                </div>
                <span className="mosaic-pill-title">Nutrition</span>
                <span className="mosaic-pill-value">{totalCaloriesConsumed} kcal</span>
              </div>

              {/* Card 6: Soft Bone Pill: Consistency Rate */}
              <div 
                className="mosaic-pill-card pill-bone"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('analytics');
                }}
                title="Daily Consistency"
              >
                <div className="mosaic-pill-icon">
                  <TrendingUp size={20} className="text-slate-700" />
                </div>
                <span className="mosaic-pill-title">Consistency</span>
                <span className="mosaic-pill-value">{completionRate}% Today</span>
              </div>

              {/* Card 7: Soft Coral Pill: Active Streak */}
              <div 
                className="mosaic-pill-card pill-coral"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('rewards');
                }}
                title="Active Streak Booster"
              >
                <div className="mosaic-pill-icon">
                  <Flame size={20} className="text-rose-600" />
                </div>
                <span className="mosaic-pill-title">Streak</span>
                <span className="mosaic-pill-value">{data.user.streak} Days Blaze</span>
              </div>

            </div>
          </div>


          {/* =========================================================
              Bottom Section: "Your Appointments" Replica
              "Your Today's Routine & Active Habits"
              ========================================================= */}
          <div className="hub-bottom-section">
            <div className="hub-header" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="editorial-title">Your Appointments & Routines</h2>
                  <p className="editorial-subtitle">Your habits and scheduled commitments are listed here.</p>
                </div>
                <button 
                  className="view-all-link-btn"
                  onClick={() => setActiveTab('habits')}
                >
                  <span>View All ({data.habits.length})</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Carousel / Cards Grid matching Dr. Jhony Grille & Dr. Segril Grille cards */}
            <div className="appointment-cards-grid">
              {data.habits.slice(0, 4).map((habit, index) => {
                const key = `${habit.id}_${today}`;
                const completion = data.completions[key];
                const isCompleted = completion && completion.status === 'completed';

                // Representative portraits/icons for appointment aesthetic
                const sampleDoctors = [
                  {
                    name: 'Dr. Jhony Grille',
                    center: 'Oliver Medical & Fit Center',
                    role: 'Morning Mobility & Cardio',
                    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
                    time: '07:30 AM'
                  },
                  {
                    name: 'Dr. Segril Grille',
                    center: 'Canberra Wellness Unit',
                    role: 'Nutrition & Gut Health',
                    avatar: 'https://images.unsplash.com/photo-1594824813583-128221235338?auto=format&fit=crop&w=150&q=80',
                    time: '10:30 AM'
                  },
                  {
                    name: 'Dr. Marcus Vance',
                    center: 'Apex Performance Clinic',
                    role: 'Strength & Hypertrophy',
                    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80',
                    time: '02:00 PM'
                  },
                  {
                    name: 'Dr. Elena Rostova',
                    center: 'Zenith Rest & Recovery Lab',
                    role: 'Mindfulness & Deep Sleep',
                    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
                    time: '09:00 PM'
                  },
                ];

                const doc = sampleDoctors[index % sampleDoctors.length];

                return (
                  <div 
                    key={habit.id} 
                    className={`appointment-card ${isCompleted ? 'appointment-completed' : ''}`}
                  >
                    {/* Doctor/Habit Circular Avatar */}
                    <div className="appointment-avatar-box">
                      <img 
                        src={doc.avatar} 
                        alt={doc.name} 
                        className="appointment-avatar-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {isCompleted && (
                        <div className="appointment-done-badge" title="Completed">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Habit & Doctor Name */}
                    <h4 className="appointment-doc-name">{habit.name}</h4>
                    <p className="appointment-clinic">{doc.center}</p>

                    {/* Soft Pastel Specialty Pill (Pink/Rose Tag) */}
                    <div className="appointment-pill-tag">
                      <span className="appointment-pill-text">{habit.category} • {habit.priority}</span>
                      <span className="appointment-pill-sub">{habit.target} {habit.unit}</span>
                    </div>

                    {/* Date and Time Info Grid */}
                    <div className="appointment-meta-grid">
                      <div className="appointment-meta-col">
                        <span className="meta-col-lbl">Date</span>
                        <span className="meta-col-val">{today.substring(5)} Today</span>
                      </div>
                      <div className="appointment-meta-col">
                        <span className="meta-col-lbl">Time</span>
                        <span className="meta-col-val">{habit.reminderTime || doc.time}</span>
                      </div>
                    </div>

                    {/* Bottom Action Row: 3 Midnight Circular Buttons from reference */}
                    <div className="appointment-actions-row">
                      <button 
                        className="appointment-round-btn"
                        title="View Category Details"
                        onClick={() => {
                          soundEffects.playClick();
                          setActiveTab('habits');
                        }}
                      >
                        <MapPin size={15} />
                      </button>

                      <button 
                        className="appointment-round-btn"
                        title="View In Daily Routine"
                        onClick={() => {
                          soundEffects.playClick();
                          setActiveTab('schedule');
                        }}
                      >
                        <Calendar size={15} />
                      </button>

                      <button 
                        className={`appointment-round-btn complete-btn ${isCompleted ? 'active-completed' : ''}`}
                        title={isCompleted ? 'Mark as Incomplete' : 'Complete Habit (+10 pts & XP)'}
                        onClick={() => onToggleHabit(habit.id)}
                      >
                        {isCompleted ? <Check size={16} strokeWidth={3} /> : <RefreshCw size={15} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
