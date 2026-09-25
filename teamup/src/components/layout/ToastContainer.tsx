import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-500/10'
                : isWarning
                ? 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-amber-500/10'
                : 'bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-indigo-500/10'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : isWarning ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <div className="text-xs font-bold text-white">{toast.title}</div>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
