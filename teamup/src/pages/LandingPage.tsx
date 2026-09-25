import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Search,
  MapPin,
  Tag,
  ArrowRight,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  Trophy,
  Zap,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreateTeam: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenCreateTeam }) => {
  const { students, teams, events, setSelectedEventFilter } = useApp();

  const [searchRole, setSearchRole] = useState('');
  const [searchEvent, setSearchEvent] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [searchSize, setSearchSize] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEvent) {
      setSelectedEventFilter(searchEvent);
    }
    onNavigate('find-teams');
  };

  return (
    <div className="min-h-screen text-slate-900 space-y-20 pb-24">
      {/* Hero Section — Exact Replica of Homrent Dribbble Layout */}
      <section className="relative pt-10 sm:pt-14 px-4 max-w-6xl mx-auto text-center">
        {/* Rating Pill Badge (Dribbble Reference: ★ 4.8 Average user rating) */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold text-slate-700 mb-6 shadow-sm">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-slate-900">4.9</span>
          <span className="text-slate-500 font-normal">Average team match compatibility</span>
        </div>

        {/* Massive Headline in Athelas / Moara Serif (Dribbble: "Find Your Room") */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-normal text-slate-900 tracking-tight font-moara leading-[1.08] max-w-4xl mx-auto">
          Find Your Team
        </h1>

        {/* Subheading in Uber Sans */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-uber leading-relaxed">
          Discover the best teams and teammates that match your skills, role, and college hackathon ambitions.
        </p>

        {/* Floating Multi-Segment Liquid Glass Search Bar (Exact Dribbble Replica) */}
        <div className="mt-10 max-w-4xl mx-auto">
          <form
            onSubmit={handleHeroSearch}
            className="liquid-search-bar rounded-3xl p-3 sm:p-3.5 flex flex-col md:flex-row items-center gap-3 text-left transition-all"
          >
            {/* 1. Looking for */}
            <div className="flex-1 w-full px-3 py-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-uber">
                Looking for
              </label>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  placeholder="Enter Role or Skill"
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200/80" />

            {/* 2. Locations / Hackathon */}
            <div className="flex-1 w-full px-3 py-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-uber">
                Hackathon / Event
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={searchEvent}
                  onChange={(e) => setSearchEvent(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All Competitions</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200/80" />

            {/* 3. Pricing / Skill */}
            <div className="flex-1 w-full px-3 py-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-uber">
                Primary Skill
              </label>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">Any Skill</option>
                  <option value="Python">Python</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="React">React</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Firebase">Firebase</option>
                  <option value="Solidity">Solidity</option>
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200/80" />

            {/* 4. Number of Rooms / Team Size */}
            <div className="flex-1 w-full px-3 py-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-uber">
                Team Size
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={searchSize}
                  onChange={(e) => setSearchSize(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">Any Size</option>
                  <option value="2">Duo (2 Members)</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                  <option value="5">5 Members</option>
                </select>
              </div>
            </div>

            {/* 5. Coral Search Button (Exact Dribbble Style) */}
            <button
              type="submit"
              className="w-full md:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm btn-primary-coral shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Hero Collaboration Showcase Image with Corner Blur & Website Color Theme */}
        <div className="mt-8 relative max-w-5xl mx-auto group">
          {/* Ambient Glows matching website color theme (Coral #ff4d15 & Gold Amber) */}
          <div className="absolute -inset-3 bg-gradient-to-r from-[#ff4d15]/25 via-amber-400/20 to-[#ff4d15]/25 rounded-[2.5rem] blur-2xl -z-10 opacity-70 group-hover:opacity-95 transition duration-700" />

          {/* Main Showcase Container */}
          <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-3xl sm:rounded-[2rem] overflow-hidden border border-white/90 shadow-2xl shadow-slate-900/15 bg-black">
            {/* The Hero Image */}
            <img
              src="/hero-team.jpg"
              alt="College Team Collaboration"
              className="w-full h-full object-cover object-center filter contrast-[1.06] saturate-[1.12] brightness-[1.03] transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* Aesthetic Color Tint & Ambient Light Overlays matching website theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />

            {/* Warm Coral / Amber Sheen Blending into Website Theme */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff4d15]/15 via-transparent to-amber-500/15 mix-blend-screen pointer-events-none" />

            {/* Aesthetic Corner Blur Effect (Progressive Lens Blur in All 4 Corners) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl sm:rounded-[2rem] backdrop-blur-[14px]"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 35%, black 100%)',
                maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 35%, black 100%)',
              }}
            />

            {/* Corner Frosted Glass Vignettes for Extra Aesthetic Depth */}
            <div className="absolute top-0 left-0 w-36 h-36 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-br-[3.5rem] pointer-events-none backdrop-blur-sm" />
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/20 via-white/5 to-transparent rounded-bl-[3.5rem] pointer-events-none backdrop-blur-sm" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-white/20 via-white/5 to-transparent rounded-tr-[3.5rem] pointer-events-none backdrop-blur-sm" />
            <div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-tl from-white/20 via-white/5 to-transparent rounded-tl-[3.5rem] pointer-events-none backdrop-blur-sm" />

            {/* Floating Liquid-Glass Interactive Badges */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 liquid-glass-pill px-3.5 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-xl border border-white/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 font-uber">
                Live Squad Formation
              </span>
              <span className="text-[10px] text-[#ff4d15] font-extrabold bg-[#ff4d15]/10 px-2 py-0.5 rounded-full">
                98% Match
              </span>
            </div>

            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 liquid-glass-pill px-3.5 py-2 rounded-full hidden sm:flex items-center gap-2 shadow-lg backdrop-blur-xl border border-white/80">
              <Users className="w-3.5 h-3.5 text-[#ff4d15]" />
              <span className="text-xs font-bold text-slate-900 font-uber">
                4 Teammates Synced
              </span>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 liquid-glass p-3 sm:p-3.5 rounded-2xl hidden md:flex items-center gap-3 shadow-xl backdrop-blur-xl border border-white/80 max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-[#ff4d15] text-white flex items-center justify-center font-bold shadow-md shadow-[#ff4d15]/30 shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block font-uber">
                  Radical Curiosity &amp; Synergy
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  AI Innovators • Hackathon Ready
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 liquid-glass-pill px-4 py-2 rounded-full flex items-center gap-2 shadow-xl backdrop-blur-xl border border-white/80">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900 font-uber">
                College-Exclusive Squad
              </span>
            </div>
          </div>
        </div>

        {/* Bottom 4-Column Stats Bar — Exact Replica of Homrent Dribbble Stats */}
        <div className="mt-6 max-w-5xl mx-auto liquid-glass rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
            {/* Stat 1 */}
            <div className="p-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-uber block">
                10,000+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1 block">
                Students Listed
              </span>
            </div>

            {/* Stat 2 */}
            <div className="p-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-uber block">
                5,000+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1 block">
                Happy Teammates
              </span>
            </div>

            {/* Stat 3 */}
            <div className="p-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-uber block">
                2,000+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1 block">
                Squads Formed
              </span>
            </div>

            {/* Stat 4 */}
            <div className="p-4 text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-uber block">
                120+
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1 block">
                Hackathons Covered
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Way Smart Skill Matching Live Engine Preview */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl liquid-glass border border-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d15] flex items-center gap-1.5 font-uber">
                <Sparkles className="w-4 h-4 text-[#ff4d15]" />
                Two-Way Matching Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal text-slate-900 mt-1 font-moara">
                How Our Algorithm Pairs You
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start md:self-auto font-uber">
              Live Mathematical Scoring
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Student Candidate Node */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-uber">
                  Student Profile
                </span>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      className="w-full h-full object-cover"
                      alt="Rahul"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-uber">Rahul Sharma</h4>
                    <span className="text-xs text-indigo-600 font-medium">AI/ML Developer</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold font-uber">
                    Python (Adv)
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold font-uber">
                    Machine Learning
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold font-uber">
                    React
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-uber">
                Verified NIT Student • Year 3
              </div>
            </div>

            {/* Smart Matching Engine Central Hub */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-[#ff4d15]/20 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#ff4d15]/10 border border-[#ff4d15]/30 flex items-center justify-center text-[#ff4d15] mb-2 shadow-inner">
                <Cpu className="w-7 h-7" />
              </div>
              <div className="text-4xl font-extrabold text-slate-900 font-uber">95% Match</div>
              <p className="text-xs text-slate-600 mt-1 max-w-[200px] font-uber leading-relaxed">
                Skill 48/50 • Role 18/20 • Full Weekend Alignment
              </p>
              <div className="mt-4 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300 font-uber">
                Optimal Squad Fit
              </div>
            </div>

            {/* Team Requirements Node */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-uber">
                  Team Requirements
                </span>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff4d15]/10 border border-[#ff4d15]/30 flex items-center justify-center font-bold text-[#ff4d15] text-lg font-uber">
                    AI
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-uber">AI Innovators</h4>
                    <span className="text-xs text-indigo-600 font-medium">AI Hackathon 2026</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 font-uber">
                    Python (Req)
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 font-uber">
                    ML (Req)
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 font-uber">
                    UI/UX (Gap)
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-uber">
                3 / 5 Members • Actively Recruiting
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs Solution (Frosted Liquid Cards) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl liquid-glass border border-white shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-normal text-slate-900 font-moara mb-2">The Solo Student's Dilemma</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-uber">
              Students want to build ambitious projects or compete in hackathons, but struggle to find peers with complementary skills on unstructured WhatsApp and Discord groups.
            </p>
            <div className="space-y-2.5 text-xs text-slate-600 font-uber">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span> Mismatched skills lead to project burnout and dropped submissions
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span> Missing critical skills (like ML or UX) discovered mid-hackathon
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span> Popularity bias hides high-capability junior developers
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl liquid-glass border border-white shadow-md bg-gradient-to-br from-white via-orange-50/40 to-white">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ff4d15] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-normal text-slate-900 font-moara mb-2">The TeamUp Two-Way Solution</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-uber">
              A college-exclusive matching platform that pairs students to teams using transparent mathematical weighting, skill gap coverage meters, and verified student IDs.
            </p>
            <div className="space-y-2.5 text-xs text-slate-700 font-uber">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> 50% Skill + 20% Role + 15% Interest + 10% Exp + 5% Availability
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Automated Team Skill Gap Coverage Bar (0-100%)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Transparent "Why this match?" score breakdowns for every recommendation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Hackathons */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff4d15] font-uber">
              Competitions
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-slate-900 font-moara mt-1">
              Upcoming College Hackathons
            </h2>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="text-xs font-bold text-[#ff4d15] hover:underline flex items-center gap-1 font-uber"
          >
            View All ({events.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div className="h-44 relative">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 backdrop-blur shadow-sm uppercase tracking-wider font-uber">
                  {event.mode}
                </span>
                <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur">
                  {event.prizePool}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-uber">{event.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-uber">{event.tagline}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {event.requiredSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium font-uber"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-uber">
                    Deadline: <strong className="text-slate-800">{event.registrationDeadline}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedEventFilter(event.id);
                      onNavigate('find-teams');
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold btn-primary-coral"
                  >
                    Find Squad &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
