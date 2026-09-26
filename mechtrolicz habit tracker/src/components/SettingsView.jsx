import React, { useState } from 'react';
import { 
  User, Bell, Volume2, Download, Upload, RotateCcw, ShieldCheck, Check, 
  Moon, Sun, BellRing, BellOff, HeartPulse, Stethoscope, Scale, Droplet, 
  Apple, Phone, MapPin, Briefcase, AlertTriangle, Pill
} from 'lucide-react';
import { getInitialData, savePlannerData } from '../utils/storage';
import { soundEffects } from '../utils/audio';
import { syncActiveUserToDirectory, calculateBMI } from '../utils/userDirectory';

export default function SettingsView({
  data, setData, theme, toggleTheme,
  onRequestNotificationPermission,
  onFireTestNotification,
  notificationPermission
}) {
  // Identity
  const [name, setName] = useState(data.user.name || '');
  const [email, setEmail] = useState(data.user.email || '');
  const [title, setTitle] = useState(data.user.levelTitle || '');
  const [phone, setPhone] = useState(data.user.phone || '+1 (555) 382-9014');

  // Personal Vitals
  const [age, setAge] = useState(data.user.personal?.age ?? 28);
  const [gender, setGender] = useState(data.user.personal?.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(data.user.personal?.bloodGroup || 'O+');
  const [height, setHeight] = useState(data.user.personal?.height ?? 178);
  const [weight, setWeight] = useState(data.user.personal?.weight ?? 74);
  const [emergencyContact, setEmergencyContact] = useState(data.user.personal?.emergencyContact || 'Elena Rivera (Sister) - +1 (555) 902-1423');
  const [occupation, setOccupation] = useState(data.user.personal?.occupation || 'Lead Systems Architect');
  const [location, setLocation] = useState(data.user.personal?.location || 'San Francisco, CA');

  // Health Conditions & Medical
  const [conditionsInput, setConditionsInput] = useState(
    (data.user.health?.conditions || ['Mild Seasonal Asthma', 'Occasional Tension Headaches']).join(', ')
  );
  const [allergiesInput, setAllergiesInput] = useState(
    (data.user.health?.allergies || ['Peanuts (mild)', 'Penicillin']).join(', ')
  );
  const [medicationsInput, setMedicationsInput] = useState(
    (data.user.health?.medications || ['Albuterol Inhaler (PRN)', 'Daily Multivitamin & Omega-3']).join(', ')
  );
  const [dietaryPreference, setDietaryPreference] = useState(
    data.user.health?.dietaryPreference || 'High Protein / Mediterranean'
  );
  const [sleepHours, setSleepHours] = useState(data.user.health?.sleepHours ?? 7.5);
  const [waterGoalLiters, setWaterGoalLiters] = useState(data.user.health?.waterGoalLiters ?? 3.0);
  const [stressLevel, setStressLevel] = useState(data.user.health?.stressLevel || 'Moderate');
  const [doctorNotes, setDoctorNotes] = useState(
    data.user.health?.doctorNotes || 'BP normal (118/76). Keep up cardiovascular conditioning and hydration.'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live BMI calculation
  const { bmi, category: bmiCategory } = calculateBMI(parseFloat(height), parseFloat(weight));

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const parseList = (str) =>
      str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

    const updatedUserData = {
      ...data.user,
      name,
      email,
      phone,
      levelTitle: title,
      personal: {
        age: parseInt(age, 10) || 25,
        gender,
        bloodGroup,
        height: parseFloat(height) || 170,
        weight: parseFloat(weight) || 70,
        emergencyContact,
        occupation,
        location
      },
      health: {
        conditions: parseList(conditionsInput),
        allergies: parseList(allergiesInput),
        medications: parseList(medicationsInput),
        dietaryPreference,
        sleepHours: parseFloat(sleepHours) || 7.0,
        waterGoalLiters: parseFloat(waterGoalLiters) || 2.5,
        stressLevel,
        doctorNotes
      }
    };

    setData(prev => ({
      ...prev,
      user: updatedUserData
    }));

    // Synchronize to the admin repository
    syncActiveUserToDirectory(updatedUserData, data.habits || []);

    soundEffects.playSuccess();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `habit_routine_planner_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.habits && parsed.user) {
            setData(parsed);
            savePlannerData(parsed);
            soundEffects.playSuccess();
            alert('Planner data imported successfully!');
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset all habits, schedules, and completions back to rich demo dataset?')) {
      const initial = getInitialData();
      setData(initial);
      savePlannerData(initial);
      soundEffects.playSuccess();
    }
  };

  return (
    <div className="settings-page animate-fade" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Settings & Preferences</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your account profile, sound preferences, notifications, and data backups
        </p>
      </div>

      {/* Theme & Notifications Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
              <Bell size={20} />
            </div>
            <div>
              <h3 className="card-title">Appearance & Notifications</h3>
              <p className="card-subtitle">Theme, reminder alerts, and browser notifications</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '0 4px 4px' }}>
          {/* Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-surface-elevated)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {theme === 'dark' ? <Moon size={20} style={{ color: '#a78bfa' }} /> : <Sun size={20} style={{ color: '#f59e0b' }} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dark Mode</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Currently: {theme === 'dark' ? 'Dark' : 'Light'} theme</div>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                width: 52, height: 28, borderRadius: 20, border: 'none', cursor: 'pointer',
                background: theme === 'dark' ? 'var(--primary)' : 'var(--border-subtle)',
                position: 'relative', transition: 'background 0.25s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: theme === 'dark' ? 26 : 3,
                width: 22, height: 22, borderRadius: '50%', background: '#fff',
                transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>

          {/* Notification Permission */}
          <div style={{ padding: '14px 16px', background: 'var(--bg-surface-elevated)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {notificationPermission === 'granted'
                  ? <BellRing size={20} style={{ color: '#10b981' }} />
                  : <BellOff size={20} style={{ color: '#ef4444' }} />
                }
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Habit Reminders</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Status: <strong style={{ color: notificationPermission === 'granted' ? '#10b981' : notificationPermission === 'denied' ? '#ef4444' : '#f59e0b' }}>
                      {notificationPermission === 'granted' ? '✅ Active' : notificationPermission === 'denied' ? '❌ Blocked' : notificationPermission === 'unsupported' ? '⚠️ Not supported' : '⏳ Not enabled'}
                    </strong>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    onClick={onRequestNotificationPermission}
                  >
                    Enable
                  </button>
                )}
                {notificationPermission === 'granted' && (
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    onClick={onFireTestNotification}
                  >
                    Test Notification
                  </button>
                )}
              </div>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              {notificationPermission === 'granted'
                ? '🔔 You will receive browser notifications at each habit\'s reminder time. The app checks every 30 seconds.'
                : notificationPermission === 'denied'
                ? '🚫 Notifications are blocked in your browser. Open browser settings → Site Settings → Notifications to re-enable.'
                : '🔔 Enable browser notifications to get reminded when it\'s time to complete a habit.'}
            </p>
          </div>

          {/* Sound Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-surface-elevated)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Volume2 size={20} style={{ color: '#6366f1' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sound Effects</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completion chimes and interaction sounds</div>
              </div>
            </div>
            <button
              onClick={() => setData(prev => ({ ...prev, user: { ...prev.user, soundEnabled: !prev.user.soundEnabled } }))}
              style={{
                width: 52, height: 28, borderRadius: 20, border: 'none', cursor: 'pointer',
                background: data.user.soundEnabled ? 'var(--primary)' : 'var(--border-subtle)',
                position: 'relative', transition: 'background 0.25s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: data.user.soundEnabled ? 26 : 3,
                width: 22, height: 22, borderRadius: '50%', background: '#fff',
                transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Personal Data & Health Conditions Form Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <h3 className="card-title">Personal Data & Health Conditions</h3>
              <p className="card-subtitle">Biometrics, medical history, vitals, and emergency information</p>
            </div>
          </div>
          {bmi && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 20, border: '1px solid var(--border-subtle)', fontSize: '0.82rem', fontWeight: 700 }}>
              <Scale size={14} style={{ color: '#06b6d4' }} />
              <span>BMI: <strong>{bmi}</strong></span>
              <span className={`bmi-badge bmi-${bmiCategory.toLowerCase().replace(' ', '-')}`} style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                {bmiCategory}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Sub-section 1: Identity & Contact */}
          <div style={{ padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} style={{ color: 'var(--primary)' }} />
              1. Basic Identity & Contact
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Productivity Title / Bio</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Systems Architect"
                />
              </div>
            </div>
          </div>

          {/* Sub-section 2: Personal Vitals & Emergency */}
          <div style={{ padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Scale size={16} style={{ color: '#06b6d4' }} />
              2. Personal Vitals & Biometrics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className="form-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender</label>
                <select
                  className="form-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Blood Group</label>
                <select
                  className="form-input"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  className="form-input"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  min="20"
                  max="300"
                  className="form-input"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Emergency Contact (Name & Phone)</label>
                <input
                  type="text"
                  className="form-input"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Elena Rivera (Sister) - +1 (555) 902-1423"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location / City</label>
                <input
                  type="text"
                  className="form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Occupation</label>
                <input
                  type="text"
                  className="form-input"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Systems Architect"
                />
              </div>
            </div>
          </div>

          {/* Sub-section 3: Clinical & Health Conditions */}
          <div style={{ padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Stethoscope size={16} style={{ color: '#f43f5e' }} />
              3. Clinical Conditions & Health Profile
            </h4>

            <div className="form-group">
              <label className="form-label">
                Diagnosed Health Conditions / Chronic Conditions
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Type 2 Diabetes, Hypertension, Mild Asthma, Healthy Baseline"
                value={conditionsInput}
                onChange={(e) => setConditionsInput(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                Separate multiple conditions with commas. Stored securely and visible in Admin portal.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Known Allergies</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Peanuts, Penicillin, Dust mites, Sulfa drugs"
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current Medications & Dosages</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Albuterol Inhaler (PRN), Metformin 500mg"
                  value={medicationsInput}
                  onChange={(e) => setMedicationsInput(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 14 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Dietary Preference</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. High Protein, Keto, Vegan"
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Avg Sleep (hours/night)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Daily Water Goal (L)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={waterGoalLiters}
                  onChange={(e) => setWaterGoalLiters(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Stress Level</label>
                <select
                  className="form-input"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 14, marginBottom: 0 }}>
              <label className="form-label">Doctor Recommendations / Health Notes</label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="Doctor instructions, blood pressure targets, restrictions..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
              <Check size={18} />
              <span>Save Personal & Health Profile</span>
            </button>
            {savedSuccess && (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: 700 }}>
                <Check size={18} /> Profile & Health Data Saved Successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* App Preferences */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Bell size={20} />
            </div>
            <div>
              <h3 className="card-title">Notifications & Sound</h3>
              <p className="card-subtitle">Auditory and reminder configurations</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Audio Feedback (Web Audio Chimes)</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Play pleasant harmonic chime on habit check and celebration sounds on level up
              </div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                soundEffects.enabled = !data.user.soundEnabled;
                setData(prev => ({
                  ...prev,
                  user: { ...prev.user, soundEnabled: soundEffects.enabled }
                }));
                if (soundEffects.enabled) soundEffects.playSuccess();
              }}
            >
              {data.user.soundEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Theme Mode</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Currently using {theme === 'dark' ? 'Midnight Dark' : 'Clean Light'} theme
              </div>
            </div>
            <button className="btn-secondary" onClick={toggleTheme}>
              Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="card-title">Data Storage & Portability</h3>
              <p className="card-subtitle">Export or restore your habit data at any time</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={handleExportData}>
            <Download size={16} />
            <span>Export Backup JSON</span>
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>Import Backup JSON</span>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportData}
            />
          </label>

          <button
            className="btn-outline-danger"
            style={{ marginLeft: 'auto' }}
            onClick={handleResetSampleData}
          >
            <RotateCcw size={16} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
