import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeamCard } from '../components/teams/TeamCard';
import { getRecommendedTeamsForStudent } from '../services/matchingEngine';
import { Team } from '../types';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenCreateTeam: () => void;
  onSelectTeamDetails?: (team: Team) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onOpenCreateTeam,
  onSelectTeamDetails,
}) => {
  const {
    currentUser,
    teams,
    events,
    teamInvitations,
    joinRequests,
    acceptTeamInvitation,
    declineTeamInvitation,
    toggleLookingForTeam,
    selectedEventFilter,
    setSelectedEventFilter,
  } = useApp();

  // Find teams the student has joined
  const myJoinedTeams = teams.filter((t) =>
    t.members.some((m) => m.studentId === currentUser.id)
  );

  // Incoming invitations
  const myIncomingInvitations = teamInvitations.filter(
    (inv) => inv.studentId === currentUser.id && inv.status === 'pending'
  );

  // Sent requests
  const mySentRequests = joinRequests.filter(
    (req) => req.studentId === currentUser.id
  );

  // Recommended teams
  const recommendedTeamsWithBreakdown = getRecommendedTeamsForStudent(
    currentUser,
    teams,
    selectedEventFilter || undefined
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 font-moara">
              Welcome back, {currentUser.fullName.split(' ')[0]} 👋
            </h1>
            {currentUser.isVerified && (
              <span
                title="Verified College Student"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser.course} • Year {currentUser.year} • {currentUser.collegeName}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => toggleLookingForTeam(currentUser.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition flex items-center gap-2 ${
              currentUser.isLookingForTeam
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                currentUser.isLookingForTeam ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {currentUser.isLookingForTeam ? 'Recruiting: Active' : 'Recruiting: Paused'}
          </button>

          <button
            onClick={onOpenCreateTeam}
            className="px-5 py-2.5 rounded-full text-xs font-bold btn-primary-coral flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Squad</span>
          </button>
        </div>
      </div>

      {/* Team Status & Highlights (Liquid Glass cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: My Current Team */}
        <div className="lg:col-span-1 p-6 rounded-3xl liquid-glass border border-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                My Squad Status
              </span>
              {myJoinedTeams.length > 0 && (
                <span className="text-[10px] font-bold text-[#ff4d15] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  {myJoinedTeams.length} Active
                </span>
              )}
            </div>

            {myJoinedTeams.length === 0 ? (
              <div className="my-6 text-center space-y-2">
                <div className="w-13 h-13 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto text-[#ff4d15]">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">No Squad Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  You haven't joined a team yet. Find student peers or teams that match your skills.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('find-teams')}
                    className="px-5 py-2 rounded-full text-xs font-bold btn-primary-coral"
                  >
                    Find a Squad
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {myJoinedTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{team.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {team.eventName || 'Independent Project'}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {team.members.length} / {team.maxMembers} members
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectTeamDetails?.(team)}
                      className="px-3 py-1.5 text-xs font-bold text-[#ff4d15] bg-orange-50 hover:bg-[#ff4d15] hover:text-white rounded-full transition"
                    >
                      Manage &rarr;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Skill snapshot */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-700">My Profile Skills</span>
              <button
                onClick={() => onNavigate('profile')}
                className="text-[11px] font-bold text-[#ff4d15] hover:underline"
              >
                Edit Profile
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.skills.slice(0, 5).map((sk, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium"
                >
                  {sk.skillName}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Invitations & Hackathons banner */}
        <div className="lg:col-span-2 space-y-4">
          {/* Incoming Invitations Banner */}
          {myIncomingInvitations.length > 0 && (
            <div className="p-5 rounded-3xl liquid-glass border border-orange-200/80 bg-gradient-to-r from-orange-50/70 via-white to-amber-50/50 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d15] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ff4d15]" />
                  Team Invitations ({myIncomingInvitations.length})
                </span>
              </div>

              <div className="space-y-3">
                {myIncomingInvitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{inv.teamName}</span>
                        <span className="text-xs font-extrabold text-[#ff4d15] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                          {inv.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">
                        "{inv.message}"
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Invited by {inv.invitedByName} • {inv.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => declineTeamInvitation(inv.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptTeamInvitation(inv.id)}
                        className="px-4 py-2 text-xs font-bold btn-primary-coral rounded-full shadow-sm"
                      >
                        Accept &amp; Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Hackathons Forming Now */}
          <div className="p-6 rounded-3xl liquid-glass border border-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#ff4d15]" />
                Hackathons Forming Now
              </span>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-bold text-[#ff4d15] hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.slice(0, 2).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    setSelectedEventFilter(ev.id);
                    onNavigate('find-teams');
                  }}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#ff4d15]/50 cursor-pointer transition shadow-sm hover:shadow-md"
                >
                  <h5 className="font-bold text-xs text-slate-900 truncate">{ev.title}</h5>
                  <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-500">
                    <span className="text-emerald-700 font-bold">{ev.prizePool}</span>
                    <span>Deadline: {ev.registrationDeadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Teams Section */}
      <div className="space-y-5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff4d15]" />
              <h2 className="text-2xl font-normal text-slate-900 font-moara">
                Smart Recommended Squads
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked dynamically by your skills, role alignment, interests, and schedule
            </p>
          </div>

          {/* Event Filter Chip */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Event:
            </span>
            <select
              value={selectedEventFilter || ''}
              onChange={(e) => setSelectedEventFilter(e.target.value ? e.target.value : null)}
              className="text-xs bg-white border border-slate-200 rounded-full px-3 py-1.5 text-slate-800 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="">All Events &amp; Projects</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Teams Cards Grid */}
        {recommendedTeamsWithBreakdown.length === 0 ? (
          <div className="p-14 text-center rounded-3xl liquid-glass border border-white">
            <p className="text-sm text-slate-500 font-medium">
              No matching teams found matching the active filters.
            </p>
            <button
              onClick={() => setSelectedEventFilter(null)}
              className="mt-3 px-4 py-2 text-xs font-bold text-[#ff4d15] hover:underline"
            >
              Clear Event Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedTeamsWithBreakdown.map(({ team, breakdown }) => (
              <TeamCard
                key={team.id}
                team={team}
                customBreakdown={breakdown}
                onViewDetails={onSelectTeamDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sent Join Requests Status Drawer */}
      {mySentRequests.length > 0 && (
        <div className="pt-8 border-t border-slate-200/80">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            My Active Join Requests ({mySentRequests.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySentRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{req.teamName}</h4>
                      <span className="text-[11px] text-slate-400">{req.createdAt}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        req.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    "{req.message}"
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Match Score: <strong className="text-slate-800">{req.matchScore}%</strong></span>
                  {req.status === 'accepted' && (
                    <span className="text-emerald-700 font-bold">Joined Squad!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
