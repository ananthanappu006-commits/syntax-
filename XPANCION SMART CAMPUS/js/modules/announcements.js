/* ==========================================================================
   SmartCampus Announcements & Official Circulars
   ========================================================================== */

function renderAnnouncementsView() {
  const state = window.campusState.data;
  const user = state.currentUser;
  const canPublish = user.role === 'admin' || user.role === 'faculty';

  return `
    <div class="view-animate-in">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>📢 Campus Announcements & Bulletins</h2>
          <p>Official notices from Academic Affairs, Examination Cell, and Administration.</p>
        </div>
        ${canPublish ? `
          <button class="btn btn-primary" onclick="window.openNewAnnouncementModal()">
            <span>➕</span> Publish Announcement
          </button>
        ` : ''}
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        ${state.announcements.map(a => `
          <div class="card" style="border-left: 4px solid ${a.priority === 'urgent' ? 'var(--status-sos)' : a.priority === 'high' ? 'var(--primary)' : 'var(--accent-cyan)'};">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
              <h3 style="font-size: 1.2rem;">${a.title}</h3>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="badge ${a.priority === 'urgent' ? 'badge-danger' : a.priority === 'high' ? 'badge-primary' : 'badge-available'}">
                  ${a.priority.toUpperCase()}
                </span>
                <span class="badge" style="background: var(--bg-surface); color: var(--text-secondary);">
                  🎯 ${a.target}
                </span>
              </div>
            </div>

            <p style="font-size: 0.92rem; line-height: 1.6; margin-bottom: 0.85rem; color: var(--text-primary);">${a.content}</p>

            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
              <span>🏢 Issued by: <b>${a.department}</b></span>
              <span>🕒 ${a.date}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

window.openNewAnnouncementModal = function() {
  const modalHTML = `
    <div class="modal-backdrop active" id="ann-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>📢 Publish Campus Notice</h3>
          <button class="modal-close" onclick="window.closeModal('ann-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <form id="ann-form" onsubmit="window.submitAnnouncementForm(event)">
            <div class="form-group">
              <label class="form-label">Notice Title *</label>
              <input type="text" class="form-control" id="ann-title" placeholder="e.g. Schedule for Mid-Term Lab Examinations" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Issuing Department *</label>
                <input type="text" class="form-control" id="ann-dept" value="${window.campusState.data.currentUser.department}" required />
              </div>

              <div class="form-group">
                <label class="form-label">Priority Level *</label>
                <select class="form-select" id="ann-prio">
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent / Emergency Alert</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Target Audience</label>
              <input type="text" class="form-control" id="ann-target" value="All Students & Faculty" />
            </div>

            <div class="form-group">
              <label class="form-label">Notice Content / Instructions *</label>
              <textarea class="form-textarea" id="ann-content" placeholder="Full notice details..." required></textarea>
            </div>

            <div class="modal-footer" style="padding-left: 0; padding-right: 0;">
              <button type="button" class="btn btn-secondary" onclick="window.closeModal('ann-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">Publish Circular</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

window.submitAnnouncementForm = function(event) {
  event.preventDefault();
  const title = document.getElementById('ann-title').value;
  const department = document.getElementById('ann-dept').value;
  const priority = document.getElementById('ann-prio').value;
  const target = document.getElementById('ann-target').value;
  const content = document.getElementById('ann-content').value;

  const newAnn = {
    id: `ann_${Date.now()}`,
    title: '📢 ' + title,
    department,
    priority,
    target,
    content,
    date: 'Just now'
  };

  window.campusState.data.announcements.unshift(newAnn);
  window.campusState.addNotification({
    title: 'New Announcement Published',
    message: `${title} by ${department}`,
    type: 'announcement'
  });
  window.campusState.saveState();
  window.closeModal('ann-modal');
  window.showToast('Announcement broadcasted to campus network!');
  window.appRouter.renderCurrentView();
};
