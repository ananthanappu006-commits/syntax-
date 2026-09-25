import React, { useState } from 'react';
import { Search, Users, Filter, Sparkles, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeamCard } from '../components/teams/TeamCard';
import { Team } from '../types';
import { calculateMatchScore } from '../services/matchingEngine';

interface FindTeamsProps {
  onSelectTeamDetails?: (team: Team) => void;
  onOpenCreateTeam: () => void;
}

export const FindTeams: React.FC<FindTeamsProps> = ({
  onSelectTeamDetails,
  onOpenCreateTeam,
}) => {
  const { teams, events, currentUser, selectedEventFilter, setSelectedEventFilter } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'recruiting'>('recruiting');
  const [minMatch, setMinMatch] = useState<number>(0);

  const allTeamSkills = Array.from(
    new Set(teams.flatMap((t) => t.requiredSkills.map((req) => req.skillName)))
  ).sort();

  const teamsWithScores = teams.map((team) => ({
    team,
    breakdown: calculateMatchScore(currentUser, team),
  }));

  const filteredTeams = teamsWithScores.filter(({ team, breakdown }) => {
    if (statusFilter === 'recruiting' && team.status !== 'recruiting') return false;

    if (selectedEventFilter && team.eventId !== selectedEventFilter) return false;

    if (minMatch > 0 && breakdown.finalScore < minMatch) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = team.name.toLowerCase().includes(q);
      const matchDesc = team.description.toLowerCase().includes(q);
      const matchEvent = team.eventName?.toLowerCase().includes(q);
      const matchProj = team.projectTitle?.toLowerCase().includes(q);
      const matchSkill = team.requiredSkills.some((s) => s.skillName.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchEvent && !matchProj && !matchSkill) return false;
    }

    if (selectedSkill) {
      const hasSkill = team.requiredSkills.some(
        (s) => s.skillName.toLowerCase() === selectedSkill.toLowerCase()
      );
      if (!hasSkill) return false;
    }

    return true;
  });

  filteredTeams.sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('');
    setSelectedEventFilter(null);
    setStatusFilter('recruiting');
    setMinMatch(0);
  };

  const hasActiveFilters =
    searchQuery || selectedSkill || selectedEventFilter || statusFilter !== 'recruiting' || minMatch > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#ff4d15]" />
            <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 font-moara">
              Discover &amp; Join Squads
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse active teams recruiting members for college hackathons, competitions, and projects.
          </p>
        </div>

        <button
          onClick={onOpenCreateTeam}
          className="px-5 py-2.5 rounded-full text-xs font-bold btn-primary-coral flex items-center gap-1.5 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Squad</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl liquid-glass border border-white shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams by name, required skill (Python, ML...), event name, or project title..."
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff4d15] shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div>
            <select
              value={selectedEventFilter || ''}
              onChange={(e) => setSelectedEventFilter(e.target.value || null)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="">All Events &amp; Hackathons</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="">All Required Skills</option>
              {allTeamSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="0">Any Match %</option>
              <option value="70">70%+ Compatibility</option>
              <option value="85">85%+ High Synergy</option>
              <option value="90">90%+ Top Match</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="recruiting">Recruiting Only</option>
              <option value="all">All Teams (Incl. Full)</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredTeams.length}</strong> matching squads
            </span>
            <button
              onClick={clearFilters}
              className="text-[#ff4d15] hover:underline flex items-center gap-1 font-bold"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="p-16 text-center rounded-3xl liquid-glass border border-white space-y-3">
          <p className="text-base font-bold text-slate-900">No teams match your active filter.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your filters or create a new squad for your favorite hackathon!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-xs font-bold text-[#ff4d15] hover:underline"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenCreateTeam}
              className="px-5 py-2 text-xs font-bold btn-primary-coral rounded-full"
            >
              Create Squad
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(({ team, breakdown }) => (
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
  );
};
