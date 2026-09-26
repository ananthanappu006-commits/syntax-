/* ==========================================================================
   SmartCampus Events & QR Check-In System
   ========================================================================== */

function renderEventsView() {
  const state = window.campusState.data;
  const events = state.events;

  return `
    <div class="view-animate-in">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>📅 Campus Events & Technical Workshops</h2>
          <p>Register for hackathons, guest lectures, and cultural fests with instant digital QR passes.</p>
        </div>
      </div>

      <div class="events-grid">
        ${events.map(e => `
          <div class="event-card">
            <div class="event-banner">
              <span>${e.bannerIcon || '🎉'}</span>
              <div class="event-date-badge">
                <div class="event-date-day">${e.date.split(' ')[0]}</div>
                <div class="event-date-month">${e.date.split(' ')[1]}</div>
              </div>
            </div>

            <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span class="badge badge-primary">${e.category}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">👥 ${e.registeredCount} / ${e.capacity} Seats</span>
              </div>

              <h3 style="font-size: 1.15rem;">${e.title}</h3>
              <p style="font-size: 0.84rem; line-height: 1.4; color: var(--text-secondary);">${e.description}</p>

              <div style="font-size: 0.78rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle);">
                <div>📍 <b>Venue:</b> ${e.location}</div>
                <div>🕒 <b>Timing:</b> ${e.time}</div>
                <div>🏛️ <b>Organizer:</b> ${e.organizer}</div>
              </div>

              <!-- Action Bar -->
              <div style="display: flex; gap: 0.6rem; margin-top: 0.5rem;">
                ${e.isRegistered ? `
                  <button class="btn btn-sm btn-outline" style="flex: 1;" onclick="window.openEventQRPass('${e.id}')">
                    <span>📱</span> View QR Pass
                  </button>
                  <button class="btn btn-sm btn-secondary" style="flex: 1;" onclick="window.toggleRegistration('${e.id}')">
                    Cancel Registration
                  </button>
                ` : `
                  <button class="btn btn-sm btn-primary" style="width: 100%;" onclick="window.toggleRegistration('${e.id}')">
                    🎟️ Register for Event
                  </button>
                `}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.toggleRegistration = function(eventId) {
  window.campusState.toggleEventRegistration(eventId);
  window.appRouter.renderCurrentView();
};

// Digital QR Pass Modal (README Section 12)
window.openEventQRPass = function(eventId) {
  const state = window.campusState.data;
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  const modalHTML = `
    <div class="modal-backdrop active" id="event-pass-modal">
      <div class="modal-container" style="max-width: 420px; text-align: center;">
        <div class="modal-header">
          <h3>🎟️ Official Event Entry Pass</h3>
          <button class="modal-close" onclick="window.closeModal('event-pass-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid #bfdbfe; border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: #1d4ed8; letter-spacing: 0.1em; font-weight: 800;">
              SMARTCAMPUS VERIFIED PASS
            </div>
            <h4 style="font-size: 1.2rem; margin: 0.4rem 0; color: #0f172a;">${event.title}</h4>
            <div style="font-size: 0.82rem; color: #334155;">
              Attendee: <b>${state.currentUser.name}</b> (${state.currentUser.studentId || 'FACULTY'})
            </div>
            
            <!-- Digital QR -->
            <div class="qr-code-box" style="margin: 1rem auto; width: 170px; height: 170px; background: #ffffff; border: 1px solid #bfdbfe; border-radius: var(--radius-md);">
              <svg viewBox="0 0 100 100" width="140" height="140">
                <rect x="5" y="5" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="9" y="9" width="17" height="17" fill="#fff" />
                <rect x="13" y="13" width="9" height="9" fill="#1e3a8a" />
                <rect x="70" y="5" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="74" y="9" width="17" height="17" fill="#fff" />
                <rect x="78" y="13" width="9" height="9" fill="#1e3a8a" />
                <rect x="5" y="70" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="9" y="74" width="17" height="17" fill="#fff" />
                <rect x="13" y="78" width="9" height="9" fill="#1e3a8a" />
                <rect x="35" y="10" width="10" height="10" fill="#2563eb" />
                <rect x="50" y="15" width="15" height="5" fill="#1e3a8a" />
                <rect x="35" y="35" width="30" height="30" fill="#3b82f6" rx="4" />
                <rect x="70" y="50" width="15" height="8" fill="#1e3a8a" />
                <rect x="40" y="75" width="20" height="10" fill="#2563eb" />
              </svg>
            </div>

            <div style="font-size: 0.78rem; color: var(--text-muted);">
              📍 ${event.location} &bull; 🕒 ${event.date}
            </div>
          </div>

          <p style="font-size: 0.78rem; color: var(--text-muted);">
            Show this QR code at the seminar hall door scanner for contactless attendance check-in.
          </p>
        </div>
        <div class="modal-footer" style="justify-content: center;">
          <button class="btn btn-secondary" onclick="window.closeModal('event-pass-modal')">Done</button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};
