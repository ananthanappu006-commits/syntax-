import React, { useState } from 'react';
import {
  Users,
  Shield,
  Sparkles,
  UserCheck,
  UserX,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Team, Student } from '../types';
import { SkillCoverageBar } from '../components/matching/SkillCoverageBar';
import { StudentCard } from '../components/students/StudentCard';
import {
  analyzeTeamSkillCoverage,
  getRecommendedCandidatesForTeam,
} from '../services/matchingEngine';

interface TeamLeaderDashboardProps {
  selectedTeam?: Team;
  onNavigate: (tab: string) => void;
  onViewStudentProfile?: (student: Student) => void;
  onOpenChatWithStudent?: (student: Student) => void;
}

export const TeamLeaderDashboard: React.FC<TeamLeaderDashboardProps> = ({
  selectedTeam,
  onNavigate,
  onViewStudentProfile,
  onOpenChatWithStudent,
}) => {
  const {
    currentUser,
    teams,
    students,
    joinRequests,
    teamInvitations,
    acceptJoinRequest,
    rejectJoinRequest,
    addStudentDirectlyToTeam,
    removeMemberFromTeam,
    updateTeam,
  } = useApp();

  const activeTeam =
    selectedTeam ||
    teams.find((t) => t.ownerId === currentUser.id) ||
    teams[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'requests' | 'members'>('overview');
  const [requestsFilter, setRequestsFilter] = useState<'pending' | 'accepted' | 'all'>('pending');

  const { coverageList, overallCoverageScore, missingSkills } = analyzeTeamSkillCoverage(activeTeam);
  const recommendedCandidates = getRecommendedCandidatesForTeam(activeTeam, students);
  const pendingRequests = joinRequests.filter(
    (r) => r.teamId === activeTeam.id && r.status === 'pending'
  );
  const acceptedRequests = joinRequests.filter(
    (r) => r.teamId === activeTeam.id && r.status === 'accepted'
  );
  const filteredRequests =
    requestsFilter === 'pending'
      ? pendingRequests
      : requestsFilter === 'accepted'
      ? acceptedRequests
      : joinRequests.filter((r) => r.teamId === activeTeam.id);

  const isFull = activeTeam.members.length >= activeTeam.maxMembers;

  const toggleRecruitment = () => {
    updateTeam(activeTeam.id, {
      status: activeTeam.status === 'recruiting' ? 'closed' : 'recruiting',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Team Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
              {activeTeam.logoUrl ? (
                <img
                  src={activeTeam.logoUrl}
                  alt={activeTeam.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-extrabold text-2xl text-[#ff4d15] bg-orange-50 font-uber">
                  {activeTeam.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 font-moara">
                  {activeTeam.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-[#ff4d15] border border-orange-200">
                  <Shield className="w-3.5 h-3.5" /> Team Leader View
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {activeTeam.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                <span>
                  Event:{' '}
                  <strong className="text-slate-800 font-bold">
                    {activeTeam.eventName || 'Independent Project'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Members:{' '}
                  <strong className="text-slate-900 font-bold">
                    {activeTeam.members.length} / {activeTeam.maxMembers}
                  </strong>
                </span>
                <span>•</span>
                <span
                  className={`font-bold ${
                    activeTeam.status === 'recruiting' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  Status: {activeTeam.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-800 hover:text-white bg-slate-100 hover:bg-slate-900 border border-slate-200 transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Team Chat</span>
            </button>

            <button
              onClick={toggleRecruitment}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition ${
                activeTeam.status === 'recruiting'
                  ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  : 'btn-primary-coral'
              }`}
            >
              {activeTeam.status === 'recruiting' ? 'Close Recruitment' : 'Reopen Recruitment'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-200/80 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Overview &amp; Skill Gap
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
              activeTab === 'candidates'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Recommended Members ({recommendedCandidates.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <span>Join Requests</span>
            {pendingRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#ff4d15] text-white text-[10px] flex items-center justify-center font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === 'members'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Members ({activeTeam.members.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Skill Gap Analysis Component */}
          <SkillCoverageBar
            coverageList={coverageList}
            overallCoverageScore={overallCoverageScore}
            missingSkills={missingSkills}
            onFindMatchingMembers={() => setActiveTab('candidates')}
          />

          {/* Pending Applications Section on Overview */}
          {pendingRequests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#ff4d15]/15 flex items-center justify-center text-[#ff4d15]">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-normal text-slate-900 font-moara flex items-center gap-2">
                      Incoming Join Applications ({pendingRequests.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Students requesting to join {activeTeam.name} — review skills and accept with 1 click.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-xs font-bold text-[#ff4d15] hover:underline"
                >
                  View All Applications &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => {
                  const studentObj = students.find((s) => s.id === req.studentId);
                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-3xl liquid-glass border border-white shadow-sm flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <img
                                src={req.studentAvatar}
                                alt={req.studentName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{req.studentName}</h4>
                              <span className="text-xs text-[#ff4d15] font-semibold block">{req.studentRole}</span>
                              {studentObj && (
                                <span className="text-[11px] text-slate-500">
                                  {studentObj.department.split('&')[0]} • Year {studentObj.year}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ff4d15] border border-orange-200">
                              {req.matchScore}% Match
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{req.createdAt}</span>
                          </div>
                        </div>

                        {/* Message */}
                        <p className="text-xs text-slate-700 mt-3 bg-white/70 p-3 rounded-2xl border border-slate-200/80 leading-relaxed italic">
                          "{req.message}"
                        </p>

                        {/* Skills */}
                        {studentObj && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {studentObj.skills.slice(0, 4).map((sk) => (
                              <span
                                key={sk.skillName}
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700"
                              >
                                {sk.skillName}
                              </span>
                            ))}
                            {studentObj.skills.length > 4 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{studentObj.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                        <div className="flex items-center gap-2">
                          {studentObj && onOpenChatWithStudent && (
                            <button
                              onClick={() => onOpenChatWithStudent(studentObj)}
                              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                              title="Chat with applicant before accepting"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          {studentObj && onViewStudentProfile && (
                            <button
                              onClick={() => onViewStudentProfile(studentObj)}
                              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                              title="View Student Profile"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => rejectJoinRequest(req.id)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => acceptJoinRequest(req.id)}
                            disabled={isFull}
                            className="px-4 py-2 rounded-full text-xs font-bold btn-primary-coral shadow-md flex items-center gap-1.5 hover:scale-105 transition"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Accept into Squad</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Members Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-normal text-slate-900 font-moara flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ff4d15]" />
                  Top Candidate Matches for Your Squad
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Students whose skills plug your missing gaps (sorted by compatibility)
                </p>
              </div>
              <button
                onClick={() => setActiveTab('candidates')}
                className="text-xs font-bold text-[#ff4d15] hover:underline"
              >
                View All ({recommendedCandidates.length}) &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCandidates.slice(0, 3).map(({ student }) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  activeTeam={activeTeam}
                  onViewProfile={onViewStudentProfile}
                  onOpenChat={onOpenChatWithStudent}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Candidates Tab */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-normal text-slate-900 font-moara flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff4d15]" />
                Recommended Students for {activeTeam.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ranked dynamically against your required skills, missing gaps, and preferred roles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCandidates.map(({ student }) => (
              <div key={student.id} className="relative">
                <StudentCard
                  student={student}
                  activeTeam={activeTeam}
                  onViewProfile={onViewStudentProfile}
                  onOpenChat={onOpenChatWithStudent}
                />
                {!activeTeam.members.some((m) => m.studentId === student.id) && !isFull && (
                  <div className="mt-2 text-center">
                    <button
                      onClick={() => addStudentDirectlyToTeam(activeTeam.id, student.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant Add to Squad</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-normal text-slate-900 font-moara flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[#ff4d15]" />
                Squad Join Applications
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Review applicant skills, compatibility breakdowns, and accept students into {activeTeam.name}.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl liquid-glass border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setRequestsFilter('pending')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  requestsFilter === 'pending'
                    ? 'btn-dark-pill shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingRequests.length})
              </button>
              <button
                onClick={() => setRequestsFilter('accepted')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  requestsFilter === 'accepted'
                    ? 'btn-dark-pill shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Accepted ({acceptedRequests.length})
              </button>
              <button
                onClick={() => setRequestsFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  requestsFilter === 'all'
                    ? 'btn-dark-pill shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-14 text-center rounded-3xl liquid-glass border border-white">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No {requestsFilter} requests found</p>
              <p className="text-xs text-slate-400 mt-1">
                Explore recommended students to proactively recruit the skills you need.
              </p>
              <button
                onClick={() => setActiveTab('candidates')}
                className="mt-4 px-4 py-2 rounded-full text-xs font-bold btn-primary-coral"
              >
                Browse Recommended Members
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const studentObj = students.find((s) => s.id === req.studentId);
                const isAccepted = req.status === 'accepted';
                const isRejected = req.status === 'rejected';

                return (
                  <div
                    key={req.id}
                    className="p-6 rounded-3xl liquid-glass border border-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={req.studentAvatar}
                          alt={req.studentName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{req.studentName}</h4>
                          <span className="text-xs font-extrabold text-[#ff4d15] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                            {req.matchScore}% Match
                          </span>
                          {isAccepted && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accepted Teammate
                            </span>
                          )}
                          {isRejected && (
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                              Declined
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{req.studentRole}</span>
                        {studentObj && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {studentObj.department} • Year {studentObj.year} • Applied {req.createdAt}
                          </span>
                        )}
                        <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 leading-relaxed max-w-xl">
                          "{req.message}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {studentObj && onOpenChatWithStudent && (
                        <button
                          onClick={() => onOpenChatWithStudent(studentObj)}
                          className="px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                      )}

                      {!isAccepted && !isRejected && (
                        <>
                          <button
                            onClick={() => rejectJoinRequest(req.id)}
                            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => acceptJoinRequest(req.id)}
                            disabled={isFull}
                            className="px-5 py-2.5 text-xs font-bold btn-primary-coral rounded-full shadow-md flex items-center gap-1.5 hover:scale-105 transition"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Accept into Squad</span>
                          </button>
                        </>
                      )}

                      {isAccepted && (
                        <button
                          onClick={() => setActiveTab('members')}
                          className="px-4 py-2 rounded-full text-xs font-bold btn-dark-pill shadow-xs"
                        >
                          View in Squad &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-normal text-slate-900 font-moara">Current Squad ({activeTeam.members.length}/{activeTeam.maxMembers})</h3>
            <p className="text-xs text-slate-500 mt-1">
              Manage roles and contributions for all squad members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTeam.members.map((member) => (
              <div
                key={member.studentId}
                className="p-5 rounded-3xl liquid-glass border border-white shadow-sm flex items-start justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={member.profileImage}
                      alt={member.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      {member.fullName}
                      {member.isLeader && (
                        <span className="text-[10px] text-[#ff4d15] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 font-bold">
                          Leader
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{member.role}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Joined {member.joinedAt}
                    </span>
                  </div>
                </div>

                {!member.isLeader && (
                  <button
                    onClick={() => removeMemberFromTeam(activeTeam.id, member.studentId)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition"
                    title="Remove from squad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
