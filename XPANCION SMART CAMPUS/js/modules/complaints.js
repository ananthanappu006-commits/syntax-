/* ==========================================================================
   SmartCampus Smart Complaints & Maintenance Pipeline
   ========================================================================== */

function renderComplaintsView() {
  const state = window.campusState.data;
  const user = state.currentUser;
  const isMaintenanceOrAdmin = user.role === 'maintenance' || user.role === 'admin';

  // Group by status
  const submitted = state.complaints.filter(c => c.status === 'submitted');
  const assigned = state.complaints.filter(c => c.status === 'assigned');
  const inProgress = state.complaints.filter(c => c.status === 'in_progress');
  const resolved = state.complaints.filter(c => c.status === 'resolved' || c.status === 'closed');

  return `
    <div class="view-animate-in">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>📝 Smart Complaints & Maintenance Center</h2>
          <p>Automated AI routing assigns facilities, IT, and electrical tickets directly to technicians.</p>
        </div>
        <button class="btn btn-primary" onclick="window.openNewComplaintModal()">
          <span>⚡</span> Report Campus Issue
        </button>
      </div>

      <!-- Pipeline Kanban Board -->
      <div class="complaints-pipeline">
        <!-- 1. Submitted -->
        <div class="pipeline-col">
          <div class="pipeline-header">
            <span style="font-weight: 700; color: #fbbf24;">📥 Submitted</span>
            <span class="pipeline-count">${submitted.length}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${submitted.map(c => renderComplaintCard(c, isMaintenanceOrAdmin)).join('')}
            ${submitted.length === 0 ? '<p style="font-size: 0.8rem; text-align: center; color: var(--text-muted); margin-top: 1rem;">No new complaints</p>' : ''}
          </div>
        </div>

        <!-- 2. In Diagnostics / Assigned -->
        <div class="pipeline-col">
          <div class="pipeline-header">
            <span style="font-weight: 700; color: var(--accent-cyan);">⚙️ Assigned</span>
            <span class="pipeline-count">${assigned.length}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${assigned.map(c => renderComplaintCard(c, isMaintenanceOrAdmin)).join('')}
            ${assigned.length === 0 ? '<p style="font-size: 0.8rem; text-align: center; color: var(--text-muted); margin-top: 1rem;">All tickets routed</p>' : ''}
          </div>
        </div>

        <!-- 3. Work In Progress -->
        <div class="pipeline-col">
          <div class="pipeline-header">
            <span style="font-weight: 700; color: var(--primary-light);">🔧 In Progress</span>
            <span class="pipeline-count">${inProgress.length}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${inProgress.map(c => renderComplaintCard(c, isMaintenanceOrAdmin)).join('')}
            ${inProgress.length === 0 ? '<p style="font-size: 0.8rem; text-align: center; color: var(--text-muted); margin-top: 1rem;">No ongoing repairs</p>' : ''}
          </div>
        </div>

        <!-- 4. Resolved -->
        <div class="pipeline-col">
          <div class="pipeline-header">
            <span style="font-weight: 700; color: #34d399;">✅ Resolved</span>
            <span class="pipeline-count">${resolved.length}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${resolved.map(c => renderComplaintCard(c, isMaintenanceOrAdmin)).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderComplaintCard(ticket, isMaintenanceOrAdmin) {
  const prioColors = {
    urgent: '#f43f5e',
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return `
    <div class="ticket-card" onclick="window.viewTicketDetails('${ticket.id}')">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">#${ticket.id}</span>
        <span class="ticket-priority-tag" style="color: ${prioColors[ticket.priority] || '#94a3b8'};">
          ● ${ticket.priority.toUpperCase()}
        </span>
      </div>

      <h5 style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin: 0.1rem 0;">${ticket.title}</h5>

      <div style="font-size: 0.75rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.2rem;">
        <div>📍 ${ticket.location}</div>
        <div>🏢 ${ticket.department}</div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px solid var(--border-subtle); font-size: 0.72rem;">
        <span style="color: var(--text-muted);">👤 ${ticket.reportedBy}</span>
        <span style="color: var(--primary-light);">Details →</span>
      </div>
    </div>
  `;
}

// Modal for Creating New Complaint with AI Live Classification
window.openNewComplaintModal = function() {
  const modalHTML = `
    <div class="modal-backdrop active" id="complaint-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>📝 Report Campus Maintenance Issue</h3>
          <button class="modal-close" onclick="window.closeModal('complaint-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <form id="complaint-form" onsubmit="window.submitComplaintForm(event)">
            <div class="form-group">
              <label class="form-label">Issue Title / Summary *</label>
              <input type="text" class="form-control" id="cmp-title" placeholder="e.g. Projector lamp dead in Room 204" oninput="window.handleAIComplaintTyping(this.value)" required />
            </div>

            <!-- Dynamic AI Classification Card -->
            <div id="ai-classify-preview" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.1rem; display: none;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                <span style="font-size: 1.1rem;">🤖</span>
                <strong style="color: var(--primary-light); font-size: 0.85rem;">Gemini AI Real-time Classification</strong>
              </div>
              <div id="ai-classify-details" style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;"></div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Building / Specific Location *</label>
                <input type="text" class="form-control" id="cmp-location" placeholder="e.g. Room 204, Main Block" required />
              </div>

              <div class="form-group">
                <label class="form-label">Department *</label>
                <select class="form-select" id="cmp-dept" required>
                  <option value="Electrical Maintenance">Electrical Maintenance</option>
                  <option value="Plumbing & Facilities">Plumbing & Facilities</option>
                  <option value="IT & Networking">IT & Networking (NOC)</option>
                  <option value="Estate & Carpentry">Estate & Carpentry</option>
                  <option value="Audiovisual Support">Audiovisual Support</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Category *</label>
                <select class="form-select" id="cmp-cat" required>
                  <option value="Equipment">Equipment</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Network">Wi-Fi & Network</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Priority</label>
                <select class="form-select" id="cmp-priority">
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Detailed Notes / Symptoms</label>
              <textarea class="form-textarea" id="cmp-desc" placeholder="Describe symptoms or when the issue started..." required></textarea>
            </div>

            <div class="modal-footer" style="padding-left: 0; padding-right: 0;">
              <button type="button" class="btn btn-secondary" onclick="window.closeModal('complaint-modal')">Cancel</button>
              <button type="submit" class="btn btn-primary">
                <span>🚀</span> Dispatch Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

// Real-time AI auto-classification as user types
window.handleAIComplaintTyping = function(text) {
  const preview = document.getElementById('ai-classify-preview');
  const details = document.getElementById('ai-classify-details');
  if (!text || text.length < 5) {
    if (preview) preview.style.display = 'none';
    return;
  }

  const aiGuess = window.campusAI.autoClassifyComplaint(text);
  if (preview && details) {
    preview.style.display = 'block';
    details.innerHTML = `
      Detected Category: <b style="color:#fff">${aiGuess.category}</b> &bull; Routing to: <b style="color:#fff">${aiGuess.department}</b> &bull; Priority: <b style="color:var(--status-pending)">${aiGuess.priority.toUpperCase()}</b>
    `;

    // Auto update selects
    const deptSelect = document.getElementById('cmp-dept');
    const prioSelect = document.getElementById('cmp-priority');
    if (deptSelect && aiGuess.department.includes('Electrical')) deptSelect.value = 'Electrical Maintenance';
    if (deptSelect && aiGuess.department.includes('Plumbing')) deptSelect.value = 'Plumbing & Facilities';
    if (deptSelect && aiGuess.department.includes('IT')) deptSelect.value = 'IT & Networking';
    if (prioSelect) prioSelect.value = aiGuess.priority;
  }
};

window.submitComplaintForm = function(event) {
  event.preventDefault();
  const title = document.getElementById('cmp-title').value;
  const location = document.getElementById('cmp-location').value;
  const department = document.getElementById('cmp-dept').value;
  const category = document.getElementById('cmp-cat').value;
  const priority = document.getElementById('cmp-priority').value;
  const description = document.getElementById('cmp-desc').value;

  window.campusState.addComplaint({
    title,
    location,
    department,
    category,
    priority,
    description
  });

  window.closeModal('complaint-modal');
  window.showToast(`Issue logged! Ticket automatically routed to ${department}.`);
  window.appRouter.renderCurrentView();
};

// Ticket Detail & Technician Pipeline Controls
window.viewTicketDetails = function(ticketId) {
  const ticket = window.campusState.data.complaints.find(c => c.id === ticketId);
  if (!ticket) return;

  const modalHTML = `
    <div class="modal-backdrop active" id="ticket-modal">
      <div class="modal-container">
        <div class="modal-header">
          <div>
            <h3>#${ticket.id}: ${ticket.title}</h3>
            <span class="badge ${ticket.status === 'resolved' ? 'badge-available' : 'badge-primary'}" style="margin-top: 0.3rem;">
              STATUS: ${ticket.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <button class="modal-close" onclick="window.closeModal('ticket-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-primary);">${ticket.description}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-top: 0.85rem; font-size: 0.8rem; color: var(--text-secondary); border-top: 1px solid var(--border-subtle); padding-top: 0.6rem;">
              <div>📍 <b>Location:</b> ${ticket.location}</div>
              <div>🏢 <b>Dept:</b> ${ticket.department}</div>
              <div>👤 <b>Reported By:</b> ${ticket.reportedBy}</div>
              <div>🔧 <b>Assigned:</b> ${ticket.assignedTo}</div>
            </div>
          </div>

          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;">Audit & Action Timeline</h4>
          <div style="display: flex; flex-direction: column; gap: 0.6rem; padding-left: 0.5rem; border-left: 2px solid var(--border-card);">
            ${ticket.timeline.map(t => `
              <div style="font-size: 0.82rem; position: relative; padding-left: 0.8rem;">
                <span style="position: absolute; left: -0.95rem; top: 0.3rem; width: 8px; height: 8px; border-radius: 50%; background: var(--primary);"></span>
                <span style="color: var(--text-muted); font-size: 0.75rem;">${t.time}</span> — <span>${t.text}</span>
              </div>
            `).join('')}
          </div>

          <!-- Maintenance / Admin Status Updater -->
          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
            <label class="form-label">Technician Actions (Update Pipeline)</label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.4rem;">
              <button class="btn btn-sm btn-outline" onclick="window.updateTicket('${ticket.id}', 'assigned', 'Assigned to duty technician')">
                Mark Assigned
              </button>
              <button class="btn btn-sm btn-outline" onclick="window.updateTicket('${ticket.id}', 'in_progress', 'Technician on-site fixing issue')">
                Mark In Progress
              </button>
              <button class="btn btn-sm btn-primary" onclick="window.updateTicket('${ticket.id}', 'resolved', 'Component repaired and tested')">
                ✅ Mark Resolved & Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

window.updateTicket = function(id, status, notes) {
  window.campusState.updateComplaintStatus(id, status, notes);
  window.closeModal('ticket-modal');
  window.showToast(`Ticket #${id} status updated to ${status.toUpperCase()}!`);
  window.appRouter.renderCurrentView();
};
