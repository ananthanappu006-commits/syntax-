import React from 'react';
import {
  Menu,
  LayoutGrid,
  Plus,
  Calendar,
  Activity,
  Heart,
  User,
  Bell,
  Video,
  Hexagon,
  LogOut,
  CheckCircle2,
  Watch,
  Dumbbell,
  ChefHat,
  Target,
  BarChart3,
  Trophy,
  Settings,
  Sparkles,
  LayoutPanelLeft
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function Sidebar({ activeTab, setActiveTab, data, onOpenAddHabit }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, tooltip: 'Dashboard Overview' },
    { id: 'habits', label: 'Habits', icon: Activity, badge: data.habits.length, tooltip: 'Habit Tracker' },
    { id: 'add-action', label: 'New Habit', isAction: true, icon: Plus, tooltip: 'Add New Habit / Routine' },
    { id: 'schedule', label: 'Daily Routine', icon: Calendar, badge: data.schedule.length, tooltip: 'Daily 24h Routine' },
    { id: 'workout', label: 'Workout Planner', icon: Dumbbell, tooltip: 'Workout & Training' },
    { id: 'nutrition-hub', label: 'Nutrition Hub', icon: ChefHat, tooltip: 'Nutrition & Recipes' },
    { id: 'calories', label: 'Calorie Watch', icon: Watch, tooltip: 'Calorie Watch' },
    { id: 'planner', label: 'Fit & Food', icon: LayoutPanelLeft, tooltip: 'Fit & Food Split Planner' },
    { id: 'goals', label: 'Goals', icon: Target, tooltip: 'Goals & Milestones' },
    { id: 'calendar', label: 'Calendar', icon: Bell, tooltip: 'Habit Calendar History' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, tooltip: 'Productivity Analytics' },
    { id: 'rewards', label: 'Rewards & XP', icon: Trophy, tooltip: 'Gamification & Trophies' },
    { id: 'settings', label: 'Settings', icon: Hexagon, tooltip: 'Settings & Portability' },
  ];

  const handleNavClick = (item) => {
    soundEffects.playClick();
    if (item.isAction) {
      if (onOpenAddHabit) onOpenAddHabit();
      return;
    }
    setActiveTab(item.id);
  };

  return (
    <aside className="pill-sidebar" aria-label="Main Navigation">
      {/* Top Profile Icon */}
      <div className="sidebar-profile-container">
        <button 
          className={`sidebar-profile-btn ${activeTab === 'settings' ? 'active' : ''}`}
          title={`Profile & Settings — ${data.user?.name || 'User'} (Lv ${data.user?.level || 1})`}
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('settings');
          }}
          aria-label="User Profile and Settings"
        >
          <div className="sidebar-profile-circle">
            {data.user?.avatar ? (
              <img 
                src={data.user.avatar} 
                alt={data.user?.name || 'User'} 
                className="sidebar-profile-img" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div 
              className="sidebar-profile-icon-wrapper" 
              style={{ display: data.user?.avatar ? 'none' : 'flex' }}
            >
              <User size={22} strokeWidth={2.2} className="sidebar-profile-icon" />
            </div>
            <span className="avatar-online-dot"></span>
          </div>
        </button>
      </div>

      {/* Hamburger / Menu toggle indicator */}
      <button 
        className="sidebar-icon-btn menu-toggle-btn"
        title="Menu"
        onClick={() => soundEffects.playClick()}
      >
        <Menu size={20} />
      </button>

      {/* Vertical Icon Stack with Custom Floating Coral Notch */}
      <nav className="sidebar-icon-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAddAction = item.isAction;

          if (isAddAction) {
            return (
              <div key={item.id} className="sidebar-notch-wrapper">
                <button
                  className="sidebar-notch-btn"
                  onClick={() => handleNavClick(item)}
                  title={item.tooltip}
                >
                  <Plus size={22} strokeWidth={2.6} />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              className={`sidebar-icon-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
              title={`${item.label} — ${item.tooltip}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.9} />
              {item.badge !== undefined && (
                <span className="sidebar-dot-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Bottom: Logout & Quick Settings */}
      <div className="sidebar-bottom-group">
        <button 
          className="sidebar-icon-btn logout-btn" 
          title="Settings & Reset"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('settings');
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
