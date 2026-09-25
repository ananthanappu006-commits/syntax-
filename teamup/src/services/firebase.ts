import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyD9O_0w39NKg7LG2_PFTn4q3gZJK8zKp9c",
  authDomain: "sample-95ec0.firebaseapp.com",
  projectId: "sample-95ec0",
  storageBucket: "sample-95ec0.firebasestorage.app",
  messagingSenderId: "164303306409",
  appId: "1:164303306409:web:20b4ca4343749ecb7bf3b8",
  measurementId: "G-M9Z1GVFFXH"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth helper functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  } catch (error: any) {
    console.error('Sign Up Error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error: any) {
    console.error('Sign In Error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};
