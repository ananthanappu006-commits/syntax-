/**
 * Smart Canteen Management Platform
 * Master App Controller - Modern White & Dark Navy Blue Theme
 */

class CanteenApp {
  constructor() {
    this.currentRole = "student"; // 'student' | 'admin'
    this.init();
  }

  init() {
    // Initialize portals
    if (document.getElementById("student-portal-wrapper")) {
      window.studentPortal = new StudentPortal(window.canteenStorage, window.canteenAudio);
      window.studentPortal.renderActiveView();
      window.studentPortal.updateActiveOrderPill();
      window.studentPortal.updateHeaderUserInfo();
    }
    if (window.canteenAuth) window.canteenAuth.updateUI();
    if (document.getElementById("admin-orders-container")) {
      window.adminConsole = new AdminConsole(window.canteenStorage, window.canteenAudio);
      window.adminConsole.renderMetrics();
    }

    // Event listeners
    this.bindEvents();

    // Update notifications badge
    this.updateNotificationsBadge();
    window.canteenStorage.on("notificationsUpdated", () => this.updateNotificationsBadge());
  }

  bindEvents() {
    // Search input with instant filtering
    const searchInput = document.getElementById("menu-search-input");
    if (searchInput) {
      const handleSearch = (val) => {
        window.studentPortal.searchQuery = val;
        if (window.studentPortal.activeTab !== "menu") {
          window.studentPortal.switchStudentTab("menu");
        } else {
          window.studentPortal.renderMenu();
        }
      };
      searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
      searchInput.addEventListener("keyup", (e) => handleSearch(e.target.value));
      searchInput.addEventListener("change", (e) => handleSearch(e.target.value));
    }

    // Category pills
    document.querySelectorAll(".cat-pill-btn").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".cat-pill-btn").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        window.studentPortal.activeCategory = pill.dataset.cat;
        if (window.studentPortal.activeTab !== "menu") {
          window.studentPortal.switchStudentTab("menu");
        } else {
          window.studentPortal.renderMenu();
        }
      });
    });

    // Dietary filters
    document.querySelectorAll(".diet-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".diet-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        window.studentPortal.activeDietary = btn.dataset.diet;
        if (window.studentPortal.activeTab !== "menu") {
          window.studentPortal.switchStudentTab("menu");
        } else {
          window.studentPortal.renderMenu();
        }
      });
    });
  }

  // --- Role Switcher (Student vs Admin) ---
  switchRole(role) {
    this.currentRole = role;
    document.querySelectorAll(".role-toggle-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.role === role);
    });

    const studentView = document.getElementById("student-portal-wrapper");
    const adminView = document.getElementById("admin-portal-wrapper");
    const studentSecNav = document.getElementById("student-secondary-nav");
    const adminSecNav = document.getElementById("admin-secondary-nav");
    const studentHeaderItems = document.querySelectorAll(".student-header-elem");
    const mobileBottomNav = document.getElementById("mobile-bottom-nav");

    if (role === "student") {
      if (studentView) studentView.style.display = "block";
      if (adminView) adminView.style.display = "none";
      if (studentSecNav) studentSecNav.style.display = "block";
      if (adminSecNav) adminSecNav.style.display = "none";
      if (mobileBottomNav) mobileBottomNav.style.display = "flex";
      studentHeaderItems.forEach(el => el.style.display = "flex");
      window.studentPortal.renderActiveView();
    } else {
      if (studentView) studentView.style.display = "none";
      if (adminView) adminView.style.display = "block";
      if (studentSecNav) studentSecNav.style.display = "none";
      if (adminSecNav) adminSecNav.style.display = "block";
      if (mobileBottomNav) mobileBottomNav.style.display = "none";
      studentHeaderItems.forEach(el => el.style.display = "none");
      window.adminConsole.renderMetrics();
      window.adminConsole.switchAdminTab("orders");
    }

    window.canteenAudio.playTap();
  }

  // --- Sound Toggle ---
  toggleSound() {
    const enabled = window.canteenAudio.toggleSound();
    const btn = document.getElementById("sound-toggle-btn");
    if (btn) {
      btn.innerHTML = enabled
        ? `<svg class="ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
        : `<svg class="ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      btn.title = enabled ? "Mute Sound Effects" : "Enable Sound Effects";
    }
    if (enabled) window.canteenAudio.playTap();
  }

  // --- Toast Notifications (Clean Modern Style with SVG Icons) ---
  showToast(title, message, icon = "bell") {
    const container = document.getElementById("toast-stack");
    if (!container) return;

    let iconSvg = "";
    if (typeof icon === "string" && icon.includes("<svg")) {
      iconSvg = icon;
    } else {
      switch (icon) {
        case "cart":
          iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2.2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;
          break;
        case "success":
          iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
          break;
        case "error":
          iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
          break;
        case "warning":
          iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
          break;
        case "heart":
          iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
          break;
        case "star":
          iconSvg = `<svg class="ui-icon star-icon" width="22" height="22" viewBox="0 0 24 24" fill="#FFB800" stroke="#FFB800"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
          break;
        case "bell":
        default:
          iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2.2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
          break;
      }
    }

    const toast = document.createElement("div");
    toast.className = "clean-toast";
    toast.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; background: rgba(255, 94, 0, 0.08); flex-shrink: 0;">
        ${iconSvg}
      </div>
      <div>
        <div class="toast-message-title">${title}</div>
        <div class="toast-message-desc">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  // --- In-App Notifications Drawer ---
  openNotifications() {
    const modal = document.getElementById("notifications-modal");
    if (!modal) return;

    const notifs = window.canteenStorage.getNotifications();
    const list = document.getElementById("notifications-list");
    if (list) {
      if (notifs.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">No new notifications</div>`;
      } else {
        list.innerHTML = notifs.map(n => {
          let itemSvg = `<svg class="ui-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
          if (n.type === "ready") {
            itemSvg = `<svg class="ui-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
          } else if (n.type === "payment") {
            itemSvg = `<svg class="ui-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`;
          }
          return `
            <div style="padding: 0.85rem; border-radius: var(--radius-xs); background: ${n.read ? 'var(--bg-surface)' : 'rgba(255, 94, 0, 0.05)'}; border: 1px solid var(--glass-border-subtle); display: flex; gap: 0.75rem; align-items: flex-start;">
              <div style="margin-top: 2px;">${itemSvg}</div>
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-dark); margin-bottom: 0.15rem;">${n.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.2rem;">${n.message}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">${n.time}</div>
              </div>
            </div>
          `;
        }).join("");
      }
    }

    window.canteenStorage.markNotificationsRead();
    this.updateNotificationsBadge();
    modal.classList.add("open");
  }

  closeNotifications() {
    const modal = document.getElementById("notifications-modal");
    if (modal) modal.classList.remove("open");
  }

  updateNotificationsBadge() {
    const notifs = window.canteenStorage.getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    const badge = document.getElementById("notif-badge");
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? "flex" : "none";
    }
  }

  // --- Student Profile & Campus Wallet Modal ---
  openWalletModal() {
    const modal = document.getElementById("wallet-modal");
    if (!modal) return;

    const user = window.canteenStorage.getUser();
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-campus-id").textContent = user.studentId;
    document.getElementById("profile-wallet-balance").textContent = `â‚¹${user.walletBalance.toFixed(2)}`;

    modal.classList.add("open");
  }

  closeWalletModal() {
    const modal = document.getElementById("wallet-modal");
    if (modal) modal.classList.remove("open");
  }

  topUpWallet(amount) {
    window.canteenStorage.topUpWallet(amount);
    window.canteenAudio.playTap();
    const user = window.canteenStorage.getUser();
    const balEl = document.getElementById("profile-wallet-balance");
    if (balEl) balEl.textContent = `â‚¹${user.walletBalance.toFixed(2)}`;
    this.showToast("Wallet Reloaded!", `â‚¹${amount} added successfully.`, "success");
    if (window.studentPortal.activeTab === "wallet") {
      window.studentPortal.renderWalletView();
    }
  }

  customTopUp() {
    const amt = prompt("Enter amount to add to Campus Wallet (â‚¹):", "250");
    if (amt && !isNaN(amt) && parseFloat(amt) > 0) {
      this.topUpWallet(parseFloat(amt));
    }
  }

  resetAllDemoData() {
    if (confirm("Reset the entire platform to fresh demo factory settings? (This reloads all menus, realistic orders, and campus wallet balances)")) {
      window.canteenStorage.resetToDefaults();
      location.reload();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new CanteenApp();
});

