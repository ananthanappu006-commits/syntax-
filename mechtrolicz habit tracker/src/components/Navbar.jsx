import React, { useState, useEffect } from 'react';
import { Flame, Award, Sun, Moon, Volume2, VolumeX, Plus, Watch, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function Navbar({ data, setData, theme, toggleTheme, onOpenAddHabit, onOpenCalorieWatch }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    soundEffects.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleSound = () => {
    soundEffects.enabled = !soundEffects.enabled;
    setData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        soundEnabled: soundEffects.enabled
      }
    }));
    if (soundEffects.enabled) {
      soundEffects.playSuccess();
    }
  };

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  const totalCaloriesConsumed = data.calories?.intake?.reduce((acc, item) => acc + item.calories, 0) || 1390;
  const targetCalories = data.calories?.dailyTarget || 2200;

  return (
    <header className="glass-navbar">
      <div className="navbar-left">
        <div className="navbar-date-chip">
          <span className="date-icon">📅</span>
          <span className="date-text">{todayStr}</span>
        </div>

        {/* Calorie Watch Quick Pill */}
        <button
          onClick={onOpenCalorieWatch}
          className="navbar-calorie-chip"
          title="Open Calorie Count Watch"
        >
          <Watch size={15} className="text-amber-600" />
          <span>{totalCaloriesConsumed} / {targetCalories} kcal</span>
        </button>
      </div>

      <div className="navbar-right">
        {/* Streak Pill with Liquid Flame */}
        <div className="navbar-stat-chip streak-chip" title="Current Daily Streak">
          <Flame size={16} className="text-orange-500 fill-orange-500 flame-glow" />
          <span className="font-semibold">{data.user.streak}d Streak</span>
        </div>

        {/* Points Pill */}
        <div className="navbar-stat-chip points-chip" title="Total Accumulated Points">
          <Award size={16} className="text-indigo-600" />
          <span className="font-semibold">{data.user.totalPoints} pts</span>
        </div>

        {/* Level Badge */}
        <div className="navbar-level-chip">
          <Sparkles size={14} className="text-purple-600" />
          <span>Lv {data.user.level} {data.user.levelTitle}</span>
        </div>

        {/* Audio Toggle */}
        <button
          className="navbar-icon-btn"
          onClick={toggleSound}
          title={data.user.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
        >
          {data.user.soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        {/* Theme Toggle */}
        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          className="navbar-icon-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen'}
        >
          {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>

        {/* Quick Add Habit CTA */}
        <button className="navbar-cta-btn" onClick={onOpenAddHabit}>
          <Plus size={16} strokeWidth={2.5} />
          <span>New Habit</span>
        </button>
      </div>
    </header>
  );
}
