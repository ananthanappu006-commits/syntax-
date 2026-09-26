/* ==========================================================================
   SmartCampus Emergency Assistance (SOS) System
   ========================================================================== */

let selectedSOSCategory = 'Medical';

function openSOSModal() {
  const modalHTML = `
    <div class="modal-backdrop active" id="sos-modal">
      <div class="modal-container sos-danger-overlay" style="max-width: 540px;">
        <div class="modal-header" style="background: rgba(244, 63, 94, 0.15); border-bottom-color: rgba(244, 63, 94, 0.3);">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.5rem;">🚨</span>
            <h3 style="color: #fda4af;">Campus Emergency Dispatch (SOS)</h3>
          </div>
          <button class="modal-close" onclick="window.closeModal('sos-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.88rem; color: #fecdd3; line-height: 1.4;">
            This will immediately trigger high-priority alerts across Campus Security, First-Aid station, and duty wardens.
          </p>

          <!-- Emergency Category Picker -->
          <div class="sos-categories-grid">
            <div class="sos-cat-btn ${selectedSOSCategory === 'Medical' ? 'selected' : ''}" onclick="window.selectSOSCategory('Medical')">
              <span class="sos-cat-icon">🚑</span>
              <span style="font-weight: 700; font-size: 0.85rem;">Medical</span>
            </div>
            <div class="sos-cat-btn ${selectedSOSCategory === 'Fire' ? 'selected' : ''}" onclick="window.selectSOSCategory('Fire')">
              <span class="sos-cat-icon">🔥</span>
              <span style="font-weight: 700; font-size: 0.85rem;">Fire / Smoke</span>
            </div>
            <div class="sos-cat-btn ${selectedSOSCategory === 'Electrical Hazard' ? 'selected' : ''}" onclick="window.selectSOSCategory('Electrical Hazard')">
              <span class="sos-cat-icon">⚡</span>
              <span style="font-weight: 700; font-size: 0.85rem;">Electrical</span>
            </div>
            <div class="sos-cat-btn ${selectedSOSCategory === 'Security / Threat' ? 'selected' : ''}" onclick="window.selectSOSCategory('Security / Threat')">
              <span class="sos-cat-icon">🛡️</span>
              <span style="font-weight: 700; font-size: 0.85rem;">Security</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" style="color: #fda4af;">Current Precise Location *</label>
            <select class="form-select" id="sos-location" style="border-color: rgba(244,63,94,0.4);">
              <option value="Main Academic Block, Floor 2 (Near Room 204)">Main Academic Block, Floor 2 (Near Room 204)</option>
              <option value="Tech Tower, 3rd Floor Seminar Hall">Tech Tower, 3rd Floor Seminar Hall</option>
              <option value="Central Library Reading Section">Central Library Reading Section</option>
              <option value="Science Wing Chemistry Lab">Science Wing Chemistry Lab</option>
              <option value="Sports Pavilion / Ground">Sports Pavilion / Ground</option>
              <option value="Student Cafeteria">Student Cafeteria</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" style="color: #fda4af;">Additional Details (Optional)</label>
            <input type="text" class="form-control" id="sos-notes" placeholder="e.g. Student fainted, sparking socket, need stretcher" />
          </div>

          <!-- Misclick protection warning -->
          <div style="background: rgba(0,0,0,0.4); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.75rem; color: #94a3b8; display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
            <span>ℹ️</span> 2-Step Confirmation active to eliminate false alarms.
          </div>
        </div>

        <div class="modal-footer" style="background: rgba(15, 23, 42, 0.8);">
          <button type="button" class="btn btn-secondary" onclick="window.closeModal('sos-modal')">Cancel</button>
          <button type="button" class="btn btn-danger" style="box-shadow: 0 0 20px rgba(244,63,94,0.6);" onclick="window.confirmSOSTrigger()">
            🚨 CONFIRM & DISPATCH NOW
          </button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
}

window.selectSOSCategory = function(cat) {
  selectedSOSCategory = cat;
  const modal = document.getElementById('sos-modal');
  if (modal) {
    modal.querySelectorAll('.sos-cat-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.textContent.includes(cat));
    });
  }
};

window.confirmSOSTrigger = function() {
  const loc = document.getElementById('sos-location').value;
  const notes = document.getElementById('sos-notes').value || 'Immediate assistance requested';

  window.campusState.triggerSOS({
    category: selectedSOSCategory,
    location: loc,
    notes
  });

  window.closeModal('sos-modal');

  // Trigger Full Screen Emergency Banner Alert
  window.showEmergencyBroadcast(selectedSOSCategory, loc);
  window.appRouter.renderCurrentView();
};

window.showEmergencyBroadcast = function(category, location) {
  const alertHTML = `
    <div class="modal-backdrop active" id="sos-broadcast-modal" style="z-index: 10000; background: rgba(15, 5, 10, 0.9);">
      <div class="modal-container" style="max-width: 500px; text-align: center; border-color: #f43f5e; box-shadow: 0 0 50px rgba(244, 63, 94, 0.7);">
        <div class="modal-body" style="padding: 2.5rem 1.5rem;">
          <div style="font-size: 3.5rem; animation: pulse 1s infinite;">🚨</div>
          <h2 style="color: #fda4af; margin: 1rem 0 0.5rem; font-size: 1.6rem;">EMERGENCY ALARM ACTIVE</h2>
          <p style="font-size: 1rem; color: #fff; margin-bottom: 1rem;">
            Category: <b>${category}</b><br/>Location: <b>${location}</b>
          </p>
          <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: #fda4af;">
            Security patrol and medical team have been alerted. Stand by or proceed to the nearest emergency assembly area.
          </div>
          <div style="display: flex; gap: 0.85rem; justify-content: center;">
            <button class="btn btn-secondary" onclick="window.closeModal('sos-broadcast-modal')">
              Acknowledge & Close
            </button>
            <button class="btn btn-outline" onclick="window.showToast('Calling Campus Control: +91 98765 43210...')">
              📞 Direct Call Control
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(alertHTML);
};

window.openSOSModal = openSOSModal;

function renderSOSView() {
  const state = window.campusState.data;
  const sosData = state.sosData || { activeAlarms: [], status: 'Standby' };

  return `
    <div class="view-animate-in">
      <div class="card" style="background: linear-gradient(135deg, rgba(225, 29, 72, 0.12), rgba(244, 63, 94, 0.05)); border: 1px solid rgba(225, 29, 72, 0.35); margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
              <span style="font-size: 1.6rem;">🚨</span>
              <span class="badge" style="background: var(--status-sos); color: #fff;">LIVE DISPATCH HUB</span>
            </div>
            <h2 style="font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 0.25rem;">Campus Emergency Command Center</h2>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">Direct distress coordination across Medical, Security, Fire & Electrical hazard response teams.</p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-sos" onclick="window.openSOSModal()">
              <span>🚨</span> TRIGGER EMERGENCY BEACON
            </button>
          </div>
        </div>
      </div>

      <div class="ref-highlight-grid">
        <div class="ref-highlight-card">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-peach">🚑</div>
            <div>
              <div class="ref-highlight-title">Ambulance & Infirmary</div>
              <div class="ref-highlight-sub">Stationed at Health Center</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">READY</span>
              <span class="metric-lbl">Driver: On Duty (Ext 108)</span>
            </div>
            <span class="status-pill completed">Online</span>
          </div>
        </div>

        <div class="ref-highlight-card">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lime">🛡️</div>
            <div>
              <div class="ref-highlight-title">Security Quick Response</div>
              <div class="ref-highlight-sub">4 Patrol Teams Mobile</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">4 MIN</span>
              <span class="metric-lbl">Average Response Time</span>
            </div>
            <span class="status-pill completed">Active</span>
          </div>
        </div>

        <div class="ref-highlight-card">
          <div class="ref-highlight-top">
            <div class="pastel-icon-box pastel-lavender">🔥</div>
            <div>
              <div class="ref-highlight-title">Fire Safety & Hydrants</div>
              <div class="ref-highlight-sub">Pressure Normal: 6.2 Bar</div>
            </div>
          </div>
          <div class="ref-highlight-bottom">
            <div class="ref-highlight-metric">
              <span class="metric-val">ALL NORMAL</span>
              <span class="metric-lbl">Tech Tower & Blocks</span>
            </div>
            <span class="status-pill in-progress">Inspected</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📡 Live Emergency Beacons & Distress Logs</h3>
          <button class="btn btn-sm btn-outline" onclick="window.showToast('Refreshing emergency telemetry...')">Refresh</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div class="schedule-item">
            <div class="pastel-icon-box pastel-lime">✅</div>
            <div class="schedule-details">
              <div class="schedule-title">System Liveness Check — Normal</div>
              <div class="schedule-sub">All 24 emergency pillars, CCTV feeds, and panic relays reporting operational.</div>
            </div>
            <span class="status-pill completed">Standby</span>
          </div>
          <div class="schedule-item">
            <div class="pastel-icon-box pastel-lavender">ℹ️</div>
            <div class="schedule-details">
              <div class="schedule-title">First Aid Kit & Defibrillator Locations</div>
              <div class="schedule-sub">Main Block 1st Floor, Tech Tower Ground Floor, Student Cafeteria Entrance.</div>
            </div>
            <span class="status-pill in-progress">Audited</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.renderSOSView = renderSOSView;
