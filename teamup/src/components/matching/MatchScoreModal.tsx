import React from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, User, Briefcase, Heart, Clock, Award } from 'lucide-react';
import { MatchBreakdown } from '../../types';

interface MatchScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  breakdown: MatchBreakdown;
  actionButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export const MatchScoreModal: React.FC<MatchScoreModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  breakdown,
  actionButton,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl liquid-glass border border-white shadow-2xl p-6 sm:p-8 text-slate-900 font-uber">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-orange-100 text-[#ff4d15]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-2xl font-normal text-slate-900 font-moara">Smart Match Breakdown</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {title} {subtitle ? `• ${subtitle}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Hero with Liquid Glow */}
        <div className="my-5 p-6 rounded-3xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 border border-orange-200/80 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Synergy Compatibility
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-extrabold text-slate-900 font-uber tracking-tight">
                {breakdown.finalScore}%
              </span>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                {breakdown.finalScore >= 85 ? 'Exceptional Fit' : breakdown.finalScore >= 70 ? 'Strong Fit' : 'Moderate Match'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Calculated across 5 weighted factors
            </p>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-[#ff4d15] bg-white flex items-center justify-center font-extrabold text-2xl text-[#ff4d15] shadow-md">
            {breakdown.finalScore}%
          </div>
        </div>

        {/* 5-Factor Score Breakdown */}
        <div className="space-y-3 mb-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Why this match? (5 Weighted Factors)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Skill Match */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#ff4d15]" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Skill Compatibility</div>
                  <div className="text-[10px] text-slate-400">Weight: 50%</div>
                </div>
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {breakdown.skillScore} <span className="text-[11px] text-slate-400 font-normal">/ 50</span>
              </div>
            </div>

            {/* Role Match */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Role Alignment</div>
                  <div className="text-[10px] text-slate-400">Weight: 20%</div>
                </div>
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {breakdown.roleScore} <span className="text-[11px] text-slate-400 font-normal">/ 20</span>
              </div>
            </div>

            {/* Project Interest */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-pink-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Project Interests</div>
                  <div className="text-[10px] text-slate-400">Weight: 15%</div>
                </div>
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {breakdown.interestScore} <span className="text-[11px] text-slate-400 font-normal">/ 15</span>
              </div>
            </div>

            {/* Experience */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-cyan-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Experience Level</div>
                  <div className="text-[10px] text-slate-400">Weight: 10%</div>
                </div>
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {breakdown.experienceScore} <span className="text-[11px] text-slate-400 font-normal">/ 10</span>
              </div>
            </div>

            {/* Availability */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between sm:col-span-2 shadow-2xl">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Availability &amp; Mode Schedule</div>
                  <div className="text-[10px] text-slate-400">Weight: 5% (Weekends &amp; Mode synergy)</div>
                </div>
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {breakdown.availabilityScore} <span className="text-[11px] text-slate-400 font-normal">/ 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Matched vs Missing Skills List */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Matched Skills ({breakdown.matchedSkills.length})
            </div>
            {breakdown.matchedSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No exact skill overlap found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {breakdown.matchedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    ✓ {s.name}
                    <span className="text-[10px] text-emerald-600 bg-white/80 px-1.5 py-0.5 rounded-full">
                      {s.level}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Missing Skills Needed ({breakdown.missingSkills.length})
            </div>
            {breakdown.missingSkills.length === 0 ? (
              <p className="text-xs text-emerald-700 font-bold">✓ All requested squad skills satisfied!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {breakdown.missingSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    • {s.name}
                    <span className="text-[10px] text-rose-500 bg-white/80 px-1.5 py-0.5 rounded-full capitalize">
                      {s.requirementType}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
          >
            Close
          </button>
          {actionButton && (
            <button
              onClick={() => {
                actionButton.onClick();
                onClose();
              }}
              disabled={actionButton.disabled}
              className="px-6 py-2.5 text-xs font-bold btn-primary-coral rounded-full flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {actionButton.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
