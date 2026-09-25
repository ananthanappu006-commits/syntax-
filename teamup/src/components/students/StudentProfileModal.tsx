import React from 'react';
import { X, ShieldCheck, Globe, Briefcase, Award, Clock, MessageSquare, UserPlus, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';
import { Student } from '../../types';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onOpenChat?: (student: Student) => void;
  onInvite?: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onOpenChat,
  onInvite,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in font-uber">
      <div className="w-full max-w-2xl liquid-glass border border-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0">
              <img
                src={student.profileImage}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-moara font-bold text-slate-900">{student.fullName}</h3>
                {student.isVerified && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Student
                  </span>
                )}
              </div>
              <p className="text-xs text-[#ff4d15] font-semibold mt-0.5">
                {student.preferredRoles[0]} • {student.department}
              </p>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {student.collegeName} • Year {student.year}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bio */}
        <div className="my-5 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 font-moara">
              About &amp; Pitch
            </h4>
            <p className="text-slate-600 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-slate-200">
              {student.bio}
            </p>
          </div>

          {/* Skills Breakdown */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 font-moara">
              <Award className="w-4 h-4 text-[#ff4d15]" />
              Verified Skills &amp; Proficiencies
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {student.skills.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl liquid-glass border border-slate-200 flex items-center justify-between shadow-xs"
                >
                  <span className="font-bold text-slate-900">{s.skillName}</span>
                  <span className="text-[10px] text-[#ff4d15] font-semibold capitalize bg-[#ff4d15]/10 px-2 py-0.5 rounded-full border border-[#ff4d15]/20">
                    {s.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Roles & Interests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl liquid-glass border border-slate-200">
              <span className="font-bold text-slate-800 text-[11px] block mb-2 flex items-center gap-1.5 font-moara">
                <Briefcase className="w-3.5 h-3.5 text-[#ff4d15]" /> Preferred Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.preferredRoles.map((r, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 shadow-xs">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl liquid-glass border border-slate-200">
              <span className="font-bold text-slate-800 text-[11px] block mb-2 flex items-center gap-1.5 font-moara">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Availability &amp; Mode
              </span>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">Mode: <strong className="text-slate-900 capitalize font-semibold">{student.availability.mode}</strong></div>
                <div className="flex justify-between">Weekends: <strong className={student.availability.weekends ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>{student.availability.weekends ? 'Available' : 'Weekdays Only'}</strong></div>
                <div className="flex justify-between">Hours: <strong className="text-[#ff4d15] font-semibold">{student.availability.hoursPerWeek} hrs/week</strong></div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            {student.githubUrl && (
              <a
                href={student.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition shadow-xs"
              >
                <GithubIcon className="w-3.5 h-3.5 text-slate-900" /> GitHub
              </a>
            )}
            {student.linkedinUrl && (
              <a
                href={student.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition shadow-xs"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
              </a>
            )}
            {student.portfolioUrl && (
              <a
                href={student.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#ff4d15]" /> Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>
          {onOpenChat && (
            <button
              onClick={() => {
                onOpenChat(student);
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-semibold btn-dark-pill shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Direct Message
            </button>
          )}
          {onInvite && (
            <button
              onClick={() => {
                onInvite(student);
                onClose();
              }}
              className="px-5 py-2.5 text-xs font-semibold btn-primary-coral rounded-2xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Invite to Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
