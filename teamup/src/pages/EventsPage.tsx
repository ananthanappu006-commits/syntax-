import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventItem } from '../types';

interface EventsPageProps {
  onNavigate: (tab: string) => void;
  onOpenCreateTeamWithEvent?: (eventId: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onNavigate,
  onOpenCreateTeamWithEvent,
}) => {
  const { events, teams, setSelectedEventFilter } = useApp();
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);

  const handleFindTeamForEvent = (eventId: string) => {
    setSelectedEventFilter(eventId);
    onNavigate('find-teams');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-uber">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#ff4d15]" />
            <h1 className="text-3xl sm:text-4xl font-normal text-slate-900 font-moara">
              Campus Events &amp; Hackathons
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover upcoming hackathons, innovation challenges, and register with a complete skill-matched squad.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const registeredTeams = teams.filter((t) => t.eventId === event.id);

          return (
            <div
              key={event.id}
              className="liquid-glass-card rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              {/* Event Image Banner */}
              <div className="h-48 relative overflow-hidden">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-sm uppercase tracking-wider backdrop-blur font-uber">
                  {event.mode}
                </span>
                <span className="absolute bottom-3 left-4 text-xs font-bold text-white bg-slate-900/80 px-3 py-1 rounded-xl backdrop-blur flex items-center gap-1.5 shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  {event.prizePool}
                </span>
              </div>

              {/* Event Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-uber">{event.title}</h3>
                  <p className="text-xs text-[#ff4d15] font-semibold mt-0.5">{event.organizer}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="space-y-1.5 mt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Dates: <strong className="text-slate-800">{event.startDate}</strong> to <strong className="text-slate-800">{event.endDate}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Venue: <strong className="text-slate-800">{event.venue}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Squad Size: <strong className="text-slate-800">{event.minTeamSize}-{event.maxTeamSize} members</strong> ({registeredTeams.length} squads formed)
                      </span>
                    </div>
                  </div>

                  {/* Skills Needed */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {event.requiredSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Event-Specific Matching Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFindTeamForEvent(event.id)}
                      className="flex-1 py-2 px-3 rounded-full text-xs font-bold btn-primary-coral text-center flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Find a Squad</span>
                    </button>

                    <button
                      onClick={() => onOpenCreateTeamWithEvent?.(event.id)}
                      className="flex-1 py-2 px-3 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition text-center shadow-sm"
                    >
                      Create Squad
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedEventModal(event)}
                    className="w-full py-1.5 text-xs text-slate-500 hover:text-[#ff4d15] font-semibold transition text-center"
                  >
                    View Competition Rules &amp; Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl liquid-glass border border-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs uppercase font-bold text-[#ff4d15] tracking-wider">
                  Competition Briefing
                </span>
                <h2 className="text-3xl font-normal text-slate-900 mt-1 font-moara">
                  {selectedEventModal.title}
                </h2>
                <span className="text-xs text-slate-500">
                  Organized by {selectedEventModal.organizer}
                </span>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>{selectedEventModal.description}</p>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-sm">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Prize Pool</span>
                  <span className="text-emerald-700 font-extrabold text-sm">{selectedEventModal.prizePool}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Squad Size</span>
                  <span className="text-slate-900 font-extrabold text-sm">
                    {selectedEventModal.minTeamSize}-{selectedEventModal.maxTeamSize} Members
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Deadline</span>
                  <span className="text-[#ff4d15] font-extrabold text-sm">{selectedEventModal.registrationDeadline}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mode</span>
                  <span className="text-indigo-700 font-extrabold text-sm capitalize">{selectedEventModal.mode}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 font-uber">Competition Rules</h4>
                <ul className="space-y-1.5 text-slate-600">
                  {selectedEventModal.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleFindTeamForEvent(selectedEventModal.id);
                  setSelectedEventModal(null);
                }}
                className="px-6 py-2.5 text-xs font-bold btn-primary-coral rounded-full shadow-md"
              >
                Find a Squad for this Hackathon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
