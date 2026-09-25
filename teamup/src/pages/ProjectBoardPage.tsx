import React, { useState } from 'react';
import { Lightbulb, Plus, Sparkles, Users, ArrowRight, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectIdea } from '../types';

export const ProjectBoardPage: React.FC = () => {
  const { projects, createProject, events, skills, showToast } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [reqSkills, setReqSkills] = useState<string[]>([]);
  const [reqRoles, setReqRoles] = useState<string[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  // Section 20: Heuristic skill suggestions
  const handleAutoSuggestSkills = () => {
    const text = `${newTitle} ${newDesc} ${newProblem} ${newSolution}`.toLowerCase();
    const suggestions: string[] = [];

    if (text.includes('ai') || text.includes('ml') || text.includes('predict') || text.includes('agent') || text.includes('vision') || text.includes('learning')) {
      suggestions.push('Python', 'Machine Learning', 'TensorFlow', 'Data Science');
    }
    if (text.includes('web') || text.includes('frontend') || text.includes('interface') || text.includes('app') || text.includes('platform')) {
      suggestions.push('React', 'TypeScript', 'UI/UX Design', 'Figma');
    }
    if (text.includes('contract') || text.includes('web3') || text.includes('crypto') || text.includes('block')) {
      suggestions.push('Solidity', 'Node.js');
    }
    if (text.includes('iot') || text.includes('sensor') || text.includes('hardware') || text.includes('energy')) {
      suggestions.push('IoT & Embedded', 'Python');
    }
    if (text.includes('backend') || text.includes('api') || text.includes('database')) {
      suggestions.push('Node.js', 'Firebase', 'PostgreSQL');
    }

    suggestions.push('Presentation & Pitching');

    const uniqueSuggestions = Array.from(new Set(suggestions));
    setSuggestedSkills(uniqueSuggestions);
    showToast('Skills Recommended', `Suggested ${uniqueSuggestions.length} skills based on project topic!`, 'info');
  };

  const handleCreateProject = () => {
    if (!newTitle.trim()) {
      showToast('Title Required', 'Please provide a project title.', 'warning');
      return;
    }

    createProject({
      title: newTitle,
      description: newDesc,
      problemStatement: newProblem,
      proposedSolution: newSolution,
      eventId: selectedEventId || undefined,
      requiredSkills: reqSkills.length > 0 ? reqSkills : ['React', 'Python'],
      requiredRoles: reqRoles.length > 0 ? reqRoles : ['Full Stack Developer'],
      openPositions: 3,
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewProblem('');
    setNewSolution('');
    setReqSkills([]);
    setSuggestedSkills([]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 font-moara">
              Project Ideas Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pitch student project concepts, recruit collaborators, or discover innovative problem statements.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-full text-xs font-bold btn-primary-coral flex items-center gap-1.5 self-start md:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Project Idea</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="liquid-glass-card rounded-3xl p-6 flex flex-col justify-between"
          >
            <div>
              {/* Creator Info */}
              <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={proj.creatorAvatar}
                    alt={proj.creatorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{proj.creatorName}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">Project Architect</span>
                </div>
                <span className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                  {proj.status.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-lg text-slate-900 mt-4 font-uber">{proj.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                {proj.description}
              </p>

              {/* Problem / Solution preview */}
              {proj.problemStatement && (
                <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1.5">
                  <div>
                    <strong className="text-rose-600 font-semibold">Problem: </strong>
                    <span className="text-slate-600">{proj.problemStatement}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-700 font-semibold">Solution: </strong>
                    <span className="text-slate-600">{proj.proposedSolution}</span>
                  </div>
                </div>
              )}

              {/* Skills Needed */}
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Looking For Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.requiredSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/70"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-[#ff4d15] font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {proj.openPositions} Open Positions
              </span>
              <button
                onClick={() =>
                  showToast(
                    'Interest Registered',
                    `You registered interest in "${proj.title}". The creator will receive your profile!`,
                    'success'
                  )
                }
                className="px-4 py-2 rounded-full text-xs font-bold btn-primary-coral"
              >
                Join Project &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl liquid-glass border border-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-2xl font-normal text-slate-900 font-moara">Publish Project Idea</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Share your project concept and find suitable teammates.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI-powered Smart Campus Assistant"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#ff4d15]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Brief Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summarize what your project builds and its core features..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#ff4d15] resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Problem Statement</label>
                  <textarea
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                    placeholder="What pain point does this solve?"
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#ff4d15] resize-none h-18"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Proposed Solution</label>
                  <textarea
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    placeholder="How will your tech stack solve it?"
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#ff4d15] resize-none h-18"
                  />
                </div>
              </div>

              {/* Event Link */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Hackathon (Optional)</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#ff4d15]"
                >
                  <option value="">Independent Project (No Event)</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section 20: AI Smart Skill Suggestion */}
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <Sparkles className="w-4 h-4 text-[#ff4d15]" />
                    <span>Project-Based Skill Recommender (Section 20)</span>
                  </div>
                  <button
                    onClick={handleAutoSuggestSkills}
                    className="px-3 py-1 text-[11px] font-bold btn-primary-coral rounded-full"
                  >
                    Suggest Skills
                  </button>
                </div>

                {suggestedSkills.length > 0 && (
                  <div>
                    <span className="text-[11px] text-slate-600 block mb-1.5 font-medium">
                      Click to accept recommended skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSkills.map((sk, i) => {
                        const isAdded = reqSkills.includes(sk);
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (isAdded) {
                                setReqSkills(reqSkills.filter((s) => s !== sk));
                              } else {
                                setReqSkills([...reqSkills, sk]);
                              }
                            }}
                            className={`text-xs px-3 py-1 rounded-full border transition flex items-center gap-1 ${
                              isAdded
                                ? 'bg-[#ff4d15] text-white border-[#ff4d15] font-bold'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                            }`}
                          >
                            {isAdded ? <Check className="w-3 h-3" /> : '+'}
                            {sk}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-6 py-2.5 text-xs font-bold btn-primary-coral rounded-full shadow-md"
              >
                Publish Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
