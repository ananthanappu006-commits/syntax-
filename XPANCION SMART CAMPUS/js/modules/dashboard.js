/* ==========================================================================
   SmartCampus Liquid Glass Dashboard View (Eduplex Reference Replica)
   Role-Segregated Data & Separate Pages Engine
   ========================================================================== */

function renderDashboardView() {
  const state = window.campusState.data;
  const user = state.currentUser;
  const role = user.role || 'student';

  if (role === 'faculty') {
    return renderFacultyDashboard(state, user);
  } else if (role === 'admin') {
    return renderAdminDashboard(state, user);
  } else if (role === 'security') {
    return renderSecurityDashboard(state, user);
  } else if (role === 'maintenance') {
    return renderMaintenanceDashboard(state, user);
  } else {
    return renderStudentDashboard(state, user);
  }
}

// ==========================================
// 1. STUDENT DASHBOARD
// ==========================================
function renderStudentDashboard(state, user) {
  const availableRooms = state.rooms.filter(r => r.status === 'available').length;
  const availableLabs = state.rooms.filter(r => r.type === 'Laboratory' && r.status === 'available').length;
  const myComplaints = state.complaints.filter(c => c.reportedBy === user.name).length || 1;
  const attendanceRate = state.attendance.overall || 92.4;

  return `
    <div class="view-animate-in">
      <!-- Section 1: Top Reference Highlight Cards (New Courses style) -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">Campus Overview</h3>
        <a href="javascript:void(0)" onclick="window.appRouter.navigate('rooms')" style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">View All</a>
      </div>

      <div class="ref-highlight-grid">
        <div class="ref-highlight-card" onclick="window.appRouter.navigate('rooms')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-peach">🏫</div>
            <div>
              <div class="ref-highlight-title">Available Labs</div>
              <div class="ref-highlight-sub">${availableLabs} Practical Labs Free</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">★ 4.8</span>
              <span class="metric-lbl">High-Speed Rig</span>
            </div>
            <div class="ref-highlight-metric" style="text-align: right;">
              <span class="metric-val">${availableRooms} Rooms</span>
              <span class="metric-lbl">Facilities</span>
            </div>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('attendance')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lime">📊</div>
            <div>
              <div class="ref-highlight-title">Semester Attendance</div>
              <div class="ref-highlight-sub">6th Semester CS</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">★ 5.0</span>
              <span class="metric-lbl">Criteria Met</span>
            </div>
            <div class="ref-highlight-metric" style="text-align: right;">
              <span class="metric-val">${attendanceRate}%</span>
              <span class="metric-lbl">Medical Synced</span>
            </div>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('lost-found')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lavender">🔎</div>
            <div>
              <div class="ref-highlight-title">Lost & Found AI</div>
              <div class="ref-highlight-sub">2 Multimodal Matches</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">★ 4.6</span>
              <span class="metric-lbl">Confidence: 94%</span>
            </div>
            <div class="ref-highlight-metric" style="text-align: right;">
              <span class="metric-val">Ready</span>
              <span class="metric-lbl">Help Desk</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: 3-Column Grid (Hours Activity, Daily Schedule, Right Widgets) -->
      <div class="ref-dashboard-main-grid">
        <!-- Col 1: Hours Activity (Weekly Bar Chart) -->
        <div class="card activity-chart-card">
          <div class="activity-header">
            <div>
              <h3 style="font-size: 1.05rem; margin-bottom: 0.15rem;">Study & Lab Hours</h3>
              <div class="activity-growth-pill">
                <span>↗</span> +3% increase than last week
              </div>
            </div>
            <div class="activity-filter-pill" onclick="window.showToast('Showing Weekly Timetable breakdown')">Weekly ⌵</div>
          </div>

          <div class="activity-chart-bars">
            <div class="activity-chart-col">
              <div class="activity-bar" style="height: 38px;"></div>
              <span class="activity-day-label">Su</span>
            </div>
            <div class="activity-chart-col">
              <div class="activity-bar" style="height: 75px;"></div>
              <span class="activity-day-label">Mo</span>
            </div>
            <div class="activity-chart-col">
              <div class="activity-bar" style="height: 48px;"></div>
              <span class="activity-day-label">Tu</span>
            </div>
            <div class="activity-chart-col">
              <div class="activity-bar" style="height: 60px;"></div>
              <span class="activity-day-label">We</span>
            </div>
            <div class="activity-chart-col">
              <div class="activity-bar active" style="height: 110px;">
                <div class="activity-tooltip">6h 45 min • Today</div>
              </div>
              <span class="activity-day-label" style="font-weight: 800; color: #151821;">Th</span>
            </div>
            <div class="activity-chart-col">
              <div class="activity-bar" style="height: 45px;"></div>
              <span class="activity-day-label">Fr</span>
            </div>
            <div class="activity-chart-col">
              <div class="activity-bar" style="height: 80px;"></div>
              <span class="activity-day-label">Sa</span>
            </div>
          </div>
        </div>

        <!-- Col 2: Daily Schedule (Pastel Square Icons + Title + Chevron) -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Daily Schedule</h3>
            <span class="badge badge-available"><span class="badge-dot"></span> Live</span>
          </div>

          <div class="schedule-list">
            <div class="schedule-item" onclick="window.appRouter.navigate('rooms')">
              <div class="pastel-icon-box pastel-peach">📐</div>
              <div class="schedule-details">
                <div class="schedule-title">Database Systems</div>
                <div class="schedule-sub">Room 204 • Lecture Class</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>

            <div class="schedule-item" onclick="window.appRouter.navigate('rooms')">
              <div class="pastel-icon-box pastel-lavender">💡</div>
              <div class="schedule-details">
                <div class="schedule-title">AI & Robotics Practical</div>
                <div class="schedule-sub">Tech Tower • Lab Practical</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>

            <div class="schedule-item" onclick="window.appRouter.navigate('health')">
              <div class="pastel-icon-box pastel-lime">🩺</div>
              <div class="schedule-details">
                <div class="schedule-title">Health Center OPD Token</div>
                <div class="schedule-sub">Infirmary • Dr. Menon OPD</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>

            <div class="schedule-item" onclick="window.appRouter.navigate('events')">
              <div class="pastel-icon-box pastel-cyan">🎟️</div>
              <div class="schedule-details">
                <div class="schedule-title">Smart Campus Hackathon</div>
                <div class="schedule-sub">Seminar Hall • Group Team</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
          </div>
        </div>

        <!-- Col 3: Right Sidebar Column (Eduplex Go Premium card + Calendar + Assignments) -->
        <div>
          <!-- Dark Feature Card (Eduplex Go Premium Replica) -->
          <div class="dark-feature-card">
            <div style="font-size: 0.72rem; color: var(--accent-lime); font-weight: 800; text-transform: uppercase; margin-bottom: 0.4rem;">
              ✦ SmartCampus AI
            </div>
            <h3>AI Campus Copilot</h3>
            <p>Gemini NLP for free lab searches, lost item matches & rapid dispatch.</p>
            <button class="btn btn-sm btn-lime" onclick="window.toggleAICopilot(true)">
              Launch Copilot
            </button>
          </div>

          <!-- Mini Calendar Widget -->
          <div class="card mini-calendar-card">
            <div class="calendar-header">
              <button class="calendar-nav-btn" onclick="window.showToast('Previous month')">‹</button>
              <span class="calendar-month-title">September, 2026</span>
              <button class="calendar-nav-btn" onclick="window.showToast('Next month')">›</button>
            </div>
            <div class="calendar-grid">
              <div class="calendar-day-header">S</div>
              <div class="calendar-day-header">M</div>
              <div class="calendar-day-header">T</div>
              <div class="calendar-day-header">W</div>
              <div class="calendar-day-header">T</div>
              <div class="calendar-day-header">F</div>
              <div class="calendar-day-header">S</div>

              <div class="calendar-date-cell other-month">30</div>
              <div class="calendar-date-cell other-month">31</div>
              <div class="calendar-date-cell">1</div>
              <div class="calendar-date-cell">2</div>
              <div class="calendar-date-cell">3</div>
              <div class="calendar-date-cell">4</div>
              <div class="calendar-date-cell">5</div>

              <div class="calendar-date-cell">6</div>
              <div class="calendar-date-cell">7</div>
              <div class="calendar-date-cell">8</div>
              <div class="calendar-date-cell">9</div>
              <div class="calendar-date-cell">10</div>
              <div class="calendar-date-cell">11</div>
              <div class="calendar-date-cell">12</div>

              <div class="calendar-date-cell">13</div>
              <div class="calendar-date-cell">14</div>
              <div class="calendar-date-cell">15</div>
              <div class="calendar-date-cell">16</div>
              <div class="calendar-date-cell active-today">17</div>
              <div class="calendar-date-cell">18</div>
              <div class="calendar-date-cell">19</div>

              <div class="calendar-date-cell">20</div>
              <div class="calendar-date-cell">21</div>
              <div class="calendar-date-cell">22</div>
              <div class="calendar-date-cell">23</div>
              <div class="calendar-date-cell">24</div>
              <div class="calendar-date-cell">25</div>
              <div class="calendar-date-cell">26</div>
            </div>
          </div>

          <!-- Assignments & Actions List (Reference: status pills) -->
          <div class="card">
            <div class="card-header" style="margin-bottom: 0.75rem;">
              <h4 style="font-size: 0.95rem;">Assignments & Tasks</h4>
              <span class="badge" style="background: var(--pastel-lime); color: var(--pastel-lime-text); font-weight: 800;">+</span>
            </div>
            <div class="assignment-list">
              <div class="assignment-item">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-size: 1.1rem;">📊</span>
                  <div>
                    <div style="font-size: 0.82rem; font-weight: 700;">DBMS Normalization</div>
                    <div style="font-size: 0.68rem; color: var(--text-muted);">Due 28 Sep, 10:30 AM</div>
                  </div>
                </div>
                <span class="status-pill in-progress">in progress</span>
              </div>

              <div class="assignment-item">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-size: 1.1rem;">🌱</span>
                  <div>
                    <div style="font-size: 0.82rem; font-weight: 700;">Green Campus Survey</div>
                    <div style="font-size: 0.68rem; color: var(--text-muted);">Completed 24 Sep</div>
                  </div>
                </div>
                <span class="status-pill completed">completed</span>
              </div>

              <div class="assignment-item">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-size: 1.1rem;">🍱</span>
                  <div>
                    <div style="font-size: 0.82rem; font-weight: 700;">Canteen Parcel Pickup</div>
                    <div style="font-size: 0.68rem; color: var(--text-muted);">OTP: 5821 • 01:15 PM</div>
                  </div>
                </div>
                <span class="status-pill upcoming">upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Bottom Operations Cards (Course You're Taking style with progress rings) -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">Active Facilities & Bookings</h3>
        <span class="status-pill in-progress">Active ⌵</span>
      </div>

      <div class="ref-bottom-ops-grid">
        <div class="ref-ops-card" onclick="window.appRouter.navigate('rooms')">
          <div class="ref-ops-left">
            <div class="pastel-icon-box pastel-lavender">🤖</div>
            <div>
              <div style="font-size: 0.96rem; font-weight: 700;">AI & Robotics Innovation Lab</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">Reserved by Prof. Rajesh K. • Tech Tower Floor 4</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="text-align: right;">
              <div style="font-size: 0.68rem; color: var(--text-muted);">Remaining</div>
              <div style="font-size: 0.85rem; font-weight: 800;">4h 15 min</div>
            </div>
            <div class="circular-progress-wrap">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(226, 232, 240, 0.8)" stroke-width="4"></circle>
                <circle cx="24" cy="24" r="20" fill="none" stroke="#D5F866" stroke-width="4" stroke-dasharray="125.6" stroke-dashoffset="69"></circle>
              </svg>
              <div class="progress-text">45%</div>
            </div>
          </div>
        </div>

        <div class="ref-ops-card" onclick="window.appRouter.navigate('complaints')">
          <div class="ref-ops-left">
            <div class="pastel-icon-box pastel-peach">🔧</div>
            <div>
              <div style="font-size: 0.96rem; font-weight: 700;">Ticket #CMP-1042: Projector Rm 204</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">Assigned to Lead Tech Suresh Kumar</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="text-align: right;">
              <div style="font-size: 0.68rem; color: var(--text-muted);">Resolution SLA</div>
              <div style="font-size: 0.85rem; font-weight: 800;">45 min left</div>
            </div>
            <div class="circular-progress-wrap">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(226, 232, 240, 0.8)" stroke-width="4"></circle>
                <circle cx="24" cy="24" r="20" fill="none" stroke="#10B981" stroke-width="4" stroke-dasharray="125.6" stroke-dashoffset="31.4"></circle>
              </svg>
              <div class="progress-text">75%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 2. FACULTY DASHBOARD
// ==========================================
function renderFacultyDashboard(state, user) {
  return `
    <div class="view-animate-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">Faculty Academic & Lab Console</h3>
        <span class="badge" style="background: var(--pastel-lavender); color: var(--pastel-lavender-text);">DEPT. ELECTRICAL & ELECTRONICS</span>
      </div>

      <div class="ref-highlight-grid">
        <div class="ref-highlight-card" onclick="window.appRouter.navigate('rooms')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-peach">📚</div>
            <div>
              <div class="ref-highlight-title">Assigned Lectures Today</div>
              <div class="ref-highlight-sub">3 Sessions Scheduled</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">Room 204</span>
              <span class="metric-lbl">Next: 10:30 AM</span>
            </div>
            <span class="status-pill in-progress">In Session</span>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('attendance')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lime">📋</div>
            <div>
              <div class="ref-highlight-title">Student Leave Review</div>
              <div class="ref-highlight-sub">4 Medical Certificates</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">4 Pending</span>
              <span class="metric-lbl">Health Sync Ready</span>
            </div>
            <span class="status-pill upcoming">Needs Sign-off</span>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('rooms')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-cyan">🔬</div>
            <div>
              <div class="ref-highlight-title">Power Systems Lab 1</div>
              <div class="ref-highlight-sub">Reserved for EEE Practical</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">35 Benches</span>
              <span class="metric-lbl">Safety Kits Ready</span>
            </div>
            <span class="status-pill completed">Confirmed</span>
          </div>
        </div>
      </div>

      <div class="ref-dashboard-main-grid">
        <div class="card activity-chart-card">
          <div class="activity-header">
            <div>
              <h3 style="font-size: 1.05rem; margin-bottom: 0.15rem;">Faculty Teaching Load</h3>
              <div class="activity-growth-pill"><span>↗</span> 18.5 Lecture Hours Completed</div>
            </div>
            <div class="activity-filter-pill">Week 4 ⌵</div>
          </div>
          <div class="activity-chart-bars">
            <div class="activity-chart-col"><div class="activity-bar" style="height: 40px;"></div><span class="activity-day-label">Su</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 90px;"></div><span class="activity-day-label">Mo</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 80px;"></div><span class="activity-day-label">Tu</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 100px;"></div><span class="activity-day-label">We</span></div>
            <div class="activity-chart-col"><div class="activity-bar active" style="height: 120px;"><div class="activity-tooltip">4 Classes • Today</div></div><span class="activity-day-label" style="font-weight: 800; color: #151821;">Th</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 70px;"></div><span class="activity-day-label">Fr</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 30px;"></div><span class="activity-day-label">Sa</span></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Today's Class Schedule</h3>
            <span class="badge badge-available">Faculty Roster</span>
          </div>
          <div class="schedule-list">
            <div class="schedule-item">
              <div class="pastel-icon-box pastel-peach">⚡</div>
              <div class="schedule-details">
                <div class="schedule-title">Power Systems Analysis</div>
                <div class="schedule-sub">10:30 AM • Lecture Room 204 (48 Students)</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
            <div class="schedule-item">
              <div class="pastel-icon-box pastel-lime">🔬</div>
              <div class="schedule-details">
                <div class="schedule-title">EEE Hardware Lab Batch A</div>
                <div class="schedule-sub">01:30 PM • Main Block Floor 1</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
            <div class="schedule-item">
              <div class="pastel-icon-box pastel-lavender">👥</div>
              <div class="schedule-details">
                <div class="schedule-title">Department Faculty Committee</div>
                <div class="schedule-sub">03:45 PM • Conference Room B</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
          </div>
        </div>

        <div>
          <div class="dark-feature-card">
            <div style="font-size: 0.72rem; color: var(--accent-lime); font-weight: 800; text-transform: uppercase;">
              ✦ Quick Lab Booking
            </div>
            <h3>Reserve Seminar Hall</h3>
            <p>One-click allocation of 4K projectors, mic arrays & AC for guest lectures.</p>
            <button class="btn btn-sm btn-lime" onclick="window.appRouter.navigate('rooms')">
              Book Room Now
            </button>
          </div>

          <div class="card">
            <div class="card-header" style="margin-bottom: 0.75rem;">
              <h4 style="font-size: 0.95rem;">Pending Student Actions</h4>
            </div>
            <div class="assignment-list">
              <div class="assignment-item">
                <div>
                  <div style="font-size: 0.82rem; font-weight: 700;">Rahul Verma (Viral Fever)</div>
                  <div style="font-size: 0.68rem; color: var(--text-muted);">Medical Leave • 2 Days</div>
                </div>
                <span class="status-pill upcoming">Pending</span>
              </div>
              <div class="assignment-item">
                <div>
                  <div style="font-size: 0.82rem; font-weight: 700;">Ananya M. (Sprain)</div>
                  <div style="font-size: 0.68rem; color: var(--text-muted);">OPD Token #08 Verified</div>
                </div>
                <span class="status-pill completed">Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 3. ADMINISTRATOR DASHBOARD
// ==========================================
function renderAdminDashboard(state, user) {
  return `
    <div class="view-animate-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">Executive Campus Administration</h3>
        <span class="badge" style="background: var(--accent-lime); color: #151821; font-weight: 800;">OFFICE OF THE PRINCIPAL</span>
      </div>

      <div class="ref-highlight-grid">
        <div class="ref-highlight-card" onclick="window.appRouter.navigate('analytics')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-peach">🏢</div>
            <div>
              <div class="ref-highlight-title">Facility Occupancy</div>
              <div class="ref-highlight-sub">6 Blocks Active</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">84.2%</span>
              <span class="metric-lbl">Peak Efficiency</span>
            </div>
            <span class="status-pill completed">Optimal</span>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('complaints')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lime">⚙️</div>
            <div>
              <div class="ref-highlight-title">Maintenance SLA Rate</div>
              <div class="ref-highlight-sub">94% Resolved on-time</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">1.4h</span>
              <span class="metric-lbl">Avg Resolution</span>
            </div>
            <span class="status-pill in-progress">12 Active</span>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('iot-control')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lavender">🌱</div>
            <div>
              <div class="ref-highlight-title">Green Energy Saved</div>
              <div class="ref-highlight-sub">Timetable Auto-Cutoff</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">128.4 kg</span>
              <span class="metric-lbl">CO2 Conserved</span>
            </div>
            <span class="status-pill completed">Sync Active</span>
          </div>
        </div>
      </div>

      <div class="ref-dashboard-main-grid">
        <div class="card activity-chart-card">
          <div class="activity-header">
            <div>
              <h3 style="font-size: 1.05rem; margin-bottom: 0.15rem;">Campus Power & Energy Consumption</h3>
              <div class="activity-growth-pill"><span>↘</span> -14% Energy Conserved via Smart Cutoffs</div>
            </div>
            <div class="activity-filter-pill">Daily Load ⌵</div>
          </div>
          <div class="activity-chart-bars">
            <div class="activity-chart-col"><div class="activity-bar" style="height: 60px;"></div><span class="activity-day-label">Su</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 110px;"></div><span class="activity-day-label">Mo</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 105px;"></div><span class="activity-day-label">Tu</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 115px;"></div><span class="activity-day-label">We</span></div>
            <div class="activity-chart-col"><div class="activity-bar active" style="height: 95px;"><div class="activity-tooltip">48.2 kWh • Normal</div></div><span class="activity-day-label" style="font-weight: 800; color: #151821;">Th</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 90px;"></div><span class="activity-day-label">Fr</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 50px;"></div><span class="activity-day-label">Sa</span></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Executive Agenda</h3>
            <span class="badge badge-primary">Institute Council</span>
          </div>
          <div class="schedule-list">
            <div class="schedule-item">
              <div class="pastel-icon-box pastel-peach">📢</div>
              <div class="schedule-details">
                <div class="schedule-title">Publish End-Semester Circular</div>
                <div class="schedule-sub">Academic Affairs • Push to 3,200 Students</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
            <div class="schedule-item">
              <div class="pastel-icon-box pastel-lime">🛡️</div>
              <div class="schedule-details">
                <div class="schedule-title">Bi-Annual Fire Safety Drill</div>
                <div class="schedule-sub">Security & Facilities Coordinator meeting</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
            <div class="schedule-item">
              <div class="pastel-icon-box pastel-cyan">🏥</div>
              <div class="schedule-details">
                <div class="schedule-title">Infirmary Health Audit Review</div>
                <div class="schedule-sub">Medical exemptions validated for exam roster</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
          </div>
        </div>

        <div>
          <div class="dark-feature-card">
            <div style="font-size: 0.72rem; color: var(--accent-lime); font-weight: 800; text-transform: uppercase;">
              ✦ Institutional Broadcast
            </div>
            <h3>Publish Circular</h3>
            <p>Direct push notification to students, parents, and faculty portals.</p>
            <button class="btn btn-sm btn-lime" onclick="window.appRouter.navigate('announcements')">
              Create Circular
            </button>
          </div>

          <div class="card">
            <div class="card-header" style="margin-bottom: 0.75rem;">
              <h4 style="font-size: 0.95rem;">System Health & Audit</h4>
            </div>
            <div class="assignment-list">
              <div class="assignment-item">
                <div style="font-size: 0.82rem; font-weight: 700;">Prisma ORM DB Status</div>
                <span class="status-pill completed">Synced</span>
              </div>
              <div class="assignment-item">
                <div style="font-size: 0.82rem; font-weight: 700;">MQTT IoT Broker</div>
                <span class="status-pill completed">Connected</span>
              </div>
              <div class="assignment-item">
                <div style="font-size: 0.82rem; font-weight: 700;">Emergency Beacon Ring</div>
                <span class="status-pill in-progress">100% Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 4. SECURITY DASHBOARD
// ==========================================
function renderSecurityDashboard(state, user) {
  return `
    <div class="view-animate-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">Campus Security Command Operations</h3>
        <span class="badge" style="background: var(--status-sos); color: #fff; font-weight: 800;">24/7 ACTIVE DISPATCH</span>
      </div>

      <div class="ref-highlight-grid">
        <div class="ref-highlight-card" onclick="window.appRouter.navigate('sos')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-peach">🚨</div>
            <div>
              <div class="ref-highlight-title">Active SOS Alarms</div>
              <div class="ref-highlight-sub">All 24 Beacons Online</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">0 ACTIVE</span>
              <span class="metric-lbl">Standby Mode</span>
            </div>
            <span class="status-pill completed">Normal</span>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('lost-found')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lime">🔐</div>
            <div>
              <div class="ref-highlight-title">Lost & Found Vault</div>
              <div class="ref-highlight-sub">Security Room 102</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">8 Items</span>
              <span class="metric-lbl">2 Ready for Handover</span>
            </div>
            <span class="status-pill upcoming">Verify ID</span>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('events')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lavender">🎟️</div>
            <div>
              <div class="ref-highlight-title">Gate Pass QR Scanner</div>
              <div class="ref-highlight-sub">Main Entry Gate 1 & 2</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">142 Scans</span>
              <span class="metric-lbl">Visitors Authenticated</span>
            </div>
            <span class="status-pill in-progress">Scanning</span>
          </div>
        </div>
      </div>

      <div class="ref-dashboard-main-grid">
        <div class="card activity-chart-card">
          <div class="activity-header">
            <div>
              <h3 style="font-size: 1.05rem; margin-bottom: 0.15rem;">Gate Ingress & Perimeter Patrols</h3>
              <div class="activity-growth-pill"><span>↗</span> 100% Patrol Checkpoints Completed</div>
            </div>
            <div class="activity-filter-pill">Today ⌵</div>
          </div>
          <div class="activity-chart-bars">
            <div class="activity-chart-col"><div class="activity-bar" style="height: 30px;"></div><span class="activity-day-label">06h</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 70px;"></div><span class="activity-day-label">08h</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 120px;"></div><span class="activity-day-label">10h</span></div>
            <div class="activity-chart-col"><div class="activity-bar active" style="height: 130px;"><div class="activity-tooltip">Peak Rush • 142 Ingress</div></div><span class="activity-day-label" style="font-weight: 800; color: #151821;">12h</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 80px;"></div><span class="activity-day-label">14h</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 90px;"></div><span class="activity-day-label">16h</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 40px;"></div><span class="activity-day-label">18h</span></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Security Duty Log</h3>
            <span class="badge badge-available">Shift Bravo</span>
          </div>
          <div class="schedule-list">
            <div class="schedule-item">
              <div class="pastel-icon-box pastel-peach">🛡️</div>
              <div class="schedule-details">
                <div class="schedule-title">North Perimeter Guard Sweep</div>
                <div class="schedule-sub">All CCTV cameras and fence sensors cleared</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
            <div class="schedule-item">
              <div class="pastel-icon-box pastel-lime">🔍</div>
              <div class="schedule-details">
                <div class="schedule-title">Lost Fossil Wallet Handover</div>
                <div class="schedule-sub">Claimant student matching ID registered</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
          </div>
        </div>

        <div>
          <div class="dark-feature-card" style="background: linear-gradient(135deg, #151821, #2b1117); border: 1px solid rgba(225, 29, 72, 0.4);">
            <div style="font-size: 0.72rem; color: #FDA4AF; font-weight: 800; text-transform: uppercase;">
              ✦ Quick SOS Dispatch
            </div>
            <h3 style="color: #FDA4AF;">Emergency Alert</h3>
            <p>Instant broadcast to campus first-aid, ambulance & fire wards.</p>
            <button class="btn btn-sm btn-danger" onclick="window.openSOSModal()">
              Broadcast SOS
            </button>
          </div>

          <div class="card">
            <div class="card-header" style="margin-bottom: 0.75rem;">
              <h4 style="font-size: 0.95rem;">Gate Security Posts</h4>
            </div>
            <div class="assignment-list">
              <div class="assignment-item">
                <div style="font-size: 0.82rem; font-weight: 700;">Main Gate 1</div>
                <span class="status-pill completed">Guard On Duty</span>
              </div>
              <div class="assignment-item">
                <div style="font-size: 0.82rem; font-weight: 700;">Tech Tower Gate 2</div>
                <span class="status-pill completed">Guard On Duty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 5. MAINTENANCE DASHBOARD
// ==========================================
function renderMaintenanceDashboard(state, user) {
  return `
    <div class="view-animate-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">Facilities & Maintenance Dispatch</h3>
        <span class="badge" style="background: var(--pastel-lime); color: var(--pastel-lime-text); font-weight: 800;">TECH CREW ROSTER</span>
      </div>

      <div class="ref-highlight-grid">
        <div class="ref-highlight-card" onclick="window.appRouter.navigate('complaints')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-peach">🔧</div>
            <div>
              <div class="ref-highlight-title">Urgent Work Orders</div>
              <div class="ref-highlight-sub">Room 204 Projector</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">3 Pending</span>
              <span class="metric-lbl">High Priority</span>
            </div>
            <span class="status-pill in-progress">In Progress</span>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('iot-control')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lime">⚡</div>
            <div>
              <div class="ref-highlight-title">Smart Switch Controls</div>
              <div class="ref-highlight-sub">64 Appliance Nodes</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">18 Active</span>
              <span class="metric-lbl">Energy Load: 12.4 kW</span>
            </div>
            <span class="status-pill completed">MQTT Online</span>
          </div>
        </div>

        <div class="ref-highlight-card" onclick="window.appRouter.navigate('rooms')">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lavender">🪑</div>
            <div>
              <div class="ref-highlight-title">Room Audits</div>
              <div class="ref-highlight-sub">40 Lecture Classrooms</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">98% Fit</span>
              <span class="metric-lbl">Spare Bulbs & AC OK</span>
            </div>
            <span class="status-pill completed">Normal</span>
          </div>
        </div>
      </div>

      <div class="ref-dashboard-main-grid">
        <div class="card activity-chart-card">
          <div class="activity-header">
            <div>
              <h3 style="font-size: 1.05rem; margin-bottom: 0.15rem;">Weekly Repairs & Tickets Closed</h3>
              <div class="activity-growth-pill"><span>↗</span> 28 Tickets Resolved this week</div>
            </div>
            <div class="activity-filter-pill">Week 38 ⌵</div>
          </div>
          <div class="activity-chart-bars">
            <div class="activity-chart-col"><div class="activity-bar" style="height: 30px;"></div><span class="activity-day-label">Su</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 80px;"></div><span class="activity-day-label">Mo</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 95px;"></div><span class="activity-day-label">Tu</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 110px;"></div><span class="activity-day-label">We</span></div>
            <div class="activity-chart-col"><div class="activity-bar active" style="height: 125px;"><div class="activity-tooltip">6 Repaired • Today</div></div><span class="activity-day-label" style="font-weight: 800; color: #151821;">Th</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 60px;"></div><span class="activity-day-label">Fr</span></div>
            <div class="activity-chart-col"><div class="activity-bar" style="height: 40px;"></div><span class="activity-day-label">Sa</span></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Assigned Work Queue</h3>
            <span class="badge badge-available">Crew Lead Suresh</span>
          </div>
          <div class="schedule-list">
            <div class="schedule-item" onclick="window.appRouter.navigate('complaints')">
              <div class="pastel-icon-box pastel-peach">📽️</div>
              <div class="schedule-details">
                <div class="schedule-title">Projector Lamp Replacement</div>
                <div class="schedule-sub">Room 204 • ETA 35 Mins</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
            <div class="schedule-item" onclick="window.appRouter.navigate('complaints')">
              <div class="pastel-icon-box pastel-lime">💧</div>
              <div class="schedule-details">
                <div class="schedule-title">Water Purifier Filter Audit</div>
                <div class="schedule-sub">Main Block Floor 2 • Scheduled</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
            <div class="schedule-item" onclick="window.appRouter.navigate('complaints')">
              <div class="pastel-icon-box pastel-lavender">❄️</div>
              <div class="schedule-details">
                <div class="schedule-title">Tech Tower Seminar AC Thermostat</div>
                <div class="schedule-sub">Tech Tower 3rd Floor • Pending Parts</div>
              </div>
              <div class="schedule-chevron">›</div>
            </div>
          </div>
        </div>

        <div>
          <div class="dark-feature-card">
            <div style="font-size: 0.72rem; color: var(--accent-lime); font-weight: 800; text-transform: uppercase;">
              ✦ IoT Grid Override
            </div>
            <h3>Emergency Lights</h3>
            <p>Force 100% illumination across campus corridors via MQTT topic campus/emergency/override.</p>
            <button class="btn btn-sm btn-lime" onclick="window.appRouter.navigate('iot-control')">
              Manage Switches
            </button>
          </div>

          <div class="card">
            <div class="card-header" style="margin-bottom: 0.75rem;">
              <h4 style="font-size: 0.95rem;">Spare Parts Inventory</h4>
            </div>
            <div class="assignment-list">
              <div class="assignment-item">
                <div style="font-size: 0.82rem; font-weight: 700;">HDMI Cables & Adapters</div>
                <span class="status-pill completed">14 in stock</span>
              </div>
              <div class="assignment-item">
                <div style="font-size: 0.82rem; font-weight: 700;">4K Projector Lamps</div>
                <span class="status-pill in-progress">4 in stock</span>
              </div>
              <div class="assignment-item">
                <div style="font-size: 0.82rem; font-weight: 700;">Fan Regulators</div>
                <span class="status-pill completed">18 in stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.renderDashboardView = renderDashboardView;
