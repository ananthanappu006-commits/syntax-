import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Search, ShieldCheck } from 'lucide-react';
import { TeamSkillCoverage } from '../../services/matchingEngine';

interface SkillCoverageProps {
  coverageList: TeamSkillCoverage[];
  overallCoverageScore: number;
  missingSkills: string[];
  onFindMatchingMembers?: (skillName?: string) => void;
}

export const SkillCoverageBar: React.FC<SkillCoverageProps> = ({
  coverageList,
  overallCoverageScore,
  missingSkills,
  onFindMatchingMembers,
}) => {
  return (
    <div className="rounded-3xl liquid-glass border border-white p-6 sm:p-7 shadow-sm font-uber">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ff4d15]" />
            <h3 className="text-lg font-bold text-slate-900">Team Skill Coverage &amp; Gap Analysis</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated squad capability assessment across all current team members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Overall Readiness</span>
            <span className="text-2xl font-extrabold text-[#ff4d15]">{overallCoverageScore}%</span>
          </div>
          <div className="w-13 h-13 rounded-full border-4 border-[#ff4d15]/30 bg-white flex items-center justify-center font-bold text-sm text-slate-800 shadow-sm">
            {overallCoverageScore}%
          </div>
        </div>
      </div>

      {/* Skill Coverage Bars */}
      <div className="space-y-4 my-5">
        {coverageList.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {item.status === 'covered' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : item.status === 'partial' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )}
                <span className="font-bold text-slate-800">{item.skillName}</span>
                <span className="text-[10px] text-slate-500 uppercase px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 font-semibold">
                  {item.requirementType}
                </span>
                {item.coveredBy.length > 0 && (
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    (Covered by {item.coveredBy.join(', ')})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold ${
                    item.coveragePercentage >= 80
                      ? 'text-emerald-700'
                      : item.coveragePercentage > 0
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}
                >
                  {item.coveragePercentage}%
                </span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  item.coveragePercentage >= 80
                    ? 'bg-emerald-500 shadow-sm'
                    : item.coveragePercentage > 0
                    ? 'bg-amber-500 shadow-sm'
                    : 'bg-rose-500 shadow-sm'
                }`}
                style={{ width: `${item.coveragePercentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Missing Skills Warning Banner */}
      {missingSkills.length > 0 ? (
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50/60 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-rose-800">
                Your squad is currently missing key skills:
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {missingSkills.map((name, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200 font-bold shadow-2xl"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {onFindMatchingMembers && (
            <button
              onClick={() => onFindMatchingMembers(missingSkills[0])}
              className="px-4 py-2 text-xs font-bold btn-primary-coral rounded-full shrink-0 flex items-center justify-center gap-1.5 shadow-md"
            >
              <Search className="w-3.5 h-3.5" />
              Find Candidates
            </button>
          )}
        </div>
      ) : (
        <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All required team skills are satisfied by current members! Ready for the competition.</span>
        </div>
      )}
    </div>
  );
};
