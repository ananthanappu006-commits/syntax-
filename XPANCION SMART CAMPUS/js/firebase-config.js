/* ==========================================================================
   SmartCampus Firebase Configuration & Authentication Service
   ========================================================================== */

// Official Firebase Web App Configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyD9O_0w39NKg7LG2_PFTn4q3gZJK8zKp9c",
  authDomain: "sample-95ec0.firebaseapp.com",
  projectId: "sample-95ec0",
  storageBucket: "sample-95ec0.firebasestorage.app",
  messagingSenderId: "164303306409",
  appId: "1:164303306409:web:55885c8a21daf10e7bf3b8",
  measurementId: "G-L90ZPZNVC1"
};

let firebaseApp = null;
let firebaseAuth = null;
let firebaseAnalytics = null;

try {
  if (typeof firebase !== 'undefined') {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firebaseAuth = firebase.auth();
    if (typeof firebase.analytics === 'function') {
      firebaseAnalytics = firebase.analytics();
    }
    console.log('✅ Firebase initialized successfully for SmartCampus:', firebaseConfig.projectId);
  } else {
    console.warn('⚠️ Firebase SDK not detected in global scope. Demo/simulated auth will be available.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Campus Authentication Controller Wrapper
window.campusAuth = {
  get app() { return firebaseApp; },
  get auth() { return firebaseAuth; },
  get analytics() { return firebaseAnalytics; },

  // Sign In with Email & Password
  async signInWithEmail(email, password) {
    if (!firebaseAuth) {
      return { success: true, user: { email, uid: 'sim_' + Date.now() }, simulated: true };
    }
    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.warn('Firebase Sign-In notice:', error.message);
      // If user doesn't exist yet on this test Firebase project, allow seamless sign-up or demo fallback
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
        return { 
          success: false, 
          code: error.code, 
          message: error.message,
          suggestion: 'Account not found. Click "Create Account" or use 1-click Demo Fill.'
        };
      }
      return { success: false, code: error.code, message: error.message };
    }
  },

  // Create New Account with Email & Password
  async signUpWithEmail(email, password) {
    if (!firebaseAuth) {
      return { success: true, user: { email, uid: 'sim_' + Date.now() }, simulated: true };
    }
    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.warn('Firebase Sign-Up notice:', error.message);
      return { success: false, code: error.code, message: error.message };
    }
  },

  // Sign In with Google Provider
  async signInWithGoogle() {
    if (!firebaseAuth) {
      return { success: true, user: { displayName: 'Google User', email: 'user@gmail.com', uid: 'sim_goog_' + Date.now() }, simulated: true };
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebaseAuth.signInWithPopup(provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.warn('Google Sign-In notice:', error.message);
      return { success: false, code: error.code, message: error.message };
    }
  },

  // Sign Out
  async signOut() {
    if (firebaseAuth) {
      try {
        await firebaseAuth.signOut();
      } catch (err) {
        console.error('SignOut error:', err);
      }
    }
    localStorage.removeItem('smartcampus_active_user');
    window.location.hash = '#auth';
    window.location.reload();
  },

  // Observer
  onAuthStateChanged(callback) {
    if (firebaseAuth) {
      return firebaseAuth.onAuthStateChanged(callback);
    }
    return () => {};
  }
};
