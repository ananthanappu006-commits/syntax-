import React, { useState } from 'react';
import { Users, Sparkles, Bookmark, ArrowRight, Check, X, Shield, Calendar } from 'lucide-react';
import { Team, MatchBreakdown } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateMatchScore } from '../../services/matchingEngine';
import { MatchScoreModal } from '../matching/MatchScoreModal';

interface TeamCardProps {
  team: Team;
  onViewDetails?: (team: Team) => void;
  customBreakdown?: MatchBreakdown;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onViewDetails, customBreakdown }) => {
  const { currentUser, sendJoinRequest, toggleBookmark, joinRequests } = useApp();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showRequestInput, setShowRequestInput] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');

  const breakdown = customBreakdown || calculateMatchScore(currentUser, team);
  const isBookmarked = currentUser.bookmarkedTeamIds?.includes(team.id);
  const isMember = team.members.some((m) => m.studentId === currentUser.id);
  const isLeader = team.ownerId === currentUser.id;
  const isFull = team.members.length >= team.maxMembers;
  const hasPendingRequest = joinRequests.some(
    (r) => r.teamId === team.id && r.studentId === currentUser.id && r.status === 'pending'
  );

  const handleSendRequest = () => {
    sendJoinRequest(team.id, requestMsg);
    setShowRequestInput(false);
    setRequestMsg('');
  };

  return (
    <>
      <div className="liquid-glass-card rounded-3xl p-6 flex flex-col justify-between relative group">
        <div>
          {/* Top Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#ff4d15] bg-orange-50 font-uber">
                    {team.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#ff4d15] transition-colors font-uber">
                  {team.name}
                </h3>
                {team.eventName ? (
                  <span className="inline-flex items-center gap-1 text-xs text-[#ff4d15] font-semibold mt-0.5 font-uber">
                    <Calendar className="w-3 h-3" />
                    {team.eventName}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-uber">Independent Project</span>
                )}
              </div>
            </div>

            <button
              onClick={() => toggleBookmark('team', team.id)}
              className={`p-2.5 rounded-full border transition ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-800'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Team'}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed font-uber">
            {team.description}
          </p>

          {/* Member count and status */}
          <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pb-3 border-b border-slate-100 font-uber">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>
                <strong className="text-slate-900 font-bold">{team.members.length}</strong> / {team.maxMembers} Members
              </span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isFull
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {isFull ? 'Squad Full' : 'Recruiting'}
            </span>
          </div>

          {/* Required Skills Chips */}
          <div className="mt-3.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-uber">
              Required Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {team.requiredSkills.slice(0, 4).map((req, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100/90 text-slate-700 font-medium border border-slate-200/80 font-uber"
                >
                  {req.skillName}
                </span>
              ))}
              {team.requiredSkills.length > 4 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-uber">
                  +{team.requiredSkills.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Smart Match Bar (Section 52 UI with Liquid Glass styling) */}
          <div
            onClick={() => setShowMatchModal(true)}
            className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-orange-50/60 to-amber-50/40 border border-orange-200/70 hover:border-[#ff4d15]/50 cursor-pointer transition group/match"
          >
            <div className="flex items-center justify-between text-xs mb-1.5 font-uber">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#ff4d15]" />
                <span>Your Match</span>
              </div>
              <span className="font-extrabold text-[#ff4d15] text-sm group-hover/match:underline">
                {breakdown.finalScore}%
              </span>
            </div>

            {/* Match progress track */}
            <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  breakdown.finalScore >= 85
                    ? 'bg-gradient-to-r from-[#ff4d15] to-emerald-500'
                    : breakdown.finalScore >= 70
                    ? 'bg-gradient-to-r from-[#ff4d15] to-amber-500'
                    : 'bg-[#ff4d15]'
                }`}
                style={{ width: `${breakdown.finalScore}%` }}
              />
            </div>

            {/* Quick matched & missing items */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5 text-[11px] font-uber">
              {breakdown.matchedSkills.slice(0, 2).map((s, i) => (
                <span key={i} className="text-emerald-700 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3 text-emerald-600" /> {s.name}
                </span>
              ))}
              {breakdown.missingSkills.slice(0, 1).map((s, i) => (
                <span key={i} className="text-rose-600 flex items-center gap-1 font-medium">
                  <X className="w-3 h-3 text-rose-500" /> {s.name}
                </span>
              ))}
              <span className="text-slate-500 hover:text-slate-800 ml-auto font-medium">
                Why this match? &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Join Request Input Drawer */}
        {showRequestInput && (
          <div className="mt-3 p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 animate-in fade-in duration-200 shadow-lg">
            <textarea
              value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)}
              placeholder={`Introduce yourself to ${team.ownerName} & highlight your skills...`}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#ff4d15] resize-none h-18 font-uber"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRequestInput(false)}
                className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800 font-uber"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="px-4 py-1.5 text-xs font-bold btn-primary-coral rounded-full"
              >
                Send Request
              </button>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center gap-2 mt-5 pt-3.5 border-t border-slate-100">
          <button
            onClick={() => onViewDetails?.(team)}
            className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition text-center font-uber shadow-sm"
          >
            View Squad
          </button>

          {isLeader ? (
            <span className="flex-1 py-2 px-3 text-xs font-bold text-[#ff4d15] bg-orange-50 border border-orange-200 rounded-full text-center flex items-center justify-center gap-1 font-uber">
              <Shield className="w-3.5 h-3.5" /> You're Leader
            </span>
          ) : isMember ? (
            <span className="flex-1 py-2 px-3 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full text-center flex items-center justify-center gap-1 font-uber">
              <Check className="w-3.5 h-3.5" /> Joined
            </span>
          ) : hasPendingRequest ? (
            <span className="flex-1 py-2 px-3 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full text-center font-uber">
              Request Pending
            </span>
          ) : isFull ? (
            <span className="flex-1 py-2 px-3 text-xs font-bold text-slate-400 bg-slate-100 rounded-full text-center cursor-not-allowed font-uber">
              Full
            </span>
          ) : (
            <button
              onClick={() => setShowRequestInput((prev) => !prev)}
              className="flex-1 py-2 px-3 text-xs font-bold btn-primary-coral rounded-full text-center flex items-center justify-center gap-1"
            >
              Request to Join <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <MatchScoreModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        title={team.name}
        subtitle={team.eventName || 'Project Squad'}
        breakdown={breakdown}
        actionButton={
          !isMember && !hasPendingRequest && !isFull && !isLeader
            ? {
                label: 'Request to Join',
                onClick: () => setShowRequestInput(true),
              }
            : undefined
        }
      />
    </>
  );
};
