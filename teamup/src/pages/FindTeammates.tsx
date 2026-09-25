import React, { useState } from 'react';
import { Search, Filter, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentCard } from '../components/students/StudentCard';
import { Student } from '../types';

interface FindTeammatesProps {
  onViewProfile?: (student: Student) => void;
  onOpenChat?: (student: Student) => void;
}

export const FindTeammates: React.FC<FindTeammatesProps> = ({ onViewProfile, onOpenChat }) => {
  const { students, currentUser, teams } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [onlyLooking, setOnlyLooking] = useState(true);

  const userLedTeams = teams.filter((t) => t.ownerId === currentUser.id);
  const activeTeam = userLedTeams[0];

  const allSkills = Array.from(
    new Set(students.flatMap((s) => s.skills.map((sk) => sk.skillName)))
  ).sort();

  const allRoles = Array.from(
    new Set(students.flatMap((s) => s.preferredRoles))
  ).sort();

  const filteredStudents = students.filter((s) => {
    if (s.id === currentUser.id) return false;
    if (onlyLooking && !s.isLookingForTeam) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.fullName.toLowerCase().includes(q);
      const matchBio = s.bio.toLowerCase().includes(q);
      const matchDept = s.department.toLowerCase().includes(q);
      const matchSkill = s.skills.some((sk) => sk.skillName.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchDept && !matchSkill) return false;
    }

    if (selectedSkill) {
      const hasSkill = s.skills.some(
        (sk) => sk.skillName.toLowerCase() === selectedSkill.toLowerCase()
      );
      if (!hasSkill) return false;
    }

    if (selectedRole) {
      const hasRole = s.preferredRoles.some(
        (r) => r.toLowerCase() === selectedRole.toLowerCase()
      );
      if (!hasRole) return false;
    }

    if (selectedYear && s.year.toString() !== selectedYear) {
      return false;
    }

    if (selectedMode && s.availability.mode !== selectedMode) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('');
    setSelectedRole('');
    setSelectedYear('');
    setSelectedMode('');
    setOnlyLooking(true);
  };

  const hasActiveFilters =
    searchQuery || selectedSkill || selectedRole || selectedYear || selectedMode;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#ff4d15]" />
            <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 font-moara">
              Find Teammates &amp; Collaborators
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified college students with the exact skills your squad requires.
          </p>
        </div>

        {activeTeam && (
          <div className="px-4 py-2 rounded-full liquid-glass border border-orange-200 text-xs shadow-sm">
            <span className="text-slate-500">Matching against your squad:</span>{' '}
            <strong className="text-[#ff4d15] font-bold">{activeTeam.name}</strong>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl liquid-glass border border-white shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, skill (Python, React, Figma...), department, or bio..."
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff4d15] shadow-sm"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 text-xs">
          <div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="">All Skills</option>
              {allSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="">All Roles</option>
              {allRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="">All College Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 font-semibold focus:outline-none focus:border-[#ff4d15] shadow-sm"
            >
              <option value="">Any Mode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex items-center justify-center col-span-2 sm:col-span-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={onlyLooking}
                onChange={(e) => setOnlyLooking(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff4d15] focus:ring-0"
              />
              <span>Seeking Squad</span>
            </label>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Found <strong className="text-slate-900">{filteredStudents.length}</strong> matching candidates
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

      {/* Candidate Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="p-16 text-center rounded-3xl liquid-glass border border-white space-y-2">
          <p className="text-base font-bold text-slate-900">No students match your search criteria.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try loosening filters or searching by a broader skill keyword like "Python", "React", or "Design".
          </p>
          <button
            onClick={clearFilters}
            className="mt-3 px-4 py-2 text-xs font-bold text-[#ff4d15] hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              activeTeam={activeTeam}
              onViewProfile={onViewProfile}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};
