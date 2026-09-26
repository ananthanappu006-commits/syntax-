import React from 'react';
import { Shield, Sparkles, HeartPulse, Lock } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export default function Footer({ activeTab, setActiveTab }) {
  const handleAdminClick = () => {
    soundEffects.playClick();
    setActiveTab('admin');
  };

  return (
    <footer className="simple-app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-logo-dot"></span>
            <span className="footer-title">HabitRoutine OS</span>
            <span className="footer-pill">v2.4 Pro</span>
          </div>
          <p className="footer-desc">
            Personal Health & Habit Operating System • Local & Encrypted
          </p>
        </div>

        <div className="footer-right">
          <div className="footer-system-status" title="All health logs & user records stored locally">
            <span className="status-indicator-green"></span>
            <span>Vault Active</span>
          </div>

          <button
            className={`footer-admin-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={handleAdminClick}
            title="Open Admin Dashboard to manage users, personal data, and health records"
          >
            <Shield size={14} className="admin-btn-icon" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
