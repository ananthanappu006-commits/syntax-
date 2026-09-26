import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield, Users, Activity, HeartPulse, Search, Plus, Filter,
  Download, FileSpreadsheet, Trash2, Edit3, Eye, ArrowLeft,
  CheckCircle, AlertTriangle, Stethoscope, Pill, Apple, Moon,
  Droplet, Scale, Calendar, Phone, Mail, UserCheck, RefreshCw, X,
  Lock, Unlock, Key, BarChart3, Radio, FileText, Printer,
  CheckSquare, Square, Flame, Sparkles, Send, BellRing, Database,
  AlertCircle, TrendingUp, Award, Layers, Upload, ArrowUpRight
} from 'lucide-react';
import {
  getUsersDirectory,
  saveUsersDirectory,
  addUserToDirectory,
  updateUserInDirectory,
  deleteUserFromDirectory,
  exportUsersToJSON,
  exportUsersToCSV,
  calculateBMI,
  calculateHealthRiskScore,
  getAuditLogs,
  addAuditLog,
  clearAuditLogs,
  getHabitPresets,
  addHabitPreset,
  deleteHabitPreset,
  getBroadcasts,
  addBroadcast,
  deleteBroadcast,
  getAdminPinConfig,
  saveAdminPinConfig,
  batchDeleteUsers,
  importUsersFromJSON,
  resetDirectoryToDefault
} from '../utils/userDirectory';
import { soundEffects } from '../utils/audio';

export default function AdminView({ onBackToDashboard, currentActiveUser }) {
  // Navigation Sub-tab: 'directory' | 'analytics' | 'triage' | 'presets' | 'broadcasts' | 'audit'
  const [adminTab, setAdminTab] = useState('directory');

  // Directory Data
  const [users, setUsers] = useState(() => getUsersDirectory());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  
  // Batch Selection
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Inspection, Edit & Sub-Modals
  const [inspectingUser, setInspectingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);

  // Security PIN Lock State
  const [pinConfig, setPinConfig] = useState(() => getAdminPinConfig());
  const [isLocked, setIsLocked] = useState(() => pinConfig.enabled);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Presets & Broadcasts & Audit
  const [presets, setPresets] = useState(() => getHabitPresets());
  const [broadcasts, setBroadcasts] = useState(() => getBroadcasts());
  const [auditLogs, setAuditLogs] = useState(() => getAuditLogs());

  // Reload Directory and associated stores
  const reloadDirectory = () => {
    const list = getUsersDirectory();
    setUsers(list);
    setAuditLogs(getAuditLogs());
    setPresets(getHabitPresets());
    setBroadcasts(getBroadcasts());
    addAuditLog('Directory Reload', 'Refreshed user directory and system records', 'info');
  };

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // PIN Unlock Handler
  const handleUnlockPin = (e) => {
    e?.preventDefault();
    if (pinInput === pinConfig.pin) {
      setIsLocked(false);
      setPinError(false);
      setPinInput('');
      soundEffects.playSuccess();
      addAuditLog('Admin Authentication', 'Admin unlocked security vault with PIN', 'info');
    } else {
      setPinError(true);
      soundEffects.playClick();
    }
  };

  // Toggle PIN Protection
  const handleTogglePinConfig = (enabled, newPin = null) => {
    const nextConfig = { enabled, pin: newPin || pinConfig.pin };
    setPinConfig(nextConfig);
    saveAdminPinConfig(nextConfig);
    showNotification(enabled ? 'Admin PIN lock enabled' : 'Admin PIN lock disabled');
    soundEffects.playSuccess();
  };

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone && u.phone.includes(searchTerm)) ||
        (u.personal?.bloodGroup && u.personal.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.personal?.location && u.personal.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.health?.conditions && u.health.conditions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (u.health?.allergies && u.health.allergies.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (u.health?.medications && u.health.medications.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())));

      if (!matchSearch) return false;

      if (selectedConditionFilter === 'ALL') return true;
      if (selectedConditionFilter === 'CHRONIC') {
        return u.health?.conditions?.some(c => 
          c.toLowerCase().includes('diabetes') || 
          c.toLowerCase().includes('hypertension') || 
          c.toLowerCase().includes('asthma') || 
          c.toLowerCase().includes('celiac') ||
          c.toLowerCase().includes('heart') ||
          c.toLowerCase().includes('hyperlipidemia')
        );
      }
      if (selectedConditionFilter === 'HIGH_RISK') {
        const risk = calculateHealthRiskScore(u);
        return risk.level === 'Critical' || risk.level === 'Elevated';
      }
      if (selectedConditionFilter === 'HEALTHY') {
        return u.health?.conditions?.some(c => c.toLowerCase().includes('healthy')) || (u.health?.conditions?.length === 0);
      }
      if (selectedConditionFilter === 'ALLERGIES') {
        return u.health?.allergies && u.health.allergies.length > 0 && !u.health.allergies.includes('None reported');
      }
      if (selectedConditionFilter === 'MEDICATED') {
        return u.health?.medications && u.health.medications.length > 0;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'streak') return (b.streak || 0) - (a.streak || 0);
      if (sortBy === 'age') return (b.personal?.age || 0) - (a.personal?.age || 0);
      if (sortBy === 'habits') return (b.habitsCount || 0) - (a.habitsCount || 0);
      if (sortBy === 'risk') {
        const rA = calculateHealthRiskScore(a).score;
        const rB = calculateHealthRiskScore(b).score;
        return rB - rA;
      }
      return 0;
    });
  }, [users, searchTerm, selectedConditionFilter, sortBy]);

  // Telemetry Aggregates
  const stats = useMemo(() => {
    const total = users.length;
    let withConditions = 0;
    let highRisk = 0;
    let totalHabits = 0;
    let totalStreak = 0;
    const bmiCounts = { Underweight: 0, Normal: 0, Overweight: 0, Obese: 0 };
    const bloodCounts = {};
    const conditionMap = {};

    users.forEach(u => {
      totalHabits += u.habitsCount || 0;
      totalStreak += u.streak || 0;
      
      const { category } = calculateBMI(u.personal?.height, u.personal?.weight);
      if (category.includes('Normal')) bmiCounts.Normal++;
      else if (category.includes('Overweight')) bmiCounts.Overweight++;
      else if (category.includes('Obese')) bmiCounts.Obese++;
      else if (category.includes('Underweight')) bmiCounts.Underweight++;

      const bg = u.personal?.bloodGroup || 'Unknown';
      bloodCounts[bg] = (bloodCounts[bg] || 0) + 1;

      const risk = calculateHealthRiskScore(u);
      if (risk.level === 'Critical' || risk.level === 'Elevated') {
        highRisk++;
      }

      const conds = u.health?.conditions || [];
      if (conds.length > 0 && !conds.some(c => c.toLowerCase().includes('healthy'))) {
        withConditions++;
      }

      conds.forEach(c => {
        if (!c.toLowerCase().includes('healthy')) {
          conditionMap[c] = (conditionMap[c] || 0) + 1;
        }
      });
    });

    return {
      total,
      withConditions,
      highRisk,
      avgStreak: total > 0 ? Math.round(totalStreak / total) : 0,
      avgHabits: total > 0 ? (totalHabits / total).toFixed(1) : 0,
      bmiCounts,
      bloodCounts,
      conditionMap
    };
  }, [users]);

  // Batch Select Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleToggleSelectUser = (id) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    if (selectedUserIds.length === 0) return;
    if (window.confirm(`Permanently remove ${selectedUserIds.length} selected user record(s)?`)) {
      batchDeleteUsers(selectedUserIds);
      setSelectedUserIds([]);
      reloadDirectory();
      soundEffects.playClick();
      showNotification(`Deleted ${selectedUserIds.length} user records`);
    }
  };

  const handleBatchExport = () => {
    if (selectedUserIds.length === 0) return;
    const subset = users.filter(u => selectedUserIds.includes(u.id));
    exportUsersToCSV(subset);
    soundEffects.playSuccess();
    showNotification(`Exported ${subset.length} records to CSV`);
  };

  // CRUD Handlers
  const handleDelete = (userId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete user record for "${name}"?`)) {
      deleteUserFromDirectory(userId);
      addAuditLog('User Deleted', `Deleted record for ${name} (${userId})`, 'warning');
      reloadDirectory();
      soundEffects.playClick();
      showNotification(`Deleted user record for ${name}`);
    }
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      updateUserInDirectory(editingUser.id, userData);
      addAuditLog('User Updated', `Updated details for ${userData.name}`, 'info');
      showNotification(`Successfully updated record for ${userData.name}`);
    } else {
      addUserToDirectory(userData);
      addAuditLog('User Created', `Registered new user ${userData.name}`, 'success');
      showNotification(`Successfully added new user record for ${userData.name}`);
    }
    soundEffects.playSuccess();
    setEditingUser(null);
    setIsAddUserOpen(false);
    reloadDirectory();
  };

  const handleResetDefaultSeed = () => {
    if (window.confirm('Reset user directory to initial factory baseline demo records? Any custom users will be replaced.')) {
      resetDirectoryToDefault();
      reloadDirectory();
      soundEffects.playSuccess();
      showNotification('Directory reset to default baseline demo records');
    }
  };

  // PIN Lock Screen
  if (isLocked) {
    return (
      <div className="admin-container animate-fade">
        <div className="admin-lock-screen-card">
          <div className="lock-icon-halo">
            <Lock size={36} className="text-amber-400" />
          </div>
          <h2 className="lock-title">Admin Security Vault Protected</h2>
          <p className="lock-subtitle">
            Enter master administrator security PIN to access the clinical registry and system controls.
          </p>
          <form onSubmit={handleUnlockPin} className="pin-form">
            <div className="pin-input-wrap">
              <Key size={18} className="pin-key-icon" />
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Enter PIN (Default: 1234)"
                value={pinInput}
                onChange={e => { setPinInput(e.target.value); setPinError(false); }}
                className={`pin-input ${pinError ? 'pin-error' : ''}`}
              />
            </div>
            {pinError && <span className="pin-error-text">Incorrect PIN. Try again.</span>}
            <div className="pin-buttons">
              <button type="button" className="btn-secondary" onClick={onBackToDashboard}>
                <ArrowLeft size={16} /> Exit to Dashboard
              </button>
              <button type="submit" className="btn-primary">
                <Unlock size={16} /> Unlock Vault
              </button>
            </div>
          </form>
          <div className="pin-hint-box">
            <span>💡 Master PIN default is <code>1234</code>. You can change or disable this anytime inside Admin Settings.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container animate-fade">
      {/* Admin Top Header */}
      <div className="admin-header-glass">
        <div className="admin-header-left">
          <button 
            className="admin-back-btn" 
            onClick={onBackToDashboard} 
            title="Return to Habit Tracker Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div className="admin-badge-row">
            <span className="admin-badge">
              <Shield size={13} />
              <span>Admin Health & Operations OS</span>
            </span>
            <span className="admin-live-tag">● Live Directory</span>
            {pinConfig.enabled && (
              <button 
                className="admin-quick-lock-btn" 
                onClick={() => { setIsLocked(true); soundEffects.playClick(); }}
                title="Lock Admin Portal with PIN"
              >
                <Lock size={12} /> Lock
              </button>
            )}
          </div>
          <h1 className="admin-main-title">User Health & Personal Data Vault</h1>
          <p className="admin-subtitle">
            Centralized health informatics, chronic condition tracking, vital metrics, global habit catalog, and audit controls.
          </p>
        </div>

        <div className="admin-header-actions">
          <button 
            className="admin-btn-secondary" 
            onClick={() => exportUsersToCSV()}
            title="Export all user records to CSV spreadsheet"
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
          <button 
            className="admin-btn-secondary" 
            onClick={exportUsersToJSON}
            title="Export raw JSON backup"
          >
            <Download size={16} />
            <span>Export JSON</span>
          </button>
          <button 
            className="admin-btn-secondary" 
            onClick={() => setIsImportModalOpen(true)}
            title="Import user records from JSON backup"
          >
            <Upload size={16} />
            <span>Import Data</span>
          </button>
          <button 
            className="admin-btn-primary" 
            onClick={() => {
              setEditingUser(null);
              setIsAddUserOpen(true);
              soundEffects.playClick();
            }}
          >
            <Plus size={16} />
            <span>Add User Record</span>
          </button>
        </div>
      </div>

      {notificationMsg && (
        <div className="admin-toast-banner">
          <CheckCircle size={18} />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Admin Module Navigation Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`admin-nav-tab ${adminTab === 'directory' ? 'active' : ''}`}
          onClick={() => { soundEffects.playClick(); setAdminTab('directory'); }}
        >
          <Users size={16} />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          className={`admin-nav-tab ${adminTab === 'analytics' ? 'active' : ''}`}
          onClick={() => { soundEffects.playClick(); setAdminTab('analytics'); }}
        >
          <BarChart3 size={16} />
          <span>Population Analytics</span>
        </button>

        <button
          className={`admin-nav-tab ${adminTab === 'triage' ? 'active' : ''}`}
          onClick={() => { soundEffects.playClick(); setAdminTab('triage'); }}
        >
          <HeartPulse size={16} />
          <span>Clinical Triage Watch</span>
          {stats.highRisk > 0 && <span className="tab-pill-alert">{stats.highRisk} High</span>}
        </button>

        <button
          className={`admin-nav-tab ${adminTab === 'presets' ? 'active' : ''}`}
          onClick={() => { soundEffects.playClick(); setAdminTab('presets'); }}
        >
          <Layers size={16} />
          <span>Habit Presets Catalog</span>
        </button>

        <button
          className={`admin-nav-tab ${adminTab === 'broadcasts' ? 'active' : ''}`}
          onClick={() => { soundEffects.playClick(); setAdminTab('broadcasts'); }}
        >
          <Radio size={16} />
          <span>Broadcast Dispatcher</span>
        </button>

        <button
          className={`admin-nav-tab ${adminTab === 'audit' ? 'active' : ''}`}
          onClick={() => { soundEffects.playClick(); setAdminTab('audit'); }}
        >
          <Database size={16} />
          <span>Audit & Security Vault</span>
        </button>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Users size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Users Stored</span>
            <span className="kpi-val">{stats.total}</span>
            <span className="kpi-sub">All active directory profiles</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <HeartPulse size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Health Conditions Tracked</span>
            <span className="kpi-val">{stats.withConditions}</span>
            <span className="kpi-sub">Users with flagged diagnoses</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Chronic / High Attention</span>
            <span className="kpi-val">{stats.highRisk}</span>
            <span className="kpi-sub">Diabetes, hypertension, asthma</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Activity size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Avg Daily Habits</span>
            <span className="kpi-val">{stats.avgHabits}</span>
            <span className="kpi-sub">{stats.avgStreak} days avg streak</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          TAB 1: USER DIRECTORY TABLE
          ========================================================= */}
      {adminTab === 'directory' && (
        <div className="admin-tab-pane animate-fade">
          {/* Controls & Search Filter Bar */}
          <div className="admin-controls-bar">
            <div className="admin-search-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                className="admin-search-input"
                placeholder="Search by name, email, phone, blood group, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Condition Filter Chips */}
            <div className="admin-filter-chips">
              {[
                { id: 'ALL', label: `All (${users.length})` },
                { id: 'HIGH_RISK', label: 'High Risk' },
                { id: 'CHRONIC', label: 'Chronic & Vital' },
                { id: 'ALLERGIES', label: 'Allergies' },
                { id: 'MEDICATED', label: 'On Medication' },
                { id: 'HEALTHY', label: 'Healthy Baseline' }
              ].map(f => (
                <button
                  key={f.id}
                  className={`admin-chip ${selectedConditionFilter === f.id ? 'active' : ''}`}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedConditionFilter(f.id);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="admin-sort-box">
              <span className="sort-label">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="admin-sort-select"
              >
                <option value="name">Name (A-Z)</option>
                <option value="risk">Clinical Risk Score</option>
                <option value="streak">Highest Streak</option>
                <option value="age">Age (Oldest First)</option>
                <option value="habits">Most Habits</option>
              </select>
            </div>
          </div>

          {/* Batch Actions Ribbon (when users are selected) */}
          {selectedUserIds.length > 0 && (
            <div className="admin-batch-bar animate-fade">
              <div className="batch-left">
                <CheckSquare size={16} className="text-indigo-400" />
                <span><strong>{selectedUserIds.length}</strong> user(s) selected</span>
              </div>
              <div className="batch-actions">
                <button className="batch-btn batch-export" onClick={handleBatchExport}>
                  <Download size={14} /> Export Selected CSV
                </button>
                <button className="batch-btn batch-delete" onClick={handleBatchDelete}>
                  <Trash2 size={14} /> Delete Selected
                </button>
                <button className="batch-btn batch-cancel" onClick={() => setSelectedUserIds([])}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* User Records Table */}
          <div className="admin-table-card">
            <div className="table-header-status">
              <span>Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users</span>
              <div className="table-header-actions-right">
                <button className="admin-refresh-btn" onClick={reloadDirectory} title="Refresh directory data">
                  <RefreshCw size={14} /> Refresh
                </button>
                <button className="admin-refresh-btn" onClick={handleResetDefaultSeed} title="Reset directory to initial default baseline data">
                  <Database size={14} /> Seed Baseline
                </button>
              </div>
            </div>

            <div className="admin-table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px', textAlign: 'center' }}>
                      <input 
                        type="checkbox"
                        checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                        onChange={handleSelectAll}
                        title="Select All"
                      />
                    </th>
                    <th>User / Identity</th>
                    <th>Personal Vitals</th>
                    <th>BMI & Risk Index</th>
                    <th>Health Conditions</th>
                    <th>Medications & Allergies</th>
                    <th>Productivity</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                        No users match your current filter or search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const { bmi, category } = calculateBMI(u.personal?.height, u.personal?.weight);
                      const risk = calculateHealthRiskScore(u);
                      const isCurrentActive = u.email === currentActiveUser?.email;
                      const isSelected = selectedUserIds.includes(u.id);

                      return (
                        <tr key={u.id} className={`${isCurrentActive ? 'active-user-row' : ''} ${isSelected ? 'selected-row' : ''}`}>
                          {/* Checkbox */}
                          <td style={{ textAlign: 'center' }}>
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectUser(u.id)}
                            />
                          </td>

                          {/* Identity */}
                          <td>
                            <div className="user-id-cell">
                              <img 
                                src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                                alt={u.name} 
                                className="admin-user-thumb" 
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                              <div>
                                <div className="user-name-line">
                                  <strong>{u.name}</strong>
                                  {isCurrentActive && <span className="active-tag">You</span>}
                                </div>
                                <span className="user-email-line">{u.email}</span>
                                <span className="user-role-line">{u.personal?.occupation || u.role}</span>
                              </div>
                            </div>
                          </td>

                          {/* Personal Vitals */}
                          <td>
                            <div className="vitals-cell">
                              <span>{u.personal?.age ? `${u.personal.age} yrs` : '—'} • {u.personal?.gender || '—'}</span>
                              <span className="blood-tag">Blood: <strong>{u.personal?.bloodGroup || 'O+'}</strong></span>
                              <span className="loc-line">{u.personal?.location || '—'}</span>
                            </div>
                          </td>

                          {/* BMI & Metrics */}
                          <td>
                            <div className="bmi-cell">
                              <span>{u.personal?.height || '—'} cm / {u.personal?.weight || '—'} kg</span>
                              {bmi ? (
                                <span className={`bmi-badge bmi-${category.toLowerCase().replace(' ', '-')}`}>
                                  BMI {bmi} ({category})
                                </span>
                              ) : (
                                <span className="bmi-badge">BMI N/A</span>
                              )}
                              <span className="risk-score-badge" style={{ borderColor: risk.color, color: risk.color }}>
                                Risk {risk.score}/100 • {risk.level}
                              </span>
                            </div>
                          </td>

                          {/* Health Conditions */}
                          <td>
                            <div className="conditions-tags-wrap">
                              {u.health?.conditions && u.health.conditions.length > 0 ? (
                                u.health.conditions.map((c, i) => {
                                  const isHealthy = c.toLowerCase().includes('healthy');
                                  return (
                                    <span 
                                      key={i} 
                                      className={`cond-tag ${isHealthy ? 'cond-tag-healthy' : 'cond-tag-warning'}`}
                                    >
                                      {c}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="cond-tag cond-tag-healthy">Healthy Baseline</span>
                              )}
                            </div>
                          </td>

                          {/* Medications & Allergies */}
                          <td>
                            <div className="meds-cell">
                              {u.health?.medications && u.health.medications.length > 0 ? (
                                <div className="med-line" title={u.health.medications.join(', ')}>
                                  <Pill size={12} />
                                  <span>{u.health.medications[0]} {u.health.medications.length > 1 && `+${u.health.medications.length - 1}`}</span>
                                </div>
                              ) : (
                                <span className="sub-text">No medications</span>
                              )}
                              {u.health?.allergies && u.health.allergies.length > 0 && !u.health.allergies.includes('None reported') ? (
                                <div className="allergy-line" title={u.health.allergies.join(', ')}>
                                  <AlertTriangle size={12} />
                                  <span>Allergies: {u.health.allergies.join(', ')}</span>
                                </div>
                              ) : null}
                            </div>
                          </td>

                          {/* Productivity & Habits */}
                          <td>
                            <div className="habits-stats-cell">
                              <span className="streak-badge">🔥 {u.streak || 0}d streak</span>
                              <span className="habits-count">{u.habitsCount || 0} active habits</span>
                              <span className="sub-text">Lv {u.level || 1} • {u.totalPoints || 0} XP</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div className="admin-action-btns">
                              <button 
                                className="action-icon-btn view-btn" 
                                title="Inspect Full User & Medical Record"
                                onClick={() => {
                                  setInspectingUser(u);
                                  soundEffects.playClick();
                                }}
                              >
                                <Eye size={15} />
                              </button>
                              <button 
                                className="action-icon-btn edit-btn" 
                                title="Edit User Personal & Health Details"
                                onClick={() => {
                                  setEditingUser(u);
                                  setIsAddUserOpen(true);
                                  soundEffects.playClick();
                                }}
                              >
                                <Edit3 size={15} />
                              </button>
                              <button 
                                className="action-icon-btn delete-btn" 
                                title="Delete User Record"
                                onClick={() => handleDelete(u.id, u.name)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: POPULATION HEALTH & ANALYTICS
          ========================================================= */}
      {adminTab === 'analytics' && (
        <div className="admin-tab-pane animate-fade">
          <div className="analytics-section-grid">
            {/* BMI Distribution Card */}
            <div className="admin-analytics-card">
              <div className="card-top-header">
                <Scale size={18} className="text-cyan-400" />
                <h3>BMI Category Distribution</h3>
              </div>
              <p className="card-sub-info">Population weight status distribution</p>
              
              <div className="distribution-bars">
                {Object.entries(stats.bmiCounts).map(([cat, count]) => {
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={cat} className="bar-row">
                      <div className="bar-label-row">
                        <span>{cat}</span>
                        <span><strong>{count}</strong> ({pct}%)</span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className={`progress-fill bmi-bar-${cat.toLowerCase()}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blood Group Inventory Card */}
            <div className="admin-analytics-card">
              <div className="card-top-header">
                <HeartPulse size={18} className="text-rose-400" />
                <h3>Blood Group Distribution</h3>
              </div>
              <p className="card-sub-info">Emergency transfusion compatibility registry</p>
              
              <div className="blood-groups-grid">
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => {
                  const count = stats.bloodCounts[bg] || 0;
                  return (
                    <div key={bg} className="blood-box">
                      <span className="bg-name">{bg}</span>
                      <span className="bg-count">{count}</span>
                      <span className="bg-lbl">users</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Diagnosed Chronic Conditions */}
            <div className="admin-analytics-card full-width">
              <div className="card-top-header">
                <Stethoscope size={18} className="text-amber-400" />
                <h3>Chronic Conditions Frequency Breakdown</h3>
              </div>
              <p className="card-sub-info">Prevalence of chronic diagnoses across active registry profiles</p>

              <div className="conditions-breakdown-list">
                {Object.entries(stats.conditionMap).length === 0 ? (
                  <p className="text-muted-p">No chronic conditions diagnosed in current cohort.</p>
                ) : (
                  Object.entries(stats.conditionMap)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cond, count]) => {
                      const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                      return (
                        <div key={cond} className="cond-stat-row">
                          <div className="cond-stat-left">
                            <span className="cond-stat-name">🏥 {cond}</span>
                            <span className="cond-stat-badge">{count} Patient{count > 1 ? 's' : ''}</span>
                          </div>
                          <div className="cond-stat-bar-wrap">
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${pct}%`, background: '#f59e0b' }}></div>
                            </div>
                            <span className="cond-stat-pct">{pct}%</span>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Top Streaks & Habit Consistency Board */}
            <div className="admin-analytics-card full-width">
              <div className="card-top-header">
                <Flame size={18} className="text-orange-500" />
                <h3>Streak & Consistency Leadership Board</h3>
              </div>
              <p className="card-sub-info">Top habit discipline records among users</p>

              <div className="leaderboard-grid">
                {[...users].sort((a, b) => (b.streak || 0) - (a.streak || 0)).slice(0, 5).map((u, i) => (
                  <div key={u.id} className="leaderboard-card">
                    <span className="rank-num">#{i + 1}</span>
                    <img 
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                      alt={u.name} 
                      className="leader-avatar" 
                    />
                    <div className="leader-info">
                      <strong>{u.name}</strong>
                      <span className="streak-val">🔥 {u.streak || 0} Day Streak</span>
                      <span className="leader-xp">{u.totalPoints || 0} XP • Lv {u.level || 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: CLINICAL TRIAGE WATCH
          ========================================================= */}
      {adminTab === 'triage' && (
        <div className="admin-tab-pane animate-fade">
          <div className="triage-intro-banner">
            <div className="triage-intro-icon">
              <AlertCircle size={28} className="text-rose-500" />
            </div>
            <div>
              <h3>High-Priority Clinical & Health Attention Triage</h3>
              <p>
                Patients presenting chronic conditions (diabetes, hypertension, asthma), high clinical risk scores (≥50), or critical stress/sleep deficits requiring prioritized care and monitoring.
              </p>
            </div>
          </div>

          <div className="triage-grid">
            {users
              .map(u => ({ user: u, risk: calculateHealthRiskScore(u) }))
              .filter(item => item.risk.level === 'Critical' || item.risk.level === 'Elevated' || (item.user.health?.conditions?.length > 0 && !item.user.health?.conditions?.some(c => c.toLowerCase().includes('healthy'))))
              .sort((a, b) => b.risk.score - a.risk.score)
              .map(({ user: u, risk }) => (
                <div key={u.id} className={`triage-card risk-border-${risk.level.toLowerCase()}`}>
                  <div className="triage-card-header">
                    <div className="triage-user-meta">
                      <img src={u.avatar} alt={u.name} className="triage-thumb" />
                      <div>
                        <h4>{u.name}</h4>
                        <span className="triage-contact">{u.email} • {u.phone || 'No phone'}</span>
                      </div>
                    </div>
                    <span className="triage-risk-pill" style={{ background: `${risk.color}20`, color: risk.color, borderColor: `${risk.color}50` }}>
                      {risk.level} ({risk.score}/100)
                    </span>
                  </div>

                  <div className="triage-factors-box">
                    <span className="factors-label">Clinical Risk Drivers:</span>
                    <ul className="factors-list">
                      {risk.factors.length > 0 ? (
                        risk.factors.map((f, i) => <li key={i}>{f}</li>)
                      ) : (
                        <li>Chronic condition on record</li>
                      )}
                    </ul>
                  </div>

                  <div className="triage-vitals-row">
                    <div className="t-vital">
                      <span className="tv-lbl">BP / Notes</span>
                      <span className="tv-val">{u.health?.doctorNotes ? u.health.doctorNotes.slice(0, 38) + '...' : 'BP monitoring active'}</span>
                    </div>
                    <div className="t-vital">
                      <span className="tv-lbl">Sleep</span>
                      <span className="tv-val">{u.health?.sleepHours || '7.0'} hrs</span>
                    </div>
                    <div className="t-vital">
                      <span className="tv-lbl">Emergency Contact</span>
                      <span className="tv-val">{u.personal?.emergencyContact || 'None on file'}</span>
                    </div>
                  </div>

                  <div className="triage-card-actions">
                    <button 
                      className="btn-triage-inspect" 
                      onClick={() => {
                        setInspectingUser(u);
                        soundEffects.playClick();
                      }}
                    >
                      <Eye size={14} /> Full Dossier
                    </button>
                    <button 
                      className="btn-triage-alert"
                      onClick={() => {
                        const note = prompt(`Enter clinical directive / alert for ${u.name}:`, 'Follow up with physician regarding medication compliance and BP cuff reading.');
                        if (note) {
                          updateUserInDirectory(u.id, {
                            health: {
                              ...u.health,
                              doctorNotes: note
                            }
                          });
                          addAuditLog('Clinical Directive', `Issued directive for ${u.name}: "${note}"`, 'warning');
                          reloadDirectory();
                          showNotification(`Clinical directive saved for ${u.name}`);
                          soundEffects.playSuccess();
                        }
                      }}
                    >
                      <Stethoscope size={14} /> Issue Directive
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: HABIT PRESETS CATALOG
          ========================================================= */}
      {adminTab === 'presets' && (
        <div className="admin-tab-pane animate-fade">
          <div className="catalog-header-bar">
            <div>
              <h3>Organization Habit & Protocol Library</h3>
              <p>Standardized clinical, health, and athletic routine protocols that users can adopt.</p>
            </div>
            <button 
              className="admin-btn-primary"
              onClick={() => {
                const name = prompt('Preset Routine Name:');
                if (!name) return;
                const description = prompt('Routine Description / Clinical Rationale:');
                const prescribedFor = prompt('Recommended for (e.g. Type 2 Diabetes, High Stress, Athletes):') || 'General';
                addHabitPreset({
                  name,
                  description: description || 'Standard protocol',
                  prescribedFor,
                  category: 'health',
                  timeOfDay: 'morning',
                  frequency: 'daily',
                  target: 1,
                  unit: 'session',
                  priority: 'medium'
                });
                setPresets(getHabitPresets());
                showNotification(`Created preset "${name}"`);
                soundEffects.playSuccess();
              }}
            >
              <Plus size={16} /> Add Protocol Preset
            </button>
          </div>

          <div className="presets-cards-grid">
            {presets.map(pst => (
              <div key={pst.id} className="preset-card">
                <div className="preset-card-top">
                  <div className="preset-icon-badge">
                    <Sparkles size={18} className="text-amber-400" />
                  </div>
                  <span className={`priority-tag priority-${pst.priority || 'medium'}`}>
                    {pst.priority || 'medium'} priority
                  </span>
                </div>
                <h4 className="preset-name">{pst.name}</h4>
                <p className="preset-desc">{pst.description}</p>
                <div className="preset-prescribed-strip">
                  <span className="target-lbl">Prescribed For:</span>
                  <span className="target-val">{pst.prescribedFor || 'General Wellness'}</span>
                </div>
                <div className="preset-footer">
                  <span className="freq-pill">{pst.timeOfDay} • {pst.frequency}</span>
                  <button 
                    className="delete-preset-btn" 
                    title="Delete Preset"
                    onClick={() => {
                      if (window.confirm(`Delete preset "${pst.name}"?`)) {
                        deleteHabitPreset(pst.id);
                        setPresets(getHabitPresets());
                        showNotification('Removed preset');
                        soundEffects.playClick();
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 5: SYSTEM BROADCASTS & ADVISORIES
          ========================================================= */}
      {adminTab === 'broadcasts' && (
        <div className="admin-tab-pane animate-fade">
          <div className="catalog-header-bar">
            <div>
              <h3>Health Advisories & Notification Broadcasts</h3>
              <p>Dispatch active announcements or health warnings across the entire user base.</p>
            </div>
            <button 
              className="admin-btn-primary"
              onClick={() => {
                const title = prompt('Broadcast Title / Subject:');
                if (!title) return;
                const message = prompt('Advisory Message Content:');
                if (!message) return;
                const type = prompt('Broadcast Type ("info" | "warning" | "urgent"):') || 'info';
                addBroadcast({
                  title,
                  message,
                  type,
                  targetCohort: 'All Active Profiles'
                });
                setBroadcasts(getBroadcasts());
                showNotification(`Dispatched broadcast: "${title}"`);
                soundEffects.playSuccess();
              }}
            >
              <Send size={16} /> Dispatch New Broadcast
            </button>
          </div>

          <div className="broadcasts-stack">
            {broadcasts.length === 0 ? (
              <p className="text-muted-p">No active broadcasts dispatched.</p>
            ) : (
              broadcasts.map(b => (
                <div key={b.id} className={`broadcast-banner-item broadcast-${b.type || 'info'}`}>
                  <div className="bc-icon-col">
                    <BellRing size={20} />
                  </div>
                  <div className="bc-content-col">
                    <div className="bc-header-line">
                      <h4>{b.title}</h4>
                      <span className="bc-type-pill">{b.type?.toUpperCase()}</span>
                      <span className="bc-date">{b.created}</span>
                    </div>
                    <p className="bc-body">{b.message}</p>
                    <span className="bc-target">Audience: <strong>{b.targetCohort || 'All Users'}</strong></span>
                  </div>
                  <button 
                    className="bc-delete-btn"
                    onClick={() => {
                      deleteBroadcast(b.id);
                      setBroadcasts(getBroadcasts());
                      showNotification('Broadcast deleted');
                      soundEffects.playClick();
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 6: AUDIT TRAIL, SECURITY & VAULT
          ========================================================= */}
      {adminTab === 'audit' && (
        <div className="admin-tab-pane animate-fade">
          <div className="vault-subsections-grid">
            {/* PIN Security Configuration */}
            <div className="admin-analytics-card">
              <div className="card-top-header">
                <Lock size={18} className="text-indigo-400" />
                <h3>Vault Master PIN Protection</h3>
              </div>
              <p className="card-sub-info">Enforce password protection when entering the Admin Portal.</p>
              
              <div className="pin-settings-box">
                <div className="setting-toggle-row">
                  <div>
                    <strong>Require PIN to enter Admin Portal</strong>
                    <p className="text-muted-desc">Prevents unauthorized users from viewing patient directories.</p>
                  </div>
                  <button
                    className={`toggle-switch-btn ${pinConfig.enabled ? 'active' : ''}`}
                    onClick={() => handleTogglePinConfig(!pinConfig.enabled)}
                  >
                    {pinConfig.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="change-pin-row">
                  <span>Current PIN: <code>{pinConfig.pin}</code></span>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      const newCode = prompt('Enter new 4 to 8 digit Admin PIN:', pinConfig.pin);
                      if (newCode && newCode.trim().length >= 4) {
                        handleTogglePinConfig(pinConfig.enabled, newCode.trim());
                      }
                    }}
                  >
                    Change PIN
                  </button>
                </div>
              </div>
            </div>

            {/* Storage Quota & Diagnostics */}
            <div className="admin-analytics-card">
              <div className="card-top-header">
                <Database size={18} className="text-emerald-400" />
                <h3>Storage & Engine Health</h3>
              </div>
              <p className="card-sub-info">Local vault telemetry & data integrity</p>

              <div className="diagnostics-metrics-grid">
                <div className="diag-item">
                  <span className="diag-val">{users.length}</span>
                  <span className="diag-lbl">Clinical Profiles</span>
                </div>
                <div className="diag-item">
                  <span className="diag-val">~{((JSON.stringify(users).length) / 1024).toFixed(1)} KB</span>
                  <span className="diag-lbl">Vault Footprint</span>
                </div>
                <div className="diag-item">
                  <span className="diag-val" style={{ color: '#10b981' }}>Healthy</span>
                  <span className="diag-lbl">Schema Validation</span>
                </div>
              </div>
            </div>

            {/* System Audit Log */}
            <div className="admin-analytics-card full-width">
              <div className="card-top-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} className="text-blue-400" />
                  <h3>Audit Trail & Operations Log</h3>
                </div>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    if (window.confirm('Clear audit history?')) {
                      clearAuditLogs();
                      setAuditLogs([]);
                      soundEffects.playClick();
                    }
                  }}
                >
                  Clear Logs
                </button>
              </div>
              <p className="card-sub-info">Immutable administrative activity events with timestamps</p>

              <div className="audit-log-table-wrap">
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Admin Actor</th>
                      <th>Details</th>
                      <th>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No logs recorded.</td></tr>
                    ) : (
                      auditLogs.map(log => (
                        <tr key={log.id}>
                          <td className="log-time">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                          <td className="log-action"><strong>{log.action}</strong></td>
                          <td className="log-user">{log.user || 'System'}</td>
                          <td className="log-desc">{log.details}</td>
                          <td>
                            <span className={`log-badge badge-${log.severity || 'info'}`}>
                              {log.severity}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detailed Inspection Dossier */}
      {inspectingUser && (
        <UserInspectionModal 
          user={inspectingUser} 
          onClose={() => setInspectingUser(null)} 
          onEdit={() => {
            const target = inspectingUser;
            setInspectingUser(null);
            setEditingUser(target);
            setIsAddUserOpen(true);
          }}
        />
      )}

      {/* Modal: Add or Edit User Record */}
      {isAddUserOpen && (
        <UserFormModal 
          user={editingUser}
          onClose={() => {
            setIsAddUserOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {/* Modal: Import Data */}
      {isImportModalOpen && (
        <ImportDataModal 
          onClose={() => setIsImportModalOpen(false)}
          onImport={(jsonStr) => {
            const res = importUsersFromJSON(jsonStr);
            if (res.success) {
              reloadDirectory();
              showNotification(`Imported ${res.count} records successfully`);
              soundEffects.playSuccess();
              setIsImportModalOpen(false);
            } else {
              alert(`Import failed: ${res.error}`);
            }
          }}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Sub-component: User Profile Card Modal (Triggered by Eye Button)
// -------------------------------------------------------------
function UserInspectionModal({ user, onClose, onEdit }) {
  const { bmi, category } = calculateBMI(user.personal?.height, user.personal?.weight);
  const risk = calculateHealthRiskScore(user);
  const [copied, setCopied] = useState(false);

  const handleCopyInfo = () => {
    const text = `${user.name} | ${user.email} | Phone: ${user.phone || 'N/A'} | Blood: ${user.personal?.bloodGroup || 'N/A'} | Conditions: ${(user.health?.conditions || []).join(', ') || 'None'}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    soundEffects.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-user-profile-card print-patient-card" onClick={e => e.stopPropagation()}>
        {/* Profile Card Banner Cover */}
        <div className="profile-card-cover no-print">
          <div className="cover-glow-mesh"></div>
          <div className="cover-top-bar">
            <span className="cover-card-badge">
              <UserCheck size={13} />
              <span>Digital Health ID & Medical Dossier</span>
            </span>
            <div className="cover-top-actions">
              <button 
                className="cover-action-btn" 
                onClick={handlePrint}
                title="Print Patient Summary Report"
              >
                <Printer size={15} />
                <span>Print</span>
              </button>
              <button 
                className="cover-action-btn" 
                onClick={handleCopyInfo} 
                title="Copy User Summary to Clipboard"
              >
                {copied ? <CheckCircle size={15} style={{ color: '#10b981' }} /> : <Mail size={15} />}
                <span>{copied ? 'Copied!' : 'Copy Info'}</span>
              </button>
              <button 
                className="cover-action-btn edit-accent" 
                onClick={onEdit} 
                title="Edit User Profile & Health Info"
              >
                <Edit3 size={15} />
                <span>Edit</span>
              </button>
              <button className="cover-close-btn" onClick={onClose} title="Close Profile Card">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Header Hero Section */}
        <div className="profile-hero-section">
          <div className="profile-avatar-wrapper">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={user.name} 
              className="profile-card-avatar"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="profile-avatar-ring"></span>
            <span className="profile-level-badge">Lv {user.level || 1}</span>
          </div>

          <div className="profile-hero-info">
            <div className="profile-title-row">
              <h2 className="profile-user-name">{user.name}</h2>
              <span className="profile-role-chip">{user.role || 'Member'}</span>
              <span className="profile-online-badge">● Active Record</span>
              <span className="profile-risk-chip" style={{ background: `${risk.color}25`, color: risk.color }}>
                {risk.level} Risk ({risk.score}/100)
              </span>
            </div>

            <p className="profile-user-headline">
              {user.personal?.occupation || 'Productivity Practitioner'}
              {user.personal?.location && ` • ${user.personal.location}`}
            </p>

            <div className="profile-meta-pills">
              <span className="profile-meta-pill">
                <Mail size={13} /> {user.email}
              </span>
              {user.phone && (
                <span className="profile-meta-pill">
                  <Phone size={13} /> {user.phone}
                </span>
              )}
              <span className="profile-meta-pill id-pill">
                ID: <code>{user.id}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Stats Highlight Ribbon */}
        <div className="profile-stats-ribbon">
          <div className="stat-pill-box">
            <span className="stat-pill-icon">🔥</span>
            <div className="stat-pill-data">
              <span className="stat-pill-val">{user.streak || 0} Days</span>
              <span className="stat-pill-lbl">Current Streak</span>
            </div>
          </div>

          <div className="stat-pill-box">
            <span className="stat-pill-icon">⚡</span>
            <div className="stat-pill-data">
              <span className="stat-pill-val">{user.totalPoints || 0} XP</span>
              <span className="stat-pill-lbl">Experience Points</span>
            </div>
          </div>

          <div className="stat-pill-box">
            <span className="stat-pill-icon">🎯</span>
            <div className="stat-pill-data">
              <span className="stat-pill-val">{user.habitsCount || 0} Habits</span>
              <span className="stat-pill-lbl">Active Daily Tracker</span>
            </div>
          </div>

          <div className="stat-pill-box">
            <span className="stat-pill-icon">⚖️</span>
            <div className="stat-pill-data">
              <span className="stat-pill-val">{bmi ? `BMI ${bmi}` : 'BMI N/A'}</span>
              <span className={`stat-pill-lbl bmi-status-text bmi-${category.toLowerCase().replace(' ', '-')}`}>
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Card Body Details */}
        <div className="profile-card-body">
          {/* Card 1: Personal Vitals & Emergency */}
          <div className="profile-section-card">
            <div className="section-card-header">
              <div className="section-card-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                <Scale size={18} />
              </div>
              <div>
                <h3 className="section-card-title">Personal Vitals & Biometrics</h3>
                <p className="section-card-desc">Demographics, body composition, and emergency contact</p>
              </div>
            </div>

            <div className="vitals-dossier-grid">
              <div className="vital-item-card">
                <span className="vital-lbl">Age & Gender</span>
                <span className="vital-val">{user.personal?.age ? `${user.personal.age} yrs` : '—'} • {user.personal?.gender || '—'}</span>
              </div>

              <div className="vital-item-card highlight-blood">
                <span className="vital-lbl">Blood Group</span>
                <span className="vital-val blood-val">🩸 {user.personal?.bloodGroup || 'Unknown'}</span>
              </div>

              <div className="vital-item-card">
                <span className="vital-lbl">Height</span>
                <span className="vital-val">{user.personal?.height ? `${user.personal.height} cm` : '—'}</span>
              </div>

              <div className="vital-item-card">
                <span className="vital-lbl">Weight</span>
                <span className="vital-val">{user.personal?.weight ? `${user.personal.weight} kg` : '—'}</span>
              </div>
            </div>

            <div className="emergency-contact-strip">
              <div className="emergency-icon-wrap">
                <Phone size={16} />
              </div>
              <div className="emergency-info">
                <span className="emergency-lbl">Emergency Contact Details</span>
                <span className="emergency-val">
                  {user.personal?.emergencyContact || 'No emergency contact provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Medical & Clinical Health Dossier */}
          <div className="profile-section-card">
            <div className="section-card-header">
              <div className="section-card-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
                <HeartPulse size={18} />
              </div>
              <div>
                <h3 className="section-card-title">Clinical Health & Medical Profile</h3>
                <p className="section-card-desc">Chronic diagnoses, active medications, allergies, and lifestyle factors</p>
              </div>
            </div>

            <div className="health-dossier-stack">
              {/* Diagnosed Conditions */}
              <div className="health-field-group">
                <span className="health-field-label">Diagnosed Health / Chronic Conditions:</span>
                <div className="health-tags-list">
                  {user.health?.conditions && user.health.conditions.length > 0 ? (
                    user.health.conditions.map((c, i) => {
                      const isHealthy = c.toLowerCase().includes('healthy');
                      return (
                        <span 
                          key={i} 
                          className={`health-condition-pill ${isHealthy ? 'pill-healthy' : 'pill-chronic'}`}
                        >
                          🏥 {c}
                        </span>
                      );
                    })
                  ) : (
                    <span className="health-condition-pill pill-healthy">No diagnosed health conditions reported</span>
                  )}
                </div>
              </div>

              {/* Known Allergies */}
              <div className="health-field-group">
                <span className="health-field-label">Known Allergies:</span>
                <div className="health-tags-list">
                  {user.health?.allergies && user.health.allergies.length > 0 ? (
                    user.health.allergies.map((a, i) => (
                      <span key={i} className="allergy-tag-pill">
                        ⚠️ {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-tag">None reported</span>
                  )}
                </div>
              </div>

              {/* Medications */}
              <div className="health-field-group">
                <span className="health-field-label">Active Prescriptions / Medications:</span>
                <div className="health-tags-list">
                  {user.health?.medications && user.health.medications.length > 0 ? (
                    user.health.medications.map((m, i) => (
                      <span key={i} className="medication-tag-pill">
                        💊 {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-tag">No active medications</span>
                  )}
                </div>
              </div>

              {/* Daily Lifestyle Factors */}
              <div className="lifestyle-factors-grid">
                <div className="lifestyle-box">
                  <Apple size={14} className="lifestyle-icon" />
                  <div>
                    <span className="l-val">{user.health?.dietaryPreference || 'Standard'}</span>
                    <span className="l-lbl">Dietary Style</span>
                  </div>
                </div>

                <div className="lifestyle-box">
                  <Moon size={14} className="lifestyle-icon" />
                  <div>
                    <span className="l-val">{user.health?.sleepHours ? `${user.health.sleepHours} hrs` : '7.0 hrs'}</span>
                    <span className="l-lbl">Nightly Sleep</span>
                  </div>
                </div>

                <div className="lifestyle-box">
                  <Droplet size={14} className="lifestyle-icon" />
                  <div>
                    <span className="l-val">{user.health?.waterGoalLiters ? `${user.health.waterGoalLiters} L` : '2.5 L'}</span>
                    <span className="l-lbl">Water Intake</span>
                  </div>
                </div>

                <div className="lifestyle-box">
                  <Activity size={14} className="lifestyle-icon" />
                  <div>
                    <span className="l-val">{user.health?.stressLevel || 'Moderate'}</span>
                    <span className="l-lbl">Stress Level</span>
                  </div>
                </div>
              </div>

              {/* Physician Notes */}
              {user.health?.doctorNotes && (
                <div className="physician-notes-callout">
                  <div className="notes-header">
                    <Stethoscope size={15} style={{ color: '#06b6d4' }} />
                    <span>Physician & Medical Recommendations:</span>
                  </div>
                  <p className="notes-content">"{user.health.doctorNotes}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Card Footer */}
        <div className="profile-card-footer no-print">
          <span className="footer-last-active">
            Last active: <strong>{user.lastActive || 'Recently'}</strong> • Registered: {user.joinedDate || '2026-08-01'}
          </span>
          <div className="footer-btns-group">
            <button className="btn-secondary" onClick={onClose} style={{ padding: '9px 18px' }}>
              Close Card
            </button>
            <button className="btn-primary" onClick={onEdit} style={{ padding: '9px 20px' }}>
              <Edit3 size={15} />
              <span>Edit Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-component: Add or Edit User Form Modal
// -------------------------------------------------------------
function UserFormModal({ user, onClose, onSave }) {
  const isEdit = Boolean(user);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [role, setRole] = useState(user?.role || 'Member');

  // Personal Vitals
  const [age, setAge] = useState(user?.personal?.age || 26);
  const [gender, setGender] = useState(user?.personal?.gender || 'Female');
  const [bloodGroup, setBloodGroup] = useState(user?.personal?.bloodGroup || 'O+');
  const [height, setHeight] = useState(user?.personal?.height || 170);
  const [weight, setWeight] = useState(user?.personal?.weight || 68);
  const [occupation, setOccupation] = useState(user?.personal?.occupation || '');
  const [location, setLocation] = useState(user?.personal?.location || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.personal?.emergencyContact || '');

  // Health Conditions
  const [conditionsInput, setConditionsInput] = useState(
    (user?.health?.conditions || []).join(', ')
  );
  const [allergiesInput, setAllergiesInput] = useState(
    (user?.health?.allergies || []).join(', ')
  );
  const [medicationsInput, setMedicationsInput] = useState(
    (user?.health?.medications || []).join(', ')
  );
  const [dietaryPreference, setDietaryPreference] = useState(
    user?.health?.dietaryPreference || 'High Protein / Balanced'
  );
  const [sleepHours, setSleepHours] = useState(user?.health?.sleepHours || 7.5);
  const [waterGoalLiters, setWaterGoalLiters] = useState(user?.health?.waterGoalLiters || 3.0);
  const [stressLevel, setStressLevel] = useState(user?.health?.stressLevel || 'Moderate');
  const [activityLevel, setActivityLevel] = useState(user?.health?.activityLevel || 'Moderately Active');
  const [doctorNotes, setDoctorNotes] = useState(user?.health?.doctorNotes || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    const parseList = (str) =>
      str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

    const payload = {
      name,
      email,
      phone,
      role,
      personal: {
        age: parseInt(age, 10) || 25,
        gender,
        bloodGroup,
        height: parseFloat(height) || 170,
        weight: parseFloat(weight) || 70,
        occupation,
        location,
        emergencyContact
      },
      health: {
        conditions: parseList(conditionsInput),
        allergies: parseList(allergiesInput),
        medications: parseList(medicationsInput),
        dietaryPreference,
        sleepHours: parseFloat(sleepHours) || 7.0,
        waterGoalLiters: parseFloat(waterGoalLiters) || 2.5,
        stressLevel,
        activityLevel,
        doctorNotes
      }
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{isEdit ? 'Edit User & Health Profile' : 'Register New User & Health Profile'}</h2>
            <p className="modal-subtitle">Configure personal vitals, emergency info, and medical conditions</p>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="admin-user-form">
          {/* Section: Basic Identity */}
          <div className="form-sub-section">
            <h4 className="sec-heading"><UserCheck size={16} /> Basic Identity & Contact</h4>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="+1 (555) 000-0000"
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section: Personal Vitals */}
          <div className="form-sub-section">
            <h4 className="sec-heading"><Scale size={16} /> Personal Vitals & Biometrics</h4>
            <div className="form-grid-4">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="1" 
                  max="120"
                  value={age} 
                  onChange={e => setAge(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select 
                  className="form-input" 
                  value={gender} 
                  onChange={e => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select 
                  className="form-input" 
                  value={bloodGroup} 
                  onChange={e => setBloodGroup(e.target.value)}
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="50" 
                  max="250"
                  value={height} 
                  onChange={e => setHeight(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  step="0.5"
                  min="20" 
                  max="300"
                  value={weight} 
                  onChange={e => setWeight(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact Info</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Name, Relationship & Phone"
                  value={emergencyContact} 
                  onChange={e => setEmergencyContact(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Occupation</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Software Engineer"
                  value={occupation} 
                  onChange={e => setOccupation(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. San Francisco, CA"
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Section: Medical Conditions & Health Info */}
          <div className="form-sub-section">
            <h4 className="sec-heading"><HeartPulse size={16} /> Clinical & Medical Conditions</h4>
            
            <div className="form-group">
              <label className="form-label">
                Diagnosed Health Conditions (comma separated)
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Type 2 Diabetes, Hypertension, Mild Asthma, Healthy Baseline"
                value={conditionsInput} 
                onChange={e => setConditionsInput(e.target.value)} 
              />
              <span className="form-hint">Separate multiple conditions with commas.</span>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Known Allergies (comma separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Penicillin, Peanuts, Sulfa drugs, Latex"
                  value={allergiesInput} 
                  onChange={e => setAllergiesInput(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Active Medications (comma separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Metformin 500mg, Lisinopril 10mg, Albuterol"
                  value={medicationsInput} 
                  onChange={e => setMedicationsInput(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-grid-4">
              <div className="form-group">
                <label className="form-label">Dietary Preference</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Low Carb, Gluten-Free, Vegan"
                  value={dietaryPreference} 
                  onChange={e => setDietaryPreference(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Avg Sleep (hours)</label>
                <input 
                  type="number" 
                  step="0.5"
                  className="form-input" 
                  value={sleepHours} 
                  onChange={e => setSleepHours(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Daily Water Goal (L)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="form-input" 
                  value={waterGoalLiters} 
                  onChange={e => setWaterGoalLiters(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stress Level</label>
                <select 
                  className="form-input" 
                  value={stressLevel} 
                  onChange={e => setStressLevel(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Physician / Medical Notes</label>
              <textarea 
                className="form-input" 
                rows="2"
                placeholder="Doctor recommendations, targets, or precautions..."
                value={doctorNotes} 
                onChange={e => setDoctorNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-footer-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <CheckCircle size={16} />
              <span>{isEdit ? 'Save Changes' : 'Create User Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-component: Import JSON Data Modal
// -------------------------------------------------------------
function ImportDataModal({ onClose, onImport }) {
  const [jsonText, setJsonText] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonText(event.target?.result || '');
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Import Clinical & User Records</h2>
            <p className="modal-subtitle">Upload or paste a JSON array of user records</p>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="file-drop-area">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload} 
              id="json-file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="json-file-input" className="file-drop-label">
              <Upload size={22} className="text-primary" />
              <span>Click to select .JSON file from your computer</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Or Paste JSON Data Directly:</label>
            <textarea
              className="form-input"
              rows={8}
              placeholder="Paste JSON array here... [ { name: '...', email: '...' } ]"
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </div>

          <div className="form-footer-actions">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button 
              className="btn-primary" 
              disabled={!jsonText.trim()}
              onClick={() => onImport(jsonText)}
            >
              <CheckCircle size={16} /> Import Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
