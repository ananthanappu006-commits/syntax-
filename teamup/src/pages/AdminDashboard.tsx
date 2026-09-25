import React, { useState } from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  AlertTriangle,
  Flag,
  BarChart3,
  Layers,
  Search,
  Plus,
  Trash2,
  Check,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SkillCategory } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    teams,
    events,
    projects,
    skills,
    reports,
    toggleVerifyStudent,
    resolveReport,
    addGlobalSkill,
    showToast,
    adminTab: activeTab,
  } = useApp();
  const [studentSearch, setStudentSearch] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('technical');
  const [newSkillAliases, setNewSkillAliases] = useState('');

  const totalStudents = students.length;
  const verifiedStudents = students.filter((s) => s.isVerified).length;
  const studentsWithoutTeams = students.filter((s) => s.teamsJoinedIds.length === 0).length;
  const openTeams = teams.filter((t) => t.status === 'recruiting').length;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  const handleAddSkillToTaxonomy = () => {
    if (!newSkillName.trim()) return;

    addGlobalSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      aliases: newSkillAliases
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    });

    setNewSkillName('');
    setNewSkillAliases('');
  };

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.collegeId.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.department.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-[12px] font-semibold text-[#ff4d15] mb-2 shadow-xs">
            <Shield className="w-3.5 h-3.5" /> Platform Governance &amp; College Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-moara font-bold text-slate-900 tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student ID verifications, team moderation, skill ontologies, and safety reports.
          </p>
        </div>

        {/* Active Section Indicator */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 font-medium">Active Module:</span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-xs capitalize">
            {activeTab === 'overview'
              ? 'Analytics KPI'
              : activeTab === 'students'
              ? `Student Verification (${students.length})`
              : activeTab === 'teams'
              ? `Team Moderation (${teams.length})`
              : activeTab === 'skills'
              ? 'Skills Taxonomy'
              : `Safety Reports (${pendingReports})`}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl liquid-glass-card">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Total Students</span>
          <span className="text-3xl font-moara font-bold text-slate-900 mt-1 block">{totalStudents}</span>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">● {verifiedStudents} Verified</span>
        </div>

        <div className="p-5 rounded-3xl liquid-glass-card">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Solo Students</span>
          <span className="text-3xl font-moara font-bold text-amber-600 mt-1 block">{studentsWithoutTeams}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Looking for squad</span>
        </div>

        <div className="p-5 rounded-3xl liquid-glass-card">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Active Teams</span>
          <span className="text-3xl font-moara font-bold text-[#ff4d15] mt-1 block">{teams.length}</span>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">● {openTeams} Recruiting</span>
        </div>

        <div className="p-5 rounded-3xl liquid-glass-card">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Pending Reports</span>
          <span className="text-3xl font-moara font-bold text-rose-600 mt-1 block">{pendingReports}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Moderation review</span>
        </div>
      </div>

      {/* Overview Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl liquid-glass-card space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-moara">
                <BarChart3 className="w-5 h-5 text-[#ff4d15]" />
                Most Requested Skills by Teams
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="font-medium">Python &amp; ML</span>
                    <strong className="text-slate-900 font-bold">92% of Teams</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff4d15] rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="font-medium">React &amp; Frontend</span>
                    <strong className="text-slate-900 font-bold">85% of Teams</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="font-medium">UI/UX Design (Figma)</span>
                    <strong className="text-slate-900 font-bold">78% of Teams</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="font-medium">APIs &amp; Cloud Infra</span>
                    <strong className="text-slate-900 font-bold">64% of Teams</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl liquid-glass-card space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-moara">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Biggest Skill Gaps Across College
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aggregated deficiency metrics indicating what roles teams struggle to fill:
              </p>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl liquid-glass border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">1. UI/UX Product Designers</span>
                    <span className="text-[11px] text-slate-500">Design systems, Figma &amp; prototyping</span>
                  </div>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">High Deficit</span>
                </div>
                <div className="p-3.5 rounded-2xl liquid-glass border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">2. Machine Learning Specialists</span>
                    <span className="text-[11px] text-slate-500">PyTorch, GenAI &amp; Agent pipelines</span>
                  </div>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">High Deficit</span>
                </div>
                <div className="p-3.5 rounded-2xl liquid-glass border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">3. Pitch Presenters &amp; Storytellers</span>
                    <span className="text-[11px] text-slate-500">Public speaking &amp; business model validation</span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Moderate Gap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Management */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students by name, ID, or department..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl liquid-glass-card p-0 border border-slate-200/80">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">College ID</th>
                  <th className="py-3.5 px-5">Course &amp; Year</th>
                  <th className="py-3.5 px-5">Verified</th>
                  <th className="py-3.5 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-white shadow-xs">
                        <img src={st.profileImage} alt={st.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{st.fullName}</span>
                        <span className="text-[10px] text-slate-400">{st.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-600">{st.collegeId}</td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {st.course} • Year {st.year}
                    </td>
                    <td className="py-3.5 px-5">
                      {st.isVerified ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium">Unverified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => toggleVerifyStudent(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                          st.isVerified
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {st.isVerified ? 'Revoke Verification' : 'Verify Student'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teams Management */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl liquid-glass-card p-0 border border-slate-200/80">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Team</th>
                  <th className="py-3.5 px-5">Event</th>
                  <th className="py-3.5 px-5">Leader</th>
                  <th className="py-3.5 px-5">Members</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teams.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{t.name}</td>
                    <td className="py-3.5 px-5 text-[#ff4d15] font-medium">{t.eventName || 'Independent'}</td>
                    <td className="py-3.5 px-5 text-slate-600">{t.ownerName}</td>
                    <td className="py-3.5 px-5 text-slate-600 font-semibold">
                      {t.members.length} / {t.maxMembers}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          t.status === 'recruiting'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skills Taxonomy Management */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Add skill form */}
          <div className="p-6 sm:p-7 rounded-3xl liquid-glass-card">
            <h3 className="font-bold text-base text-slate-900 mb-1 font-moara">
              Add Global Skill &amp; Aliases
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Maintains standardized skills across all students and algorithms to prevent duplication.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Next.js, PyTorch..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
                >
                  <option value="technical">Technical</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="soft">Soft Skill</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Aliases (Comma-separated)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillAliases}
                    onChange={(e) => setNewSkillAliases(e.target.value)}
                    placeholder="e.g. Next, React SSR"
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
                  />
                  <button
                    onClick={handleAddSkillToTaxonomy}
                    className="px-4 py-2 text-xs font-semibold btn-primary-coral rounded-xl shadow-sm transition shrink-0 cursor-pointer"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Skills List */}
          <div className="p-6 sm:p-7 rounded-3xl liquid-glass-card">
            <h4 className="font-bold text-sm text-slate-900 mb-3 font-moara">
              Standardized Skills Database ({skills.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((sk) => (
                <div
                  key={sk.id}
                  className="p-2.5 rounded-2xl liquid-glass border border-slate-200 text-xs flex items-center gap-2 shadow-xs"
                >
                  <span className="font-bold text-slate-800">{sk.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded-full font-medium">
                    {sk.category}
                  </span>
                  {sk.aliases && sk.aliases.length > 0 && (
                    <span className="text-[10px] text-[#ff4d15] font-medium">
                      ({sk.aliases.join(', ')})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Review */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">No reports on file.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-3xl liquid-glass-card flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-rose-500" />
                      <span className="font-bold text-sm text-slate-900">{rep.reason}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          rep.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-1">
                      Reported Target: <strong className="text-slate-900">{rep.targetName}</strong> ({rep.targetType}) by {rep.reporterName} on {rep.createdAt}
                    </span>
                    <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-xl italic">
                      "{rep.description}"
                    </p>
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => resolveReport(rep.id, 'dismissed')}
                        className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => resolveReport(rep.id, 'resolved')}
                        className="px-4 py-2 text-xs font-semibold btn-primary-coral rounded-xl shadow-xs transition"
                      >
                        Resolve &amp; Action
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
