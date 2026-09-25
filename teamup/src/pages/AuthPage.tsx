import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthPageProps {
  onSuccess?: () => void;
  onNavigateHome?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onNavigateHome }) => {
  const {
    firebaseUser,
    firebaseLogin,
    firebaseSignUp,
    firebaseGoogleSignIn,
    firebaseLogout,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeId, setCollegeId] = useState('2025/CS/006');
  const [preferredRole, setPreferredRole] = useState('Full Stack Developer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter both email and password.');
          setIsLoading(false);
          return;
        }
        await firebaseLogin(email.trim(), password);
        showToast('Signed In Successfully', `Welcome back to TeamUp!`, 'success');
      } else {
        if (!email.trim() || !password.trim() || !fullName.trim() || !collegeId.trim()) {
          setErrorMsg('Please complete all required fields.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password should be at least 6 characters long.');
          setIsLoading(false);
          return;
        }
        await firebaseSignUp(
          email.trim(),
          password,
          fullName.trim(),
          collegeId.trim(),
          preferredRole.trim()
        );
        showToast('Account Created!', `Welcome to TeamUp, ${fullName}!`, 'success');
      }
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      let message = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Try signing in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await firebaseGoogleSignIn();
      showToast('Signed In with Google', 'Connected securely via Firebase Auth', 'success');
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 font-uber">
      <div className="w-full max-w-md">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-[12px] font-semibold text-[#ff4d15] mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Firebase Auth &amp; Cloud Firestore
          </div>

          <h2 className="text-3xl sm:text-4xl font-moara font-bold text-slate-900 tracking-tight">
            {mode === 'signin' ? 'Sign in to TeamUp' : 'Create your Student Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {mode === 'signin'
              ? 'Connect with collegiate teammates and participate in top hackathons'
              : 'Join thousands of college innovators building squads across India'}
          </p>
        </div>

        {/* Liquid Glass Auth Card */}
        <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl liquid-glass border border-slate-200 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl liquid-glass border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-3 transition shadow-xs hover:bg-white cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Or with email
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      College ID *
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={collegeId}
                        onChange={(e) => setCollegeId(e.target.value)}
                        placeholder="e.g. 2025/CS/006"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] font-mono transition text-xs"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Sample: 2025/CS/006 (Year/Dept/Adm No)
                    </span>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Primary Role</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={preferredRole}
                        onChange={(e) => setPreferredRole(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
                      >
                        <option value="Full Stack Developer">Full Stack</option>
                        <option value="AI/ML Engineer">AI/ML Engineer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="Backend Developer">Backend Dev</option>
                        <option value="Mobile Developer">Mobile Dev</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">College Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl btn-primary-coral text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Student Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Secured with Firebase Authentication &amp; Firestore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
