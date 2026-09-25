/**
 * Smart Canteen Platform - Firebase Authentication System
 * Handles Firebase Web SDK initialization, Google Sign-In, Email/Password Sign-Up & Sign-In,
 * and mandatory auth guard for meal pre-ordering and checkout.
 */

class CanteenAuthManager {
  constructor() {
    this.firebaseApp = null;
    this.auth = null;
    this.currentUser = null;
    this.pendingSuccessCallback = null;
    this.isInitialized = false;

    // User's Firebase Configuration
    this.firebaseConfig = {
      apiKey: "AIzaSyDM0Pjv3JwWf4ie9-hrysLul00_SBgKFqQ",
      authDomain: "kleen-92925.firebaseapp.com",
      projectId: "kleen-92925",
      storageBucket: "kleen-92925.firebasestorage.app",
      messagingSenderId: "931166446675",
      appId: "1:931166446675:web:f7d2dcf5fd546e963c12a6",
      measurementId: "G-WCYWR18J65"
    };

    this.init();
  }

  init() {
    // Check if Firebase Compat SDK is loaded
    if (typeof firebase !== "undefined") {
      try {
        if (!firebase.apps.length) {
          this.firebaseApp = firebase.initializeApp(this.firebaseConfig);
        } else {
          this.firebaseApp = firebase.app();
        }
        this.auth = firebase.auth();

        // Listen for real Firebase auth state changes
        this.auth.onAuthStateChanged((user) => {
          if (user) {
            this.handleFirebaseUser(user);
          } else {
            // Check if there is local cached session
            const localUser = this.getCachedUser();
            if (localUser && localUser.isDemo) {
              this.currentUser = localUser;
            } else {
              this.currentUser = null;
            }
          }
          this.updateUI();
        });

        this.isInitialized = true;
      } catch (err) {
        console.warn("Firebase initialization warning (using local fallback):", err);
        this.fallbackLocalInit();
      }
    } else {
      this.fallbackLocalInit();
    }
  }

  fallbackLocalInit() {
    // Check cached session
    const cached = this.getCachedUser();
    if (cached) {
      this.currentUser = cached;
    }
    this.updateUI();
  }

  getCachedUser() {
    try {
      const data = localStorage.getItem("canteen_auth_user");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  setCachedUser(user) {
    if (user) {
      localStorage.setItem("canteen_auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("canteen_auth_user");
    }
  }

  handleFirebaseUser(fbUser) {
    this.currentUser = {
      uid: fbUser.uid,
      displayName: fbUser.displayName || fbUser.email.split("@")[0],
      email: fbUser.email,
      photoURL: fbUser.photoURL || "",
      phone: fbUser.phoneNumber || "+91 98765 43210",
      studentId: "CS-" + fbUser.uid.substring(0, 6).toUpperCase(),
      isDemo: false
    };

    this.setCachedUser(this.currentUser);

    // Sync with canteen storage
    if (window.canteenStorage) {
      window.canteenStorage.updateUserProfile({
        name: this.currentUser.displayName,
        email: this.currentUser.email,
        phone: this.currentUser.phone
      });
    }

    this.updateUI();

    if (this.pendingSuccessCallback) {
      const cb = this.pendingSuccessCallback;
      this.pendingSuccessCallback = null;
      cb(this.currentUser);
    }
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getUser() {
    return this.currentUser;
  }

  // --- Auth Modal Controls ---
  openAuthModal(options = {}) {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;

    const banner = document.getElementById("auth-mandatory-banner");
    const bannerMsg = document.getElementById("auth-banner-message");

    if (options.purpose === "booking") {
      if (banner) banner.style.display = "flex";
      if (bannerMsg) {
        bannerMsg.textContent = options.message || "Account login is mandatory to place meal bookings & receive your live queue token.";
      }
    } else {
      if (banner) banner.style.display = "none";
    }

    this.pendingSuccessCallback = options.onSuccess || null;
    this.clearAlerts();

    // Default to sign-in tab
    this.switchTab("signin");
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.remove("open");
    document.body.style.overflow = "";
    this.clearAlerts();
  }

  switchTab(tab) {
    const signinTabBtn = document.getElementById("auth-tab-signin");
    const signupTabBtn = document.getElementById("auth-tab-signup");
    const signinForm = document.getElementById("auth-signin-form");
    const signupForm = document.getElementById("auth-signup-form");
    const tabSlider = document.getElementById("auth-tab-slider");

    if (tab === "signin") {
      if (signinTabBtn) signinTabBtn.classList.add("active");
      if (signupTabBtn) signupTabBtn.classList.remove("active");
      if (signinForm) signinForm.style.display = "block";
      if (signupForm) signupForm.style.display = "none";
      if (tabSlider) tabSlider.style.transform = "translateX(0%)";
    } else {
      if (signupTabBtn) signupTabBtn.classList.add("active");
      if (signinTabBtn) signinTabBtn.classList.remove("active");
      if (signinForm) signinForm.style.display = "none";
      if (signupForm) signupForm.style.display = "block";
      if (tabSlider) tabSlider.style.transform = "translateX(100%)";
    }
    this.clearAlerts();
  }

  showAlert(message, type = "error") {
    const alertBox = document.getElementById("auth-alert-box");
    if (!alertBox) return;

    alertBox.className = `auth-alert ${type}`;
    alertBox.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>${message}</span>
    `;
    alertBox.style.display = "flex";
  }

  clearAlerts() {
    const alertBox = document.getElementById("auth-alert-box");
    if (alertBox) {
      alertBox.style.display = "none";
      alertBox.innerHTML = "";
    }
  }

  setLoading(buttonId, isLoading, defaultText = "Sign In") {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = `
        <span class="auth-btn-spinner"></span>
        <span>Processing...</span>
      `;
    } else {
      btn.disabled = false;
      btn.innerHTML = `<span>${defaultText}</span>`;
    }
  }

  // --- Google Sign-In ---
  async signInWithGoogle() {
    this.clearAlerts();
    if (this.auth) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await this.auth.signInWithPopup(provider);
        this.onAuthSuccess(result.user, "Signed in with Google successfully!");
      } catch (err) {
        console.error("Google Sign-in error:", err);
        if (err.code === "auth/popup-closed-by-user") {
          this.showAlert("Google Sign-In was closed before completing.");
        } else if (err.code === "auth/unauthorized-domain") {
          this.showAlert("Domain not authorized in Firebase Console. Using Instant Campus Sign-In.");
          this.quickDemoLogin();
        } else {
          this.showAlert(err.message || "Failed to sign in with Google.");
        }
      }
    } else {
      // Fallback demo account
      this.quickDemoLogin();
    }
  }

  // --- Email & Password Sign In ---
  async signInWithEmail(event) {
    if (event) event.preventDefault();
    this.clearAlerts();

    const email = document.getElementById("signin-email")?.value.trim();
    const password = document.getElementById("signin-password")?.value;

    if (!email || !password) {
      this.showAlert("Please fill in both email and password.");
      return;
    }

    this.setLoading("btn-signin-submit", true);

    if (this.auth) {
      try {
        const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
        this.setLoading("btn-signin-submit", false, "Sign In");
        this.onAuthSuccess(userCredential.user, "Welcome back to Campus Dining!");
      } catch (err) {
        this.setLoading("btn-signin-submit", false, "Sign In");
        console.error("Firebase email sign-in error:", err);
        let msg = "Invalid email or password.";
        if (err.code === "auth/user-not-found") msg = "No student account found with this email.";
        if (err.code === "auth/wrong-password") msg = "Incorrect password. Try again or reset.";
        if (err.code === "auth/invalid-email") msg = "Please enter a valid campus email.";
        this.showAlert(msg);
      }
    } else {
      // Simulated instant sign-in
      setTimeout(() => {
        this.setLoading("btn-signin-submit", false, "Sign In");
        this.createLocalSession({
          uid: "usr_local_" + Date.now(),
          displayName: email.split("@")[0],
          email: email,
          phone: "+91 98765 43210",
          studentId: "CS-2024",
          isDemo: true
        });
        this.onAuthSuccess(this.currentUser, "Welcome back to Campus Dining!");
      }, 500);
    }
  }

  // --- Email & Password Sign Up ---
  async signUpWithEmail(event) {
    if (event) event.preventDefault();
    this.clearAlerts();

    const name = document.getElementById("signup-name")?.value.trim();
    const studentId = document.getElementById("signup-studentid")?.value.trim() || "CS-2024";
    const phone = document.getElementById("signup-phone")?.value.trim() || "+91 98765 43210";
    const email = document.getElementById("signup-email")?.value.trim();
    const password = document.getElementById("signup-password")?.value;

    if (!name || !email || !password) {
      this.showAlert("Please enter your name, campus email, and password.");
      return;
    }

    if (password.length < 6) {
      this.showAlert("Password must be at least 6 characters long.");
      return;
    }

    this.setLoading("btn-signup-submit", true);

    if (this.auth) {
      try {
        const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });

        this.currentUser = {
          uid: userCredential.user.uid,
          displayName: name,
          email: email,
          phone: phone,
          studentId: studentId,
          isDemo: false
        };

        this.setCachedUser(this.currentUser);
        this.setLoading("btn-signup-submit", false, "Create Account");
        this.onAuthSuccess(this.currentUser, "Campus account created successfully!");
      } catch (err) {
        this.setLoading("btn-signup-submit", false, "Create Account");
        console.error("Firebase sign-up error:", err);
        let msg = err.message || "Failed to create account.";
        if (err.code === "auth/email-already-in-use") msg = "An account with this email already exists. Please sign in.";
        if (err.code === "auth/weak-password") msg = "Password is too weak. Use at least 6 characters.";
        this.showAlert(msg);
      }
    } else {
      setTimeout(() => {
        this.setLoading("btn-signup-submit", false, "Create Account");
        this.createLocalSession({
          uid: "usr_reg_" + Date.now(),
          displayName: name,
          email: email,
          phone: phone,
          studentId: studentId,
          isDemo: true
        });
        this.onAuthSuccess(this.currentUser, "Campus account created successfully!");
      }, 500);
    }
  }

  // --- Password Reset ---
  async handlePasswordReset() {
    const email = prompt("Enter your registered campus email address for password reset link:", "");
    if (!email || !email.includes("@")) return;

    if (this.auth) {
      try {
        await this.auth.sendPasswordResetEmail(email.trim());
        if (window.app) {
          window.app.showToast("Reset Link Sent", `Password reset instructions sent to ${email}`, "success");
        } else {
          alert(`Password reset instructions sent to ${email}`);
        }
      } catch (err) {
        alert(err.message || "Failed to send reset email.");
      }
    } else {
      if (window.app) {
        window.app.showToast("Reset Link Simulated", `Instructions sent to ${email}`, "success");
      }
    }
  }

  // --- Quick Campus Demo Login (1-Click) ---
  quickDemoLogin() {
    this.createLocalSession({
      uid: "usr_student_demo_1",
      displayName: "Aryan Varma",
      email: "aryan.v@campus.edu.in",
      phone: "+91 98450 12345",
      studentId: "CS-2024-884",
      isDemo: true
    });
    this.onAuthSuccess(this.currentUser, "Signed in as Aryan Varma (Campus Demo)");
  }

  createLocalSession(user) {
    this.currentUser = user;
    this.setCachedUser(user);
    if (window.canteenStorage) {
      window.canteenStorage.updateUserProfile({
        name: user.displayName,
        email: user.email,
        phone: user.phone
      });
    }
    this.updateUI();
  }

  onAuthSuccess(user, toastMsg) {
    this.closeAuthModal();
    if (window.app) {
      window.app.showToast("Welcome!", toastMsg, "success");
    }

    if (this.pendingSuccessCallback) {
      const cb = this.pendingSuccessCallback;
      this.pendingSuccessCallback = null;
      cb(user);
    }
  }

  // --- Sign Out ---
  async signOut() {
    if (this.auth) {
      try {
        await this.auth.signOut();
      } catch (e) {
        console.warn("Sign out error:", e);
      }
    }

    this.currentUser = null;
    this.setCachedUser(null);
    this.updateUI();

    if (window.app) {
      window.app.showToast("Signed Out", "You have been logged out of Campus Dining.", "info");
    }
    if (window.studentPortal) {
      window.studentPortal.switchStudentTab("home");
    }
  }

  // --- Update Navbar Profile / Sign-in Pill ---
  updateUI() {
    const profileBtn = document.getElementById("top-profile-btn");
    if (!profileBtn) return;

    if (this.isAuthenticated()) {
      const user = this.currentUser;
      const firstName = user.displayName ? user.displayName.split(" ")[0] : "Student";
      profileBtn.classList.add("authenticated");
      profileBtn.innerHTML = `
        <span class="user-avatar-crest">${firstName.charAt(0).toUpperCase()}</span>
        <span class="btn-text">${firstName}</span>
      `;
      profileBtn.onclick = () => window.studentPortal.switchStudentTab("profile");
      profileBtn.title = `Signed in as ${user.displayName} (${user.email})`;
    } else {
      profileBtn.classList.remove("authenticated");
      profileBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <span class="btn-text">Sign In</span>
      `;
      profileBtn.onclick = () => this.openAuthModal();
      profileBtn.title = "Sign In / Register";
    }
  }
}

// Global initialization
window.addEventListener("DOMContentLoaded", () => {
  window.canteenAuth = new CanteenAuthManager();
});
