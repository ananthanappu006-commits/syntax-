import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PortalSwitcherBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const PortalSwitcherBar: React.FC<PortalSwitcherBarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { currentPersonaKey, switchPersona, isAdmin, currentRole } = useApp();
  const [isMinimized, setIsMinimized] = useState(false);

  const portals = [
    {
      id: 'student' as const,
      personaKey: 'rahul' as const,
      label: 'Student Portal',
      shortLabel: 'Student',
      roleDescription: 'Rahul (Solo Seeker)',
      icon: GraduationCap,
      isActive:
        currentTab !== 'admin' &&
        (currentPersonaKey === 'rahul' ||
          (currentRole === 'student' && currentPersonaKey !== 'priya')),
      onSelect: () => {
        switchPersona('rahul');
        if (currentTab === 'admin') {
          setCurrentTab('dashboard');
        }
      },
    },
    {
      id: 'team_leader' as const,
      personaKey: 'priya' as const,
      label: 'Team Lead Portal',
      shortLabel: 'Team Lead',
      roleDescription: 'Priya (AI Innovators)',
      icon: Users,
      isActive:
        currentTab !== 'admin' &&
        (currentPersonaKey === 'priya' || currentRole === 'team_leader'),
      onSelect: () => {
        switchPersona('priya');
        if (currentTab === 'admin') {
          setCurrentTab('dashboard');
        }
      },
    },
    {
      id: 'admin' as const,
      personaKey: 'admin' as const,
      label: 'Admin Portal',
      shortLabel: 'Admin',
      roleDescription: 'College Verification',
      icon: Shield,
      isActive: currentTab === 'admin' || isAdmin,
      onSelect: () => {
        switchPersona('admin');
        setCurrentTab('admin');
      },
    },
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 font-uber">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full liquid-glass-pill shadow-xl hover:scale-105 transition text-xs font-bold text-slate-800 border border-white"
          title="Expand Portal Switcher Bar"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ff4d15]" />
          <span>Switch Portal</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] font-uber transition-all">
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full liquid-glass-pill shadow-2xl border border-white/90">
        {/* Subtle Brand Tag */}
        <div className="hidden md:flex items-center gap-1.5 pl-2.5 pr-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200/80 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#ff4d15]" />
          <span>Portals</span>
        </div>

        {/* Portal Switching Buttons */}
        <div className="flex items-center gap-1">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <button
                key={portal.id}
                onClick={portal.onSelect}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs transition-all ${
                  portal.isActive
                    ? 'bg-slate-900 text-white shadow-md font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 font-semibold'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    portal.isActive ? 'text-[#ff4d15]' : 'text-slate-400'
                  }`}
                />
                <span className="hidden sm:inline">{portal.label}</span>
                <span className="sm:hidden">{portal.shortLabel}</span>

                {portal.isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d15] animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/60 transition ml-0.5"
          title="Minimize portal switcher bar"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
