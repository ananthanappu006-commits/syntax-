import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Plus,
  Trash2,
  Globe,
  Clock,
  Briefcase,
  Award,
  Sparkles,
  Check,
  Edit3,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/SocialIcons';
import { useApp } from '../context/AppContext';
import { ProficiencyLevel, SkillCategory, StudentSkill } from '../types';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    skills: globalSkills,
    updateStudentProfile,
    addStudentSkill,
    removeStudentSkill,
    toggleLookingForTeam,
  } = useApp();

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [selectedSkillName, setSelectedSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('technical');
  const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyLevel>('intermediate');
  const [yearsExp, setYearsExp] = useState<number>(1);

  // Edit bio & links state
  const [bio, setBio] = useState(currentUser.bio);
  const [githubUrl, setGithubUrl] = useState(currentUser.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.linkedinUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolioUrl || '');

  const handleSaveBioAndLinks = () => {
    updateStudentProfile(currentUser.id, {
      bio,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    });
  };

  const handleAddSkill = () => {
    if (!selectedSkillName.trim()) return;

    const matchedGlobal = globalSkills.find(
      (s) => s.name.toLowerCase() === selectedSkillName.trim().toLowerCase()
    );

    const newSkill: StudentSkill = {
      skillId: matchedGlobal ? matchedGlobal.id : `sk-custom-${Date.now()}`,
      skillName: matchedGlobal ? matchedGlobal.name : selectedSkillName.trim(),
      category: matchedGlobal ? matchedGlobal.category : selectedCategory,
      proficiency: selectedProficiency,
      yearsExperience: yearsExp,
    };

    addStudentSkill(currentUser.id, newSkill);
    setShowAddSkillModal(false);
    setSelectedSkillName('');
  };

  const getProficiencyBadge = (level: ProficiencyLevel) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'advanced':
        return 'bg-[#ff4d15]/10 text-[#ff4d15] border-[#ff4d15]/30';
      case 'intermediate':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-card relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-md shrink-0">
              <img
                src={currentUser.profileImage}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-moara font-bold text-slate-900 tracking-tight">
                  {currentUser.fullName}
                </h1>
                {currentUser.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Student
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#ff4d15] font-semibold mt-1">
                {currentUser.course} • Year {currentUser.year} (Sem {currentUser.semester})
              </p>

              <span className="text-xs text-slate-500 block mt-0.5">
                {currentUser.collegeName} • ID: <span className="font-mono">{currentUser.collegeId}</span>
              </span>
            </div>
          </div>

          {/* Availability Status Button */}
          <button
            onClick={() => toggleLookingForTeam(currentUser.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition shadow-xs self-start sm:self-center cursor-pointer ${
              currentUser.isLookingForTeam
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {currentUser.isLookingForTeam ? '● Status: Looking for Team' : '○ Status: Inactive'}
          </button>
        </div>

        {/* Bio Editor */}
        <div className="mt-6 pt-6 border-t border-slate-200/80">
          <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-slate-400" /> About Me &amp; Pitch
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-white/80 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] resize-none h-20 transition"
          />

          {/* Social Links Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-slate-800" /> GitHub URL
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5 flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#ff4d15]" /> Portfolio URL
              </label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://myportfolio.dev"
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15] transition"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveBioAndLinks}
              className="px-4 py-2 text-xs font-semibold btn-dark-pill shadow-xs transition"
            >
              Save Profile Info
            </button>
          </div>
        </div>
      </div>

      {/* Skills Section with Proficiency */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-moara">
              <Award className="w-5 h-5 text-[#ff4d15]" />
              Verified Skills &amp; Proficiency
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proficiency levels directly determine your compatibility scores in team matching.
            </p>
          </div>
          <button
            onClick={() => setShowAddSkillModal(true)}
            className="px-4 py-2 text-xs font-semibold btn-primary-coral rounded-2xl shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </button>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
          {currentUser.skills.map((skill) => (
            <div
              key={skill.skillId}
              className="p-3.5 rounded-2xl liquid-glass border border-slate-200/80 flex items-center justify-between shadow-xs hover:border-[#ff4d15]/30 transition"
            >
              <div>
                <h4 className="font-bold text-xs text-slate-900">{skill.skillName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border ${getProficiencyBadge(
                      skill.proficiency
                    )}`}
                  >
                    {skill.proficiency}
                  </span>
                  {skill.yearsExperience && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {skill.yearsExperience} yr{skill.yearsExperience > 1 ? 's' : ''} exp
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeStudentSkill(currentUser.id, skill.skillId)}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition"
                title="Remove skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Roles & Availability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferred Roles */}
        <div className="p-6 rounded-3xl liquid-glass-card">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3 font-moara">
            <Briefcase className="w-4 h-4 text-[#ff4d15]" />
            Preferred Team Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.preferredRoles.map((role, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="p-6 rounded-3xl liquid-glass-card">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3 font-moara">
            <Clock className="w-4 h-4 text-amber-500" />
            Availability &amp; Schedule
          </h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-400">Collaboration Mode:</span>
              <strong className="text-slate-900 capitalize font-semibold">{currentUser.availability.mode}</strong>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-400">Weekend Commitment:</span>
              <strong className={currentUser.availability.weekends ? 'text-emerald-600' : 'text-slate-500'}>
                {currentUser.availability.weekends ? 'Available on Weekends' : 'Weekdays Only'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Preferred Hours:</span>
              <strong className="text-[#ff4d15] font-semibold">
                {currentUser.availability.hoursPerWeek} hrs / week
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md liquid-glass border border-white rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <h3 className="text-lg font-bold text-slate-900 font-moara">Add Skill to Profile</h3>
              <button
                onClick={() => setShowAddSkillModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Skill Name</label>
                <input
                  type="text"
                  value={selectedSkillName}
                  onChange={(e) => setSelectedSkillName(e.target.value)}
                  placeholder="e.g. Python, Docker, Figma, Solidity..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Proficiency Level
                </label>
                <select
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
                >
                  <option value="beginner">Beginner (Basic understanding)</option>
                  <option value="intermediate">Intermediate (Built projects)</option>
                  <option value="advanced">Advanced (Production experience)</option>
                  <option value="expert">Expert (Hackathon winner / Specialized)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
                >
                  <option value="technical">Technical</option>
                  <option value="design">Design</option>
                  <option value="business">Business / PM</option>
                  <option value="soft">Soft Skill / Pitching</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Years of Experience</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={yearsExp}
                  onChange={(e) => setYearsExp(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff4d15]/20 focus:border-[#ff4d15]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80">
              <button
                onClick={() => setShowAddSkillModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="px-5 py-2.5 text-xs font-semibold btn-primary-coral rounded-2xl shadow-sm transition"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
