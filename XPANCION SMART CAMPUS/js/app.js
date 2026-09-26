/* ==========================================================================
   SmartCampus Main Application Controller, Router & RBAC Permission Engine
   ========================================================================== */

// Role Definitions & Granular Route Access Control
const ROLE_CONFIG = {
  student: {
    id: 'student',
    name: 'Kasinadh S.',
    roleTitle: 'Student Portal',
    avatar: '👨‍🎓',
    department: 'Computer Science & Engineering',
    allowedRoutes: [
      { route: 'dashboard', label: 'Dashboard', icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>' },
      { route: 'rooms', label: 'Rooms & Labs', icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>', badge: 'Live' },
      { route: 'complaints', label: 'Complaints & Help', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>' },
      { route: 'lost-found', label: 'Lost & Found', icon: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>' },
      { route: 'map', label: 'Campus Map', icon: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>' },
      { route: 'events', label: 'Events & Pass', icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>' },
      { route: 'announcements', label: 'Announcements', icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>' },
      { route: 'attendance', label: 'My Attendance', icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>' },
      { route: 'cafeteria', label: 'Smart Cafeteria', icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line>' },
      { route: 'health', label: 'Health & Infirmary', icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>' },
      { route: 'sos', label: 'Emergency SOS', icon: '<polygon points="12 2 2 22 22 22 12 2"></polygon><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' }
    ],
    defaultRoute: 'dashboard'
  },
  faculty: {
    id: 'faculty',
    name: 'Prof. KS Adhithiyan',
    roleTitle: 'Faculty Portal',
    avatar: '👨‍🏫',
    department: 'Dept. of Electrical & Electronics',
    allowedRoutes: [
      { route: 'dashboard', label: 'Dashboard', icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>' },
      { route: 'rooms', label: 'Reserve Labs & Halls', icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>', badge: 'Book' },
      { route: 'attendance', label: 'Class Attendance & Leaves', icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', badge: 'Review' },
      { route: 'complaints', label: 'Lab Equipment Repair', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>' },
      { route: 'announcements', label: 'Circulars & Notices', icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>' },
      { route: 'events', label: 'Seminars & Events', icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>' },
      { route: 'map', label: 'Campus Map', icon: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>' },
      { route: 'cafeteria', label: 'Faculty Dining', icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line>', badge: 'Priority' },
      { route: 'health', label: 'Staff Clinic (OPD)', icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>', badge: 'Doctor' },
      { route: 'sos', label: 'Emergency SOS', icon: '<polygon points="12 2 2 22 22 22 12 2"></polygon><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' }
    ],
    defaultRoute: 'dashboard'
  },
  admin: {
    id: 'admin',
    name: 'Principal Aleena S.',
    roleTitle: 'Executive Administration',
    avatar: '🧑‍💼',
    department: 'Office of the Principal',
    allowedRoutes: [
      { route: 'dashboard', label: 'Executive Dashboard', icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>' },
      { route: 'analytics', label: 'Analytics & Telemetry', icon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>', badge: 'KPIs' },
      { route: 'announcements', label: 'Circulars & Push Alerts', icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>', badge: 'Publish' },
      { route: 'rooms', label: 'Campus Space Allocations', icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>' },
      { route: 'complaints', label: 'Ticket Escalations & SLAs', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>' },
      { route: 'attendance', label: 'Institution Attendance', icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>' },
      { route: 'health', label: 'Infirmary Audit & Leaves', icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>', badge: 'Audit' },
      { route: 'iot-control', label: 'Campus IoT & Energy Grid', icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>', badge: 'Grid' },
      { route: 'events', label: 'Institute Event Approvals', icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>' },
      { route: 'map', label: 'Master Campus Map', icon: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>' },
      { route: 'sos', label: 'Emergency Incident Logs', icon: '<polygon points="12 2 2 22 22 22 12 2"></polygon><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>', badge: 'Logs' }
    ],
    defaultRoute: 'dashboard'
  },
  security: {
    id: 'security',
    name: 'Chief Saranya R.S',
    roleTitle: 'Security Command Center',
    avatar: '🛡️',
    department: 'Campus Central Security',
    allowedRoutes: [
      { route: 'dashboard', label: 'Security Dashboard', icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>', badge: 'Live' },
      { route: 'sos', label: 'Emergency SOS Dispatch', icon: '<polygon points="12 2 2 22 22 22 12 2"></polygon><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>', badge: 'Active' },
      { route: 'lost-found', label: 'Lost & Found Vault', icon: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>', badge: 'Custody' },
      { route: 'map', label: 'Perimeter & CCTV Map', icon: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>', badge: 'GPS' },
      { route: 'events', label: 'Gate Access & QR Pass', icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>', badge: 'Gate' }
    ],
    defaultRoute: 'dashboard'
  },
  maintenance: {
    id: 'maintenance',
    name: 'Lead Tech Suresh Kumar',
    roleTitle: 'Facilities & Maintenance',
    avatar: '🧑‍🔧',
    department: 'Infrastructure & Facilities',
    allowedRoutes: [
      { route: 'dashboard', label: 'Work Orders Dashboard', icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>', badge: 'Queue' },
      { route: 'complaints', label: 'Tickets & Repairs', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>', badge: 'Action' },
      { route: 'iot-control', label: 'Smart Switches & HVAC', icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>', badge: 'Hardware' },
      { route: 'rooms', label: 'Facility Inspection', icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>', badge: 'Audits' },
      { route: 'map', label: 'Utilities Map', icon: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>', badge: 'Grid' },
      { route: 'sos', label: 'Emergency Safety Hub', icon: '<polygon points="12 2 2 22 22 22 12 2"></polygon><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>', badge: 'Alerts' }
    ],
    defaultRoute: 'dashboard'
  }
};

window.ROLE_CONFIG = ROLE_CONFIG;

class AppRouter {
  constructor() {
    this.currentRoute = 'dashboard';
    this.routes = {
      auth: typeof renderAuthView !== 'undefined' ? renderAuthView : () => '',
      'profile-setup': typeof renderProfileSetupView !== 'undefined' ? renderProfileSetupView : () => '',
      dashboard: renderDashboardView,
      'lost-found': renderLostFoundView,
      complaints: renderComplaintsView,
      rooms: renderRoomsView,
      map: renderMapView,
      events: renderEventsView,
      announcements: renderAnnouncementsView,
      attendance: renderAttendanceView,
      cafeteria: renderCafeteriaView,
      health: renderHealthView,
      'iot-control': renderIoTControlView,
      analytics: renderAnalyticsView,
      sos: renderSOSView
    };
  }

  navigate(route) {
    const isPublicRoute = route === 'auth' || route === 'profile-setup';

    if (!isPublicRoute) {
      const currentRole = window.campusState.data.currentUser.role || 'student';
      const config = ROLE_CONFIG[currentRole] || ROLE_CONFIG.student;
      
      // Strict RBAC Enforcement: check if route is authorized for current role
      const isAllowed = config.allowedRoutes.some(r => r.route === route);

      if (!isAllowed) {
        this.renderAccessDeniedView(route, config);
        return;
      }
    }

    if (!this.routes[route]) {
      console.warn(`Route ${route} not found, defaulting to dashboard.`);
      route = 'dashboard';
    }

    this.currentRoute = route;

    // Toggle full-screen layout for dedicated authentication & details onboarding
    const isAuthPage = route === 'auth' || route === 'profile-setup';
    const sidebar = document.getElementById('app-sidebar');
    const header = document.querySelector('.app-header');
    const aiBubble = document.querySelector('.ai-copilot-bubble');
    const appRoot = document.getElementById('app-root');
    const mainEl = document.querySelector('.app-main');

    if (sidebar) sidebar.style.display = isAuthPage ? 'none' : 'flex';
    if (header) header.style.display = isAuthPage ? 'none' : 'flex';
    if (aiBubble) aiBubble.style.display = isAuthPage ? 'none' : 'flex';
    if (appRoot) appRoot.style.display = isAuthPage ? 'block' : 'flex';
    if (mainEl) {
      mainEl.style.width = isAuthPage ? '100vw' : '';
      mainEl.style.height = isAuthPage ? '100vh' : '';
      mainEl.style.padding = isAuthPage ? '0' : '';
    }

    this.renderCurrentView();

    // Update active nav-link in dynamic sidebar
    if (!isAuthPage) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.route === route);
      });
    }

    // Scroll to top
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentView() {
    const container = document.getElementById('view-container');
    if (!container) return;
    const viewFn = this.routes[this.currentRoute];
    if (viewFn) {
      container.innerHTML = viewFn();
    }
  }

  renderAccessDeniedView(attemptedRoute, config) {
    const container = document.getElementById('view-container');
    if (!container) return;

    container.innerHTML = `
      <div class="view-animate-in">
        <div class="access-denied-card">
          <div class="access-denied-icon">🔒</div>
          <h2 style="font-family: var(--font-display);">Feature Restricted to Authorized Roles</h2>
          <p>
            The module <b>"${attemptedRoute.toUpperCase()}"</b> is strictly isolated and cannot be accessed by your current role (<b>${config.roleTitle}</b>).
          </p>
          <div style="background: rgba(225, 29, 72, 0.08); border: 1px solid rgba(225, 29, 72, 0.2); border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.82rem; color: #E11D48;">
            🛡️ Role-Based Access Control (RBAC) ensures student privacy, security incident confidentiality, and facilities protection.
          </div>
          <button class="btn btn-lime" onclick="window.appRouter.navigate('dashboard')">
            ← Return to ${config.roleTitle} Dashboard
          </button>
        </div>
      </div>
    `;

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  }
}

// Global Single Instance
window.appRouter = new AppRouter();

// Dynamic Sidebar Navigation Generator based on Role
window.renderSidebarNav = function() {
  const sidebarNavEl = document.getElementById('sidebar-nav');
  if (!sidebarNavEl) return;

  const currentRole = window.campusState.data.currentUser.role || 'student';
  const config = ROLE_CONFIG[currentRole] || ROLE_CONFIG.student;

  sidebarNavEl.innerHTML = config.allowedRoutes.map(item => `
    <div class="nav-link ${window.appRouter.currentRoute === item.route ? 'active' : ''}" 
         data-route="${item.route}" 
         onclick="window.appRouter.navigate('${item.route}')">
      <span class="nav-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${item.icon}
        </svg>
      </span>
      <span>${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </div>
  `).join('');

  // Update bottom widget in sidebar
  const bottomWidget = document.getElementById('sidebar-bottom-widget');
  if (bottomWidget) {
    bottomWidget.innerHTML = `
      <div class="widget-arrow">↗</div>
      <h4>${config.roleTitle}</h4>
      <p>Active session authenticated. ${config.allowedRoutes.length} authorized tools online.</p>
    `;
    bottomWidget.onclick = () => window.appRouter.navigate('dashboard');
  }

  // Update Header Welcome Title
  const headerWelcomeEl = document.getElementById('header-welcome-title');
  if (headerWelcomeEl) {
    headerWelcomeEl.innerHTML = `Welcome back, ${config.name} 👋`;
  }
};

// Toast Engine
window.showToast = function(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="font-size: 1.2rem;">🔔</span>
    <div style="flex: 1; font-weight: 600;">${msg}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Modal Manager
window.appendModalToDOM = function(html) {
  const existing = document.getElementById('modal-outlet');
  if (existing) {
    existing.innerHTML = html;
  } else {
    const div = document.createElement('div');
    div.id = 'modal-outlet';
    div.innerHTML = html;
    document.body.appendChild(div);
  }
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 250);
  }
};

// Universal Header Search
window.handleUniversalSearch = function(event) {
  if (event.key === 'Enter') {
    const val = event.target.value.trim().toLowerCase();
    if (!val) return;

    const currentRole = window.campusState.data.currentUser.role || 'student';
    const config = ROLE_CONFIG[currentRole] || ROLE_CONFIG.student;
    const canAccess = (route) => config.allowedRoutes.some(r => r.route === route);

    if ((val.includes('room') || val.includes('lab') || val.includes('hall')) && canAccess('rooms')) {
      window.appRouter.navigate('rooms');
      window.showToast(`Displaying room & lab status for: "${val}"`);
    } else if ((val.includes('lost') || val.includes('found') || val.includes('wallet')) && canAccess('lost-found')) {
      window.appRouter.navigate('lost-found');
      window.showToast(`Searching Lost & Found records...`);
    } else if ((val.includes('complaint') || val.includes('broken') || val.includes('repair')) && canAccess('complaints')) {
      window.appRouter.navigate('complaints');
      window.showToast(`Opening Maintenance center for: "${val}"`);
    } else if ((val.includes('map') || val.includes('locate') || val.includes('building')) && canAccess('map')) {
      window.appRouter.navigate('map');
      window.showToast(`Locating building on Campus Map...`);
    } else if ((val.includes('food') || val.includes('cafeteria') || val.includes('order')) && canAccess('cafeteria')) {
      window.appRouter.navigate('cafeteria');
      window.showToast(`Opening Smart Cafeteria...`);
    } else if ((val.includes('doctor') || val.includes('opd') || val.includes('health')) && canAccess('health')) {
      window.appRouter.navigate('health');
      window.showToast(`Opening Health & Infirmary center...`);
    } else {
      window.toggleAICopilot(true);
      window.sendAICopilotMessage(val);
    }
  }
};

// AI Copilot Toggle & Interaction
window.toggleAICopilot = function(forceOpen = null) {
  const drawer = document.getElementById('ai-drawer');
  if (!drawer) return;
  const isOpen = forceOpen !== null ? forceOpen : !drawer.classList.contains('open');
  drawer.classList.toggle('open', isOpen);
  if (isOpen) {
    setTimeout(() => {
      const input = document.getElementById('ai-copilot-input');
      if (input) input.focus();
    }, 200);
  }
};

window.sendAICopilotMessage = function(overrideText = null) {
  const input = document.getElementById('ai-copilot-input');
  const chatBody = document.getElementById('ai-chat-body');
  const text = overrideText || (input ? input.value.trim() : '');
  if (!text) return;

  if (input) input.value = '';

  // Render User Message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = text;
  chatBody.appendChild(userBubble);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Process AI Response
  setTimeout(() => {
    const result = window.campusAI.processQuery(text);
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    aiBubble.innerHTML = result.text.replace(/\n/g, '<br/>');

    if (result.action) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-lime';
      btn.style.marginTop = '0.6rem';
      btn.style.width = '100%';
      btn.textContent = result.action.label;
      btn.onclick = () => {
        if (result.action.isSOS) {
          window.openSOSModal();
        } else if (result.action.view) {
          window.appRouter.navigate(result.action.view);
          window.toggleAICopilot(false);
        }
      };
      aiBubble.appendChild(btn);
    }

    chatBody.appendChild(aiBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 400);
};

// Notification Dropdown Center
window.toggleNotificationCenter = function() {
  const state = window.campusState.data;
  const notifs = state.notifications || [];

  const modalHTML = `
    <div class="modal-backdrop active" id="notif-modal">
      <div class="modal-container" style="max-width: 480px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <h3>🔔 Campus Notifications</h3>
            <span class="badge badge-primary">${notifs.filter(n => n.unread).length} New</span>
          </div>
          <button class="modal-close" onclick="window.closeModal('notif-modal')">&times;</button>
        </div>
        <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${notifs.map(n => `
              <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border-left: 3px solid ${n.type === 'sos' ? 'var(--status-sos)' : n.type === 'lost_found' ? '#34d399' : '#151821'};">
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                  <b>${n.title}</b>
                  <span>${n.time || 'Today'}</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-primary); line-height: 1.4;">${n.message}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="modal-footer" style="justify-content: space-between;">
          <button class="btn btn-sm btn-outline" onclick="window.campusState.markNotificationsRead(); window.closeModal('notif-modal'); window.appRouter.renderCurrentView();">
            Mark All as Read
          </button>
          <button class="btn btn-sm btn-secondary" onclick="window.closeModal('notif-modal')">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

// Role Switcher Handler (Separate pages & features per role)
window.handleRoleSwitch = function(newRole) {
  window.campusState.switchRole(newRole);
  const config = ROLE_CONFIG[newRole] || ROLE_CONFIG.student;
  window.showToast(`Switched view to ${config.roleTitle.toUpperCase()}`);

  // Re-render sidebar navigation for strictly segregated features
  window.renderSidebarNav();

  // If user was on a page not allowed for new role, redirect to dashboard
  const isStillAllowed = config.allowedRoutes.some(r => r.route === window.appRouter.currentRoute);
  if (!isStillAllowed) {
    window.appRouter.navigate('dashboard');
  } else {
    window.appRouter.renderCurrentView();
  }
};

// Theme Engine (Dark & Light Mode)
window.initTheme = function() {
  const savedTheme = localStorage.getItem('smartcampus_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  window.updateThemeIcon(savedTheme);
};

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  if (newTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  localStorage.setItem('smartcampus_theme', newTheme);
  window.updateThemeIcon(newTheme);
  window.showToast(`Theme switched to ${newTheme.toUpperCase()}`);
};

window.updateThemeIcon = function(theme) {
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
};

// Application Startup Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  window.initTheme();
  window.renderSidebarNav();

  const hash = window.location.hash.replace('#', '');
  if (hash === 'auth') {
    window.appRouter.navigate('auth');
  } else if (hash === 'profile-setup') {
    window.appRouter.navigate('profile-setup');
  } else if (hash && window.appRouter.routes[hash]) {
    window.appRouter.navigate(hash);
  } else {
    const hasSession = localStorage.getItem('smartcampus_active_user');
    if (hasSession) {
      window.appRouter.navigate('dashboard');
    } else {
      window.appRouter.navigate('auth');
    }
  }
});
