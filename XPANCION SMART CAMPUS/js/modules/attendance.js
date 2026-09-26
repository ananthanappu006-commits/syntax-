/* ==========================================================================
   SmartCampus Attendance Management
   ========================================================================== */

function renderAttendanceView() {
  const state = window.campusState.data;
  const user = state.currentUser;
  const att = state.attendance;
  const isFaculty = user.role === 'faculty';

  return `
    <div class="view-animate-in">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>📊 Academic Attendance Tracker</h2>
          <p>${isFaculty ? 'Faculty roster session recording and student deficit monitoring.' : 'Personal course attendance monitoring against 75% institutional cutoff.'}</p>
        </div>
        ${isFaculty ? `
          <button class="btn btn-primary" onclick="window.openMarkAttendanceModal()">
            <span>📝</span> Take Class Attendance
          </button>
        ` : ''}
      </div>

      <!-- Quick Summary Card -->
      <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9)); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-cyan); font-weight: 700;">
              ACADEMIC YEAR 2026 • ODD SEMESTER
            </span>
            <h3 style="font-size: 1.6rem; margin-top: 0.2rem;">Cumulative Attendance: ${att.overall}%</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Minimum requirement: 75.0% for end-semester examination eligibility.</p>
          </div>
          <div style="display: flex; gap: 1rem;">
            <div style="text-align: center; background: var(--bg-surface); padding: 0.8rem 1.2rem; border-radius: var(--radius-md);">
              <div style="font-size: 1.4rem; font-weight: 800; color: #34d399;">5 / 5</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Subjects Above Cutoff</div>
            </div>
            <div style="text-align: center; background: var(--bg-surface); padding: 0.8rem 1.2rem; border-radius: var(--radius-md);">
              <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary-light);">154 / 166</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Total Lectures Attended</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject Table / Cards -->
      <div class="card">
        <h3 class="card-title" style="margin-bottom: 1.25rem;">Course Breakdown</h3>
        <div style="display: flex; flex-direction: column; gap: 1.2rem;">
          ${att.subjects.map(s => {
            const isGood = s.percentage >= 85;
            const isNearWarning = s.percentage < 85 && s.percentage >= 75;
            return `
              <div style="background: var(--bg-surface); padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
                  <div>
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">${s.code}</span>
                    <h4 style="font-size: 1.05rem; margin-top: 0.1rem;">${s.name}</h4>
                  </div>
                  <div style="text-align: right;">
                    <span class="badge ${isGood ? 'badge-available' : isNearWarning ? 'badge-pending' : 'badge-danger'}">
                      ${s.percentage.toFixed(1)}%
                    </span>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                      ${s.attended} of ${s.total} sessions
                    </div>
                  </div>
                </div>

                <!-- Custom Progress Bar -->
                <div style="height: 8px; width: 100%; background: rgba(255,255,255,0.06); border-radius: var(--radius-full); overflow: hidden; position: relative;">
                  <div style="height: 100%; width: ${s.percentage}%; background: ${isGood ? 'linear-gradient(90deg, #10b981, #06b6d4)' : isNearWarning ? '#f59e0b' : '#ef4444'}; border-radius: var(--radius-full);"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// Faculty Mode: Take Attendance Modal
window.openMarkAttendanceModal = function() {
  const modalHTML = `
    <div class="modal-backdrop active" id="mark-att-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>📝 Record Session Attendance</h3>
          <button class="modal-close" onclick="window.closeModal('mark-att-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--bg-surface); padding: 0.8rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.85rem;">
            Course: <b>CS302 - Operating Systems & Architecture</b> &bull; Room 204
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm);">
              <span>CS2023-884 - KASINADH.S</span>
              <button class="btn btn-sm btn-outline" style="color: #34d399;" onclick="this.textContent = this.textContent === 'Present' ? 'Absent' : 'Present'">Present</button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm);">
              <span>CS2023-885 - Ananya Sen</span>
              <button class="btn btn-sm btn-outline" style="color: #34d399;" onclick="this.textContent = this.textContent === 'Present' ? 'Absent' : 'Present'">Present</button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm);">
              <span>CS2023-886 - Rohan Verma</span>
              <button class="btn btn-sm btn-outline" style="color: #f87171;" onclick="this.textContent = this.textContent === 'Present' ? 'Absent' : 'Present'">Absent</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('mark-att-modal')">Cancel</button>
          <button class="btn btn-primary" onclick="window.closeModal('mark-att-modal'); window.showToast('Attendance recorded for 38 students!');">
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};
