/* ==========================================================================
   SmartCampus Lost & Found Module with AI Matching
   ========================================================================== */

let currentLFTypeFilter = 'all'; // all | lost | found | matched

function renderLostFoundView() {
  const state = window.campusState.data;
  let items = state.lostFound;

  if (currentLFTypeFilter === 'lost') {
    items = items.filter(i => i.type === 'lost');
  } else if (currentLFTypeFilter === 'found') {
    items = items.filter(i => i.type === 'found');
  } else if (currentLFTypeFilter === 'matched') {
    items = items.filter(i => i.status === 'matched');
  }

  // Count matches
  const matchCount = state.lostFound.filter(i => i.status === 'matched').length;

  return `
    <div class="view-animate-in">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>🔎 Lost & Found Smart Hub</h2>
          <p>Report misplaced personal belongings and leverage AI vision & semantic matching.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-outline" onclick="window.openLostFoundModal('found')">
            <span>➕</span> Report Found Item
          </button>
          <button class="btn btn-primary" onclick="window.openLostFoundModal('lost')">
            <span>📢</span> Report Lost Item
          </button>
        </div>
      </div>

      <!-- AI Match Alert Banner (Demo Scenario from README Section 36) -->
      ${matchCount > 0 ? `
        <div class="match-banner">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 2rem;">✨</div>
            <div>
              <strong style="color: #34d399; font-size: 1rem;">AI Match Detected: Black Leather Fossil Wallet</strong>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
                Lost report by <em>Rohan Verma</em> matches Found report at <em>Library Help Desk</em> with <strong>94% Confidence</strong>.
              </p>
            </div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="window.openVerifyClaimModal('LF-8801', 'LF-8802')">
            Verify & Claim Details
          </button>
        </div>
      ` : ''}

      <!-- Filter Tabs -->
      <div class="tabs-nav">
        <button class="tab-btn ${currentLFTypeFilter === 'all' ? 'active' : ''}" onclick="window.setLFFilter('all')">
          All Belongings (${state.lostFound.length})
        </button>
        <button class="tab-btn ${currentLFTypeFilter === 'lost' ? 'active' : ''}" onclick="window.setLFFilter('lost')">
          Lost Items
        </button>
        <button class="tab-btn ${currentLFTypeFilter === 'found' ? 'active' : ''}" onclick="window.setLFFilter('found')">
          Found Items
        </button>
        <button class="tab-btn ${currentLFTypeFilter === 'matched' ? 'active' : ''}" onclick="window.setLFFilter('matched')">
          ✨ AI Matched Pairs (${matchCount})
        </button>
      </div>

      <!-- Items Grid -->
      <div class="items-grid">
        ${items.map(item => `
          <div class="item-card">
            <div class="item-card-image">
              <span style="font-size: 3.5rem;">${item.icon || '📦'}</span>
              <div class="item-badge-pill">
                <span class="badge ${item.type === 'lost' ? 'badge-danger' : 'badge-available'}">
                  ${item.type.toUpperCase()}
                </span>
                ${item.status === 'matched' ? '<span class="badge badge-primary" style="margin-left: 4px;">AI MATCHED</span>' : ''}
              </div>
              <div class="item-time-pill">
                🕒 ${item.date} • ${item.time}
              </div>
            </div>

            <div class="item-card-body">
              <h4 style="font-size: 1.05rem;">${item.title}</h4>
              <p style="font-size: 0.84rem; flex: 1; line-height: 1.4;">${item.description}</p>
              
              <div class="item-meta" style="margin-top: 0.5rem; padding-top: 0.6rem; border-top: 1px solid var(--border-subtle);">
                <span>📍 ${item.location}</span>
                <span>🏷️ ${item.category}</span>
              </div>

              <div style="margin-top: 0.85rem; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Reported by ${item.reportedBy}</span>
                ${item.status === 'matched' ? `
                  <button class="btn btn-sm btn-outline" onclick="window.openVerifyClaimModal('${item.id}', '${item.matchedWithId}')">
                    Inspect Match
                  </button>
                ` : `
                  <button class="btn btn-sm btn-secondary" onclick="window.claimItemPrompt('${item.id}')">
                    ${item.type === 'lost' ? 'I Found This' : 'Claim Item'}
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

// Filter Switcher
window.setLFFilter = function(filter) {
  currentLFTypeFilter = filter;
  window.appRouter.renderCurrentView();
};

// Modal for Reporting Lost / Found
window.openLostFoundModal = function(type = 'lost') {
  const modalHTML = `
    <div class="modal-backdrop active" id="lf-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>${type === 'lost' ? '📢 Report Lost Belonging' : '✨ Report Found Object'}</h3>
          <button class="modal-close" onclick="window.closeModal('lf-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <form id="lf-form" onsubmit="window.submitLostFoundForm(event, '${type}')">
            <div class="form-group">
              <label class="form-label">Item Name *</label>
              <input type="text" class="form-control" id="lf-title" placeholder="e.g. Blue Dell Laptop Charger, Silver Casio Watch" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Category *</label>
                <select class="form-select" id="lf-category" required>
                  <option value="Personal Belongings">Personal Belongings (Wallet, Bag)</option>
                  <option value="Electronics">Electronics (Phone, Charger, Laptop)</option>
                  <option value="ID Cards & Documents">College ID / Documents</option>
                  <option value="Keys">Keys & Keychains</option>
                  <option value="Drinkware">Bottles & Drinkware</option>
                  <option value="Clothing">Jackets / Umbrellas</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Location on Campus *</label>
                <input type="text" class="form-control" id="lf-location" placeholder="e.g. Library 2nd Floor, Room 204" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Detailed Description / Identifying Marks *</label>
              <textarea class="form-textarea" id="lf-desc" placeholder="Mention stickers, scratches, colors, contents. (AI will match these against reports)" required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Item Emoji Icon</label>
              <div style="display: flex; gap: 0.5rem; font-size: 1.5rem; cursor: pointer;">
                <label><input type="radio" name="icon" value="👛" checked /> 👛</label>
                <label><input type="radio" name="icon" value="📱" /> 📱</label>
                <label><input type="radio" name="icon" value="💻" /> 💻</label>
                <label><input type="radio" name="icon" value="🔑" /> 🔑</label>
                <label><input type="radio" name="icon" value="🎒" /> 🎒</label>
                <label><input type="radio" name="icon" value="🍶" /> 🍶</label>
              </div>
            </div>

            <div class="modal-footer" style="padding-left: 0; padding-right: 0; margin-top: 1rem;">
              <button type="button" class="btn btn-secondary" onclick="window.closeModal('lf-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">
                <span>🤖</span> Submit & Run AI Match
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

window.submitLostFoundForm = function(event, type) {
  event.preventDefault();
  const title = document.getElementById('lf-title').value;
  const category = document.getElementById('lf-category').value;
  const location = document.getElementById('lf-location').value;
  const description = document.getElementById('lf-desc').value;
  const icon = document.querySelector('input[name="icon"]:checked')?.value || '📦';

  const newItem = window.campusState.addLostFoundItem({
    type,
    title,
    category,
    location,
    description,
    icon
  });

  window.closeModal('lf-modal');
  window.showToast(`Report logged successfully. AI is scanning matching objects across campus!`);
  window.appRouter.renderCurrentView();
};

// Verification & Claim Modal (README Section 22 & 36)
window.openVerifyClaimModal = function(id1, id2) {
  const state = window.campusState.data;
  const item1 = state.lostFound.find(i => i.id === id1) || state.lostFound[0];
  const item2 = state.lostFound.find(i => i.id === id2) || state.lostFound[1];

  const modalHTML = `
    <div class="modal-backdrop active" id="claim-modal">
      <div class="modal-container" style="max-width: 680px;">
        <div class="modal-header">
          <h3>✨ AI Match Verification Center</h3>
          <button class="modal-close" onclick="window.closeModal('claim-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.85rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <strong style="color: #34d399;">Match Confidence: 94%</strong>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Per security policy (Section 7), identifying details are safeguarded. Claimant must prove possession or identity before custody release.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <span class="badge badge-danger" style="margin-bottom: 0.5rem;">LOST REPORT</span>
              <h4 style="font-size: 1rem;">${item1.title}</h4>
              <p style="font-size: 0.8rem; margin: 0.4rem 0;">${item1.description}</p>
              <div style="font-size: 0.75rem; color: var(--text-muted);">
                <div>📍 Reported at: ${item1.location}</div>
                <div>👤 Owner: ${item1.reportedBy}</div>
              </div>
            </div>

            <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <span class="badge badge-available" style="margin-bottom: 0.5rem;">FOUND REPORT</span>
              <h4 style="font-size: 1rem;">${item2.title}</h4>
              <p style="font-size: 0.8rem; margin: 0.4rem 0;">${item2.description}</p>
              <div style="font-size: 0.75rem; color: var(--text-muted);">
                <div>📍 Custody at: ${item2.location}</div>
                <div>🛡️ Logged by: ${item2.reportedBy}</div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Proof of Ownership / Verification Details</label>
            <input type="text" class="form-control" placeholder="e.g. Student ID number CS2023-884, card expiration date, photo" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeModal('claim-modal')">Close</button>
          <button class="btn btn-primary" onclick="window.confirmClaimSuccess('${item1.id}', '${item2.id}')">
            ✅ Confirm Verification & Mark Returned
          </button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

window.confirmClaimSuccess = function(id1, id2) {
  const state = window.campusState.data;
  const it1 = state.lostFound.find(i => i.id === id1);
  const it2 = state.lostFound.find(i => i.id === id2);
  if (it1) it1.status = 'returned';
  if (it2) it2.status = 'returned';
  window.campusState.saveState();
  window.closeModal('claim-modal');
  window.showToast('Item verified! Custody updated to RETURNED.');
  window.appRouter.renderCurrentView();
};

window.claimItemPrompt = function(id) {
  window.showToast('Please visit Central Security Desk or use Verify Match to claim custody.');
};
