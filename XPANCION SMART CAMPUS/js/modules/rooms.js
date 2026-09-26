/* ==========================================================================
   SmartCampus Room & Laboratory Availability Engine & Door QR Scanner
   ========================================================================== */

let currentRoomTypeFilter = 'all';

function renderRoomsView() {
  const state = window.campusState.data;
  let rooms = state.rooms;

  if (currentRoomTypeFilter !== 'all') {
    rooms = rooms.filter(r => r.type.toLowerCase().includes(currentRoomTypeFilter.toLowerCase()));
  }

  const availableCount = state.rooms.filter(r => r.status === 'available').length;
  const labsCount = state.rooms.filter(r => r.type === 'Laboratory' && r.status === 'available').length;

  return `
    <div class="view-animate-in">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>🏫 Room & Laboratory Real-Time Availability</h2>
          <p>Live occupancy monitoring, conflict-free booking, and doorway QR passes.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-outline" onclick="window.filterAvailableOnly()">
            <span>🟢</span> Available Only (${availableCount})
          </button>
        </div>
      </div>

      <!-- Quick Status Filter Bar -->
      <div class="tabs-nav">
        <button class="tab-btn ${currentRoomTypeFilter === 'all' ? 'active' : ''}" onclick="window.setRoomFilter('all')">
          All Spaces (${state.rooms.length})
        </button>
        <button class="tab-btn ${currentRoomTypeFilter === 'laboratory' ? 'active' : ''}" onclick="window.setRoomFilter('laboratory')">
          Laboratories (${state.rooms.filter(r => r.type === 'Laboratory').length})
        </button>
        <button class="tab-btn ${currentRoomTypeFilter === 'classroom' ? 'active' : ''}" onclick="window.setRoomFilter('classroom')">
          Lecture Halls
        </button>
        <button class="tab-btn ${currentRoomTypeFilter === 'auditorium' ? 'active' : ''}" onclick="window.setRoomFilter('auditorium')">
          Seminar Halls
        </button>
      </div>

      <!-- Rooms Grid -->
      <div class="rooms-grid">
        ${rooms.map(r => `
          <div class="room-card">
            <div class="room-header">
              <div>
                <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">
                  ${r.building} • Floor ${r.floor}
                </span>
                <h3 style="font-size: 1.2rem; margin-top: 0.2rem;">${r.name}</h3>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${r.type} &bull; Capacity: ${r.capacity} seats</span>
              </div>
              <span class="badge ${r.status === 'available' ? 'badge-available' : r.status === 'occupied' ? 'badge-occupied' : 'badge-pending'}">
                <span class="badge-dot"></span> ${r.status.toUpperCase()}
              </span>
            </div>

            <!-- Features -->
            <div class="room-features">
              ${r.features.map(f => `<span class="feature-pill">✦ ${f}</span>`).join('')}
            </div>

            <!-- Booking info banner -->
            <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.8rem;">
              ${r.status === 'occupied' ? `
                <div style="color: #f87171; font-weight: 600;">🔴 Occupied until ${r.currentBooking ? r.currentBooking.until : 'TBD'}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                  ${r.currentBooking ? r.currentBooking.subject + ' (' + r.currentBooking.by + ')' : 'Scheduled Session'}
                </div>
              ` : r.status === 'reserved' ? `
                <div style="color: #fbbf24; font-weight: 600;">🟡 Reserved until ${r.currentBooking ? r.currentBooking.until : 'TBD'}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                  ${r.currentBooking ? r.currentBooking.subject : 'Club / Event'}
                </div>
              ` : `
                <div style="color: #34d399; font-weight: 600;">🟢 Free for reservation right now</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">Next scheduled slot: Open</div>
              `}
            </div>

            <!-- Card Actions -->
            <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem;">
              <button class="btn btn-sm btn-outline" style="flex: 1;" onclick="window.openDoorQRModal('${r.id}')">
                <span>📱</span> Door QR
              </button>
              ${r.status === 'available' ? `
                <button class="btn btn-sm btn-primary" style="flex: 1.3;" onclick="window.openRoomBookingModal('${r.id}')">
                  📅 Request Booking
                </button>
              ` : `
                <button class="btn btn-sm btn-secondary" style="flex: 1.3; opacity: 0.6;" disabled>
                  Unavailable
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.setRoomFilter = function(filter) {
  currentRoomTypeFilter = filter;
  window.appRouter.renderCurrentView();
};

window.filterAvailableOnly = function() {
  const state = window.campusState.data;
  const avail = state.rooms.filter(r => r.status === 'available');
  if (avail.length === 0) {
    window.showToast('No rooms are currently marked available.');
    return;
  }
  currentRoomTypeFilter = 'all';
  window.appRouter.renderCurrentView();
};

// Booking Modal
window.openRoomBookingModal = function(roomId) {
  const room = window.campusState.data.rooms.find(r => r.id === roomId);
  if (!room) return;

  const modalHTML = `
    <div class="modal-backdrop active" id="book-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>📅 Reserve: ${room.name}</h3>
          <button class="modal-close" onclick="window.closeModal('book-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; font-size: 0.82rem;">
            <div>🏢 <b>Building:</b> ${room.building} (Floor ${room.floor})</div>
            <div>👥 <b>Capacity:</b> ${room.capacity} seats</div>
            <div>🛡️ <b>Anti-Double Booking:</b> System validates conflict slot before confirmation.</div>
          </div>

          <form id="book-form" onsubmit="window.submitRoomBooking(event, '${room.id}')">
            <div class="form-group">
              <label class="form-label">Purpose / Event Title *</label>
              <input type="text" class="form-control" id="bk-purpose" placeholder="e.g. Capstone Project Discussion, Robotics Practice" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Date *</label>
                <input type="date" class="form-control" id="bk-date" value="${new Date().toISOString().split('T')[0]}" required />
              </div>

              <div class="form-group">
                <label class="form-label">Until Time *</label>
                <select class="form-select" id="bk-time">
                  <option value="04:30 PM">04:30 PM (1 Hour)</option>
                  <option value="05:30 PM">05:30 PM (2 Hours)</option>
                  <option value="06:30 PM">06:30 PM (3 Hours)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Estimated Attendees</label>
              <input type="number" class="form-control" id="bk-attendees" min="1" max="${room.capacity}" value="15" />
            </div>

            <div class="modal-footer" style="padding-left: 0; padding-right: 0;">
              <button type="button" class="btn btn-secondary" onclick="window.closeModal('book-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">
                Confirm Reservation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

window.submitRoomBooking = function(event, roomId) {
  event.preventDefault();
  const purpose = document.getElementById('bk-purpose').value;
  const timeTo = document.getElementById('bk-time').value;

  const res = window.campusState.bookRoom(roomId, { purpose, timeTo });
  window.closeModal('book-modal');
  if (res.success) {
    window.showToast(`Booking Confirmed for ${res.room.name}!`);
  } else {
    window.showToast(`Error: ${res.message}`);
  }
  window.appRouter.renderCurrentView();
};

// Door QR Scanner Modal (README Section 34.4)
window.openDoorQRModal = function(roomId) {
  const room = window.campusState.data.rooms.find(r => r.id === roomId);
  if (!room) return;

  const modalHTML = `
    <div class="modal-backdrop active" id="door-qr-modal">
      <div class="modal-container" style="max-width: 440px; text-align: center;">
        <div class="modal-header">
          <h3>🚪 Doorway Smart QR</h3>
          <button class="modal-close" onclick="window.closeModal('door-qr-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Placed at the entrance of <b>${room.name}</b>. Students can scan to view live availability and upcoming classes.
          </p>

          <!-- High-Tech SVG QR Code Generator -->
          <div class="qr-code-box">
            <svg viewBox="0 0 100 100" width="160" height="160">
              <!-- Corner Finder Patterns -->
              <rect x="5" y="5" width="25" height="25" fill="#152215" rx="2" />
              <rect x="9" y="9" width="17" height="17" fill="#fff" />
              <rect x="13" y="13" width="9" height="9" fill="#152215" />

              <rect x="70" y="5" width="25" height="25" fill="#152215" rx="2" />
              <rect x="74" y="9" width="17" height="17" fill="#fff" />
              <rect x="78" y="13" width="9" height="9" fill="#152215" />

              <rect x="5" y="70" width="25" height="25" fill="#152215" rx="2" />
              <rect x="9" y="74" width="17" height="17" fill="#fff" />
              <rect x="13" y="78" width="9" height="9" fill="#152215" />

              <!-- Matrix Data Elements -->
              <rect x="35" y="10" width="5" height="5" fill="#759844" />
              <rect x="45" y="15" width="5" height="10" fill="#152215" />
              <rect x="55" y="8" width="8" height="5" fill="#152215" />
              <rect x="38" y="25" width="24" height="6" fill="#ff9f7d" />
              <rect x="10" y="38" width="12" height="5" fill="#152215" />
              <rect x="25" y="42" width="6" height="14" fill="#152215" />
              <rect x="38" y="40" width="24" height="20" fill="#759844" rx="4" />
              <rect x="68" y="38" width="14" height="6" fill="#152215" />
              <rect x="75" y="48" width="15" height="6" fill="#152215" />
              <rect x="35" y="70" width="8" height="8" fill="#152215" />
              <rect x="50" y="75" width="12" height="6" fill="#ff9f7d" />
              <rect x="70" y="70" width="15" height="5" fill="#152215" />
              <rect x="42" y="85" width="16" height="6" fill="#152215" />
            </svg>
          </div>

          <div style="margin-top: 1.25rem; background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md);">
            <div style="font-weight: 800; font-size: 1.1rem;">${room.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Status: <b style="color: ${room.status === 'available' ? '#34d399' : '#f87171'}">${room.status.toUpperCase()}</b>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
              Building: ${room.building} &bull; Capacity: ${room.capacity} seats
            </div>
          </div>
        </div>
        <div class="modal-footer" style="justify-content: center;">
          <button class="btn btn-secondary" onclick="window.closeModal('door-qr-modal')">Close</button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};
