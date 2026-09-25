import React from 'react';
import { X, Users, Calendar, ShieldCheck, ArrowRight, Check, Sparkles, UserCheck } from 'lucide-react';
import { Team } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateMatchScore, analyzeTeamSkillCoverage } from '../../services/matchingEngine';
import { SkillCoverageBar } from '../matching/SkillCoverageBar';

interface TeamDetailsModalProps {
  team: Team | null;
  onClose: () => void;
  onRequestJoin?: (team: Team) => void;
  onManageTeam?: (team: Team) => void;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  team,
  onClose,
  onRequestJoin,
  onManageTeam,
}) => {
  const { currentUser, joinRequests, acceptJoinRequest, rejectJoinRequest } = useApp();

  if (!team) return null;

  const breakdown = calculateMatchScore(currentUser, team);
  const { coverageList, overallCoverageScore, missingSkills } = analyzeTeamSkillCoverage(team);

  const isLeader = team.ownerId === currentUser.id;
  const isMember = team.members.some((m) => m.studentId === currentUser.id);
  const isFull = team.members.length >= team.maxMembers;
  const hasPending = joinRequests.some(
    (r) => r.teamId === team.id && r.studentId === currentUser.id && r.status === 'pending'
  );
  const pendingForTeam = isLeader
    ? joinRequests.filter((r) => r.teamId === team.id && r.status === 'pending')
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in font-uber">
      <div className="w-full max-w-2xl liquid-glass border border-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0 flex items-center justify-center font-bold text-[#ff4d15]">
              {team.logoUrl ? (
                <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-moara">{team.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-moara font-bold text-slate-900">{team.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    isFull
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isFull ? 'Squad Full' : 'Recruiting'}
                </span>
              </div>
              <p className="text-xs text-[#ff4d15] font-semibold mt-0.5">
                {team.eventName || 'Independent Project'}
              </p>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Leader: {team.ownerName} • {team.members.length}/{team.maxMembers} Members
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-5 text-xs">
          {/* Match Score Banner */}
          <div className="p-4 rounded-3xl liquid-glass border border-slate-200 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#ff4d15] tracking-wider block">
                Two-Way Matching Compatibility
              </span>
              <div className="text-2xl font-moara font-bold text-slate-900 mt-0.5">
                {breakdown.finalScore}% Match
              </div>
              <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                <span>Skill: {breakdown.skillScore}/50</span>
                <span>•</span>
                <span>Role: {breakdown.roleScore}/20</span>
                <span>•</span>
                <span>Interests: {breakdown.interestScore}/15</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-[#ff4d15]/30 bg-[#ff4d15]/5 flex items-center justify-center font-bold text-base text-[#ff4d15]">
              {breakdown.finalScore}%
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 font-moara">
              Project &amp; Team Vision
            </h4>
            <p className="text-slate-600 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-slate-200">
              {team.description}
            </p>
          </div>

          {/* Skill Gap Coverage */}
          <div>
            <SkillCoverageBar
              coverageList={coverageList}
              overallCoverageScore={overallCoverageScore}
              missingSkills={missingSkills}
            />
          </div>

          {/* Current Members */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 font-moara">
              <Users className="w-4 h-4 text-[#ff4d15]" />
              Current Squad ({team.members.length}/{team.maxMembers})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {team.members.map((m) => (
                <div
                  key={m.studentId}
                  className="p-3 rounded-2xl liquid-glass border border-slate-200 flex items-center gap-3 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-white shadow-xs">
                    <img src={m.profileImage} alt={m.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {m.fullName} {m.isLeader && <strong className="text-[#ff4d15] font-semibold text-[11px]">(Leader)</strong>}
                    </span>
                    <span className="text-[11px] text-slate-500">{m.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Applications for Team Leader */}
          {isLeader && pendingForTeam.length > 0 && (
            <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#ff4d15]" />
                  Pending Join Applications ({pendingForTeam.length})
                </span>
                <span className="text-[11px] text-amber-700">Review &amp; Accept</span>
              </div>

              <div className="space-y-2">
                {pendingForTeam.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-white border border-amber-100 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img src={req.studentAvatar} alt={req.studentName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{req.studentName}</span>
                          <span className="text-[10px] font-bold text-[#ff4d15] bg-orange-50 px-1.5 py-0.5 rounded-full">
                            {req.matchScore}% Match
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 line-clamp-1">"{req.message}"</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => rejectJoinRequest(req.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptJoinRequest(req.id)}
                        disabled={isFull}
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold btn-primary-coral flex items-center gap-1 shadow-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>

          {isLeader ? (
            <button
              onClick={() => {
                onManageTeam?.(team);
                onClose();
              }}
              className="px-5 py-2.5 text-xs font-semibold btn-dark-pill shadow-xs transition cursor-pointer"
            >
              Manage Team Dashboard &rarr;
            </button>
          ) : !isMember && !hasPending && !isFull ? (
            <button
              onClick={() => {
                onRequestJoin?.(team);
                onClose();
              }}
              className="px-5 py-2.5 text-xs font-semibold btn-primary-coral rounded-2xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request to Join Team</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
