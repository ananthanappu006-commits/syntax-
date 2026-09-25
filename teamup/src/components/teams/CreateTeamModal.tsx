import React, { useState } from 'react';
import { Plus, X, Sparkles, Check, Users, Calendar, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TeamSkillRequirement, SkillCategory, ProficiencyLevel } from '../../types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEventId?: string;
  onTeamCreated?: (teamId: string) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  preselectedEventId,
  onTeamCreated,
}) => {
  const { events, skills, currentUser, createTeam, showToast } = useApp();

  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(preselectedEventId || '');
  const [projectTitle, setProjectTitle] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [weekendsRequired, setWeekendsRequired] = useState(true);
  const [mode, setMode] = useState<'online' | 'offline' | 'hybrid'>('hybrid');

  // Skill requirements
  const [requiredSkills, setRequiredSkills] = useState<TeamSkillRequirement[]>([
    {
      skillId: 'sk-1',
      skillName: 'Python',
      category: 'technical',
      requirementType: 'required',
      minimumProficiency: 'intermediate',
    },
    {
      skillId: 'sk-3',
      skillName: 'React',
      category: 'technical',
      requirementType: 'required',
      minimumProficiency: 'intermediate',
    },
  ]);

  const [skillSearch, setSkillSearch] = useState('');
  const [newSkillReqType, setNewSkillReqType] = useState<'required' | 'preferred'>('required');

  // Roles
  const [requiredRoles, setRequiredRoles] = useState<string[]>(['Frontend Developer', 'AI/ML Developer']);
  const [newRoleInput, setNewRoleInput] = useState('');

  if (!isOpen) return null;

  const handleAddSkill = (skillName: string, category: SkillCategory = 'technical') => {
    if (requiredSkills.some((s) => s.skillName.toLowerCase() === skillName.toLowerCase())) return;

    setRequiredSkills((prev) => [
      ...prev,
      {
        skillId: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        skillName,
        category,
        requirementType: newSkillReqType,
        minimumProficiency: 'intermediate',
      },
    ]);
    setSkillSearch('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setRequiredSkills((prev) => prev.filter((s) => s.skillName !== skillName));
  };

  const handleAddRole = () => {
    if (!newRoleInput.trim() || requiredRoles.includes(newRoleInput.trim())) return;
    setRequiredRoles((prev) => [...prev, newRoleInput.trim()]);
    setNewRoleInput('');
  };

  const handleRemoveRole = (role: string) => {
    setRequiredRoles((prev) => prev.filter((r) => r !== role));
  };

  // Section 20: Heuristic Auto-Suggest skills
  const handleAutoSuggestSkills = () => {
    const text = `${teamName} ${description} ${projectTitle}`.toLowerCase();
    const suggestions: string[] = [];

    if (text.includes('ai') || text.includes('ml') || text.includes('data') || text.includes('bot')) {
      suggestions.push('Python', 'Machine Learning', 'TensorFlow');
    }
    if (text.includes('web') || text.includes('app') || text.includes('platform')) {
      suggestions.push('React', 'UI/UX Design', 'Figma');
    }
    if (text.includes('web3') || text.includes('crypto') || text.includes('chain')) {
      suggestions.push('Solidity', 'Node.js');
    }
    if (text.includes('iot') || text.includes('hardware') || text.includes('sensor')) {
      suggestions.push('C++', 'Python');
    }

    if (suggestions.length === 0) {
      suggestions.push('React', 'Python', 'UI/UX Design');
    }

    let addedCount = 0;
    suggestions.forEach((s) => {
      if (!requiredSkills.some((existing) => existing.skillName.toLowerCase() === s.toLowerCase())) {
        handleAddSkill(s);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      showToast(`Auto-suggested ${addedCount} skills based on your project description!`, 'info');
    } else {
      showToast('All relevant skills already added.', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      showToast('Please enter a team name', 'error');
      return;
    }

    const targetEvent = events.find((ev) => ev.id === selectedEventId);

    const created = createTeam({
      name: teamName.trim(),
      description: description.trim(),
      eventId: selectedEventId || undefined,
      eventName: targetEvent?.title,
      projectTitle: projectTitle.trim() || undefined,
      maxMembers,
      status: 'recruiting',
      visibility: 'college',
      ownerId: currentUser.id,
      ownerName: currentUser.fullName,
      requiredSkills,
      requiredRoles,
      preferredRoles: requiredRoles,
      availabilityRequirements: {
        weekendsRequired,
        mode,
      },
    });

    onTeamCreated?.(created.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in font-uber">
      <div className="w-full max-w-2xl liquid-glass border border-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-[#ff4d15] bg-[#ff4d15]/10 mb-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Create &amp; Recruit Squad
            </span>
            <h2 className="text-2xl sm:text-3xl font-moara font-bold text-slate-900">Create New Team</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Define required skills to receive instant smart matches from our matching engine.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="my-5 space-y-4 text-xs">
          {/* Team Name */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Team Name *</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. CodeStorm, AI Innovators, ByteBandits"
              className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Team Vision &amp; Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your squad is building and what kind of collaborators you seek..."
              className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] resize-none h-20 transition"
            />
          </div>

          {/* Event & Project Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Hackathon (Optional)</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
              >
                <option value="">Independent Project (No Event)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.minTeamSize}-{ev.maxTeamSize} members)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project Working Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Smart Campus Assistant"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
              />
            </div>
          </div>

          {/* Max Members & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Team Capacity</label>
              <select
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
              >
                <option value={2}>2 Members (Duo)</option>
                <option value={3}>3 Members</option>
                <option value={4}>4 Members</option>
                <option value={5}>5 Members</option>
                <option value={6}>6 Members</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Collaboration Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
              >
                <option value="hybrid">Hybrid (Online + Campus)</option>
                <option value="online">Online Only</option>
                <option value="offline">In-Person Only</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={weekendsRequired}
                  onChange={(e) => setWeekendsRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-[#ff4d15] focus:ring-0"
                />
                <span className="font-medium text-slate-700">Weekends Required</span>
              </label>
            </div>
          </div>

          {/* Searchable Skill Chips */}
          <div className="p-4 rounded-2xl liquid-glass border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-900 text-xs block">Required &amp; Preferred Skills</label>
                <p className="text-[11px] text-slate-500">
                  Required skills carry 3x algorithmic weight in student-to-team matching.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoSuggestSkills}
                className="px-3 py-1 text-[11px] font-semibold text-[#ff4d15] bg-[#ff4d15]/10 hover:bg-[#ff4d15] hover:text-white rounded-xl transition flex items-center gap-1 border border-[#ff4d15]/30 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Suggest</span>
              </button>
            </div>

            {/* Selected Skill Chips */}
            <div className="flex flex-wrap gap-2 min-h-8">
              {requiredSkills.map((sk) => (
                <span
                  key={sk.skillName}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    sk.requirementType === 'required'
                      ? 'bg-[#ff4d15]/10 text-[#ff4d15] border-[#ff4d15]/30'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{sk.skillName}</span>
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-100 font-bold text-slate-500">
                    {sk.requirementType}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk.skillName)}
                    className="hover:text-rose-600 ml-0.5 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2 pt-1">
              <select
                value={newSkillReqType}
                onChange={(e) => setNewSkillReqType(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none"
              >
                <option value="required">Required</option>
                <option value="preferred">Preferred</option>
              </select>

              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Type skill name (e.g. Python, UI/UX, Docker) and click Add..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
              />

              <button
                type="button"
                onClick={() => {
                  if (skillSearch.trim()) handleAddSkill(skillSearch.trim());
                }}
                className="px-3.5 py-1.5 btn-primary-coral rounded-xl font-semibold shadow-xs cursor-pointer"
              >
                + Add
              </button>
            </div>

            {/* Quick popular suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Python', 'React', 'Machine Learning', 'UI/UX Design', 'Firebase', 'Solidity'].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => handleAddSkill(s)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer transition"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Missing Roles Required */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Roles Needed</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredRoles.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 text-xs shadow-xs"
                >
                  {r}
                  <button type="button" onClick={() => handleRemoveRole(r)} className="hover:text-rose-500 font-bold ml-1 cursor-pointer">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                placeholder="Add role: e.g. UI/UX Designer, AI/ML Developer, Presenter..."
                className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Add Role
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold btn-primary-coral rounded-2xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Team</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
