import React, { useState } from 'react';
import { Sparkles, Bookmark, MessageSquare, Check, UserPlus, ExternalLink } from 'lucide-react';
import { Student, Team, MatchBreakdown } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateMatchScore } from '../../services/matchingEngine';
import { MatchScoreModal } from '../matching/MatchScoreModal';

interface StudentCardProps {
  student: Student;
  activeTeam?: Team;
  onViewProfile?: (student: Student) => void;
  onOpenChat?: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  activeTeam,
  onViewProfile,
  onOpenChat,
}) => {
  const { currentUser, teams, sendTeamInvitation, toggleBookmark, teamInvitations } = useApp();
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(activeTeam?.id || '');

  // Teams where currentUser is leader
  const userLedTeams = teams.filter((t) => t.ownerId === currentUser.id);
  const targetTeam = activeTeam || userLedTeams[0];

  // Match breakdown
  const breakdown: MatchBreakdown | null = targetTeam
    ? calculateMatchScore(student, targetTeam)
    : null;

  const isBookmarked = currentUser.bookmarkedStudentIds?.includes(student.id);

  const hasPendingInvitation = teamInvitations.some(
    (i) => i.studentId === student.id && (targetTeam ? i.teamId === targetTeam.id : true) && i.status === 'pending'
  );

  const handleSendInvite = () => {
    const tId = selectedTeamId || targetTeam?.id;
    if (!tId) return;
    sendTeamInvitation(tId, student.id, inviteMsg);
    setShowInviteModal(false);
    setInviteMsg('');
  };

  return (
    <>
      <div className="liquid-glass-card rounded-3xl p-6 flex flex-col justify-between relative group">
        <div>
          {/* Header with Photo & Name */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative shadow-sm">
                <img
                  src={student.profileImage}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
                {student.isVerified && (
                  <span
                    title="Verified College Student"
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"
                  />
                )}
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#ff4d15] transition-colors font-uber">
                  {student.fullName}
                </h3>
                <span className="text-xs text-[#ff4d15] font-semibold block font-uber">
                  {student.preferredRoles[0] || 'Student Innovator'}
                </span>
                <span className="text-[11px] text-slate-500 font-uber">
                  {student.department.split('&')[0]} • Year {student.year}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleBookmark('student', student.id)}
              className={`p-2.5 rounded-full border transition ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-800'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Candidate'}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Match Score Badge (if team context available) */}
          {breakdown && (
            <div
              onClick={() => setShowMatchModal(true)}
              className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-orange-50/70 to-amber-50/50 border border-orange-200/80 hover:border-[#ff4d15]/50 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold font-uber">
                <Sparkles className="w-3.5 h-3.5 text-[#ff4d15]" />
                <span>{targetTeam ? targetTeam.name : 'Team'} Fit</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-extrabold text-[#ff4d15] font-uber">
                  {breakdown.finalScore}% MATCH
                </span>
                <span className="text-[10px] text-slate-400">&rarr;</span>
              </div>
            </div>
          )}

          {/* Bio snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed font-uber">
            {student.bio}
          </p>

          {/* Skills with checks (Section 53 UI) */}
          <div className="mt-3.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-uber">
              Top Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.slice(0, 4).map((s, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center gap-1 font-uber"
                >
                  <Check className="w-3 h-3 text-emerald-600 font-bold" />
                  {s.skillName}
                  <span className="text-[10px] text-slate-400">({s.proficiency[0].toUpperCase()})</span>
                </span>
              ))}
              {student.skills.length > 4 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-uber">
                  +{student.skills.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Metadata badges (Experience, Mode, Availability) */}
          <div className="flex flex-wrap gap-2 mt-3 text-[11px] text-slate-500 font-uber">
            <span className="capitalize px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/70">
              Exp: <strong className="text-slate-800 font-semibold">{student.experienceLevel}</strong>
            </span>
            <span className="capitalize px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/70">
              Mode: <strong className="text-slate-800 font-semibold">{student.availability.mode}</strong>
            </span>
            {student.isLookingForTeam && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                Seeking Squad
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-5 pt-3.5 border-t border-slate-100">
          <button
            onClick={() => onViewProfile?.(student)}
            className="flex-1 py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition text-center font-uber shadow-sm"
          >
            View Profile
          </button>

          {userLedTeams.length > 0 ? (
            hasPendingInvitation ? (
              <span className="flex-1 py-2 px-3 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full text-center font-uber">
                Invited
              </span>
            ) : (
              <button
                onClick={() => {
                  setSelectedTeamId(userLedTeams[0].id);
                  setShowInviteModal(true);
                }}
                className="flex-1 py-2 px-3 text-xs font-bold btn-primary-coral rounded-full flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Invite
              </button>
            )
          ) : (
            <button
              onClick={() => onOpenChat?.(student)}
              className="flex-1 py-2 px-3 text-xs font-bold text-slate-800 hover:text-white bg-slate-100 hover:bg-slate-900 border border-slate-200 rounded-full transition flex items-center justify-center gap-1.5 font-uber"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Message
            </button>
          )}
        </div>
      </div>

      {/* Breakdown Modal */}
      {breakdown && targetTeam && (
        <MatchScoreModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          title={student.fullName}
          subtitle={`Match against ${targetTeam.name}`}
          breakdown={breakdown}
          actionButton={
            userLedTeams.length > 0 && !hasPendingInvitation
              ? {
                  label: 'Send Squad Invitation',
                  onClick: () => setShowInviteModal(true),
                }
              : undefined
          }
        />
      )}

      {/* Invite Modal Dialog */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md liquid-glass border border-white rounded-3xl p-6 sm:p-7 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 font-uber">Invite {student.fullName}</h3>
            <p className="text-xs text-slate-500 mt-1 font-uber">
              Select which squad you want to invite {student.fullName} to join.
            </p>

            <div className="mt-4 space-y-3.5 font-uber">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Squad
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#ff4d15]"
                >
                  {userLedTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.members.length}/{t.maxMembers} members)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Personalized Message
                </label>
                <textarea
                  value={inviteMsg}
                  onChange={(e) => setInviteMsg(e.target.value)}
                  placeholder={`Hey ${student.fullName}, we love your skills and think you'd be a fantastic fit for ${targetTeam?.name}...`}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#ff4d15] resize-none h-20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 font-uber"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                className="px-5 py-2 text-xs font-bold btn-primary-coral rounded-full shadow-md"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
