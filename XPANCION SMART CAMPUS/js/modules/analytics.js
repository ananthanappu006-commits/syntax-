/* ==========================================================================
   SmartCampus Admin Analytics & Campus Operations Dashboard
   ========================================================================== */

function renderAnalyticsView() {
  const state = window.campusState.data;

  return `
    <div class="view-animate-in">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>📈 Campus Operations & Infrastructure Analytics</h2>
          <p>Real-time telemetry, service resolution turnaround, and facility utilization.</p>
        </div>
        <button class="btn btn-outline" onclick="window.showToast('Exporting Campus CSV Audit Log...')">
          <span>📥</span> Export Audit Log
        </button>
      </div>

      <!-- KPI Grid (README Section 25) -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon indigo">🎓</div>
          <div class="stat-info">
            <div class="stat-number">1,250</div>
            <div class="stat-label">Enrolled Campus Students</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon emerald">✅</div>
          <div class="stat-info">
            <div class="stat-number">87 / 99</div>
            <div class="stat-label">Complaints Resolved (87.8%)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon amber">⏳</div>
          <div class="stat-info">
            <div class="stat-number">2.4 hrs</div>
            <div class="stat-label">Average Resolution Time</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon cyan">⚡</div>
          <div class="stat-info">
            <div class="stat-number">74%</div>
            <div class="stat-label">Facility Utilization Index</div>
          </div>
        </div>
      </div>

      <!-- Visual Charts Grid -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <!-- Chart 1: Complaints by Category -->
        <div class="analytics-chart-card">
          <div class="card-header">
            <h3 class="card-title">📊 Complaints Distribution by Category</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Current Month</span>
          </div>

          <div class="css-bar-chart">
            <div class="bar-col">
              <span style="font-size: 0.72rem; color: var(--text-primary); font-weight: 700;">38</span>
              <div class="bar-fill" style="height: 75%;"></div>
              <span class="bar-label">Equip</span>
            </div>
            <div class="bar-col">
              <span style="font-size: 0.72rem; color: var(--text-primary); font-weight: 700;">29</span>
              <div class="bar-fill" style="height: 55%; background: linear-gradient(180deg, #f59e0b, #d97706);"></div>
              <span class="bar-label">Elect</span>
            </div>
            <div class="bar-col">
              <span style="font-size: 0.72rem; color: var(--text-primary); font-weight: 700;">18</span>
              <div class="bar-fill" style="height: 38%; background: linear-gradient(180deg, #3b82f6, #1d4ed8);"></div>
              <span class="bar-label">Plumb</span>
            </div>
            <div class="bar-col">
              <span style="font-size: 0.72rem; color: var(--text-primary); font-weight: 700;">24</span>
              <div class="bar-fill" style="height: 48%; background: linear-gradient(180deg, #10b981, #059669);"></div>
              <span class="bar-label">Wi-Fi</span>
            </div>
            <div class="bar-col">
              <span style="font-size: 0.72rem; color: var(--text-primary); font-weight: 700;">11</span>
              <div class="bar-fill" style="height: 25%; background: linear-gradient(180deg, #a855f7, #7c3aed);"></div>
              <span class="bar-label">Furn</span>
            </div>
          </div>
        </div>

        <!-- Chart 2: Space Occupancy Breakdown -->
        <div class="analytics-chart-card">
          <div class="card-header">
            <h3 class="card-title">🏫 Facility Utilization Rates</h3>
            <span class="badge badge-available">Live Sensors</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.35rem;">
                <span>Computer Science & AI Labs</span>
                <b>88% Capacity</b>
              </div>
              <div style="height: 8px; width: 100%; background: rgba(255,255,255,0.06); border-radius: var(--radius-full);">
                <div style="height: 100%; width: 88%; background: var(--primary); border-radius: var(--radius-full);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.35rem;">
                <span>Main Block Classrooms</span>
                <b>72% Capacity</b>
              </div>
              <div style="height: 8px; width: 100%; background: rgba(255,255,255,0.06); border-radius: var(--radius-full);">
                <div style="height: 100%; width: 72%; background: var(--accent-cyan); border-radius: var(--radius-full);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.35rem;">
                <span>Seminar Halls & Auditoriums</span>
                <b>60% Capacity</b>
              </div>
              <div style="height: 8px; width: 100%; background: rgba(255,255,255,0.06); border-radius: var(--radius-full);">
                <div style="height: 100%; width: 60%; background: #a855f7; border-radius: var(--radius-full);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.35rem;">
                <span>Central Library Reading Desks</span>
                <b>94% Capacity</b>
              </div>
              <div style="height: 8px; width: 100%; background: rgba(255,255,255,0.06); border-radius: var(--radius-full);">
                <div style="height: 100%; width: 94%; background: #f59e0b; border-radius: var(--radius-full);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
