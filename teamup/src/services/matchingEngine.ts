import { Student, Team, MatchBreakdown, ProficiencyLevel, StudentSkill, TeamSkillRequirement } from '../types';

const PROFICIENCY_VALUES: Record<ProficiencyLevel, number> = {
  beginner: 0.55,
  intermediate: 0.8,
  advanced: 0.95,
  expert: 1.0,
};

/**
 * Calculates two-way smart match breakdown between a student and a team.
 * Follows the 50% Skill + 20% Role + 15% Interest + 10% Experience + 5% Availability rule.
 */
export function calculateMatchScore(student: Student, team: Team): MatchBreakdown {
  // 1. Skill Score (Max 50 points)
  let skillScore = 0;
  const matchedSkills: MatchBreakdown['matchedSkills'] = [];
  const missingSkills: MatchBreakdown['missingSkills'] = [];

  const teamSkills = team.requiredSkills || [];

  if (teamSkills.length === 0) {
    skillScore = 40; // Default baseline if team hasn't specified exact skills yet
  } else {
    let totalPossibleWeight = 0;
    let earnedWeight = 0;

    teamSkills.forEach((req) => {
      const weight = req.requirementType === 'required' ? 3.0 : req.requirementType === 'preferred' ? 1.5 : 0.8;
      totalPossibleWeight += weight;

      // Find if student has this skill
      const found = student.skills.find(
        (s) => s.skillName.toLowerCase() === req.skillName.toLowerCase()
      );

      if (found) {
        const studentProfVal = PROFICIENCY_VALUES[found.proficiency] || 0.6;
        const reqProfVal = PROFICIENCY_VALUES[req.minimumProficiency] || 0.6;

        // Proficiency ratio
        let profMultiplier = studentProfVal / reqProfVal;
        if (profMultiplier > 1.2) profMultiplier = 1.2; // Cap bonus
        if (profMultiplier < 0.5) profMultiplier = 0.5;

        earnedWeight += weight * Math.min(1.0, profMultiplier);

        matchedSkills.push({
          name: req.skillName,
          level: found.proficiency,
          requirementType: req.requirementType,
        });
      } else {
        missingSkills.push({
          name: req.skillName,
          requirementType: req.requirementType,
        });
      }
    });

    const skillRatio = totalPossibleWeight > 0 ? earnedWeight / totalPossibleWeight : 0;
    skillScore = Math.round(skillRatio * 50);
  }

  // 2. Role Score (Max 20 points)
  let roleScore = 0;
  const matchedRoles: string[] = [];

  const requiredRoles = team.requiredRoles || [];
  const preferredRoles = team.preferredRoles || [];
  const studentRoles = student.preferredRoles || [];

  if (requiredRoles.length === 0 && preferredRoles.length === 0) {
    roleScore = 15;
  } else {
    // Check required roles (up to 15 pts)
    const matchedReq = studentRoles.filter((r) =>
      requiredRoles.some((tr) => tr.toLowerCase() === r.toLowerCase())
    );
    if (matchedReq.length > 0) {
      roleScore += 15;
      matchedRoles.push(...matchedReq);
    } else {
      // Check preferred roles (up to 10 pts)
      const matchedPref = studentRoles.filter((r) =>
        preferredRoles.some((tr) => tr.toLowerCase() === r.toLowerCase())
      );
      if (matchedPref.length > 0) {
        roleScore += 10;
        matchedRoles.push(...matchedPref);
      }
    }
  }

  // 3. Project Interest Match (Max 15 points)
  let interestScore = 0;
  const matchedInterests: string[] = [];
  const teamText = `${team.name} ${team.description} ${team.projectTitle || ''} ${team.eventName || ''}`.toLowerCase();

  const studentInterests = student.interests || [];
  studentInterests.forEach((interest) => {
    if (teamText.includes(interest.toLowerCase())) {
      interestScore += 5;
      matchedInterests.push(interest);
    }
  });
  if (interestScore > 15) interestScore = 15;
  if (studentInterests.length > 0 && interestScore === 0) {
    interestScore = 6; // base interest compatibility
  }

  // 4. Experience Match (Max 10 points)
  let experienceScore = 7;
  if (student.experienceLevel === 'advanced') {
    experienceScore = 10;
  } else if (student.experienceLevel === 'intermediate') {
    experienceScore = 8;
  } else {
    experienceScore = 6;
  }

  // 5. Availability Match (Max 5 points)
  let availabilityScore = 3;
  if (team.availabilityRequirements) {
    let matches = true;
    if (team.availabilityRequirements.weekendsRequired && !student.availability.weekends) {
      matches = false;
    }
    if (team.availabilityRequirements.mode !== 'hybrid' && student.availability.mode !== 'hybrid') {
      if (team.availabilityRequirements.mode !== student.availability.mode) {
        matches = false;
      }
    }
    availabilityScore = matches ? 5 : 2;
  } else {
    availabilityScore = 5;
  }

  const finalScore = Math.min(100, Math.max(15, skillScore + roleScore + interestScore + experienceScore + availabilityScore));

  return {
    finalScore,
    skillScore,
    roleScore,
    interestScore,
    experienceScore,
    availabilityScore,
    matchedSkills,
    missingSkills,
    matchedRoles,
    matchedInterests,
  };
}

/**
 * Calculates Team Skill Coverage for all required and preferred skills.
 */
export interface TeamSkillCoverage {
  skillName: string;
  category: string;
  requirementType: 'required' | 'preferred' | 'optional';
  coveragePercentage: number;
  coveredBy: string[]; // member names
  status: 'covered' | 'partial' | 'missing';
}

export function analyzeTeamSkillCoverage(team: Team): {
  coverageList: TeamSkillCoverage[];
  overallCoverageScore: number;
  missingSkills: string[];
} {
  const requirements = team.requiredSkills || [];
  if (requirements.length === 0) {
    return { coverageList: [], overallCoverageScore: 100, missingSkills: [] };
  }

  const coverageList: TeamSkillCoverage[] = [];
  const missingSkills: string[] = [];
  let totalScore = 0;

  requirements.forEach((req) => {
    const coveredBy: string[] = [];
    let highestProficiency: ProficiencyLevel | null = null;

    team.members.forEach((member) => {
      const match = member.skills?.find(
        (s) => s.skillName.toLowerCase() === req.skillName.toLowerCase()
      );
      if (match) {
        coveredBy.push(member.fullName);
        if (!highestProficiency || PROFICIENCY_VALUES[match.proficiency] > PROFICIENCY_VALUES[highestProficiency]) {
          highestProficiency = match.proficiency;
        }
      }
    });

    let coveragePercentage = 0;
    let status: TeamSkillCoverage['status'] = 'missing';

    if (coveredBy.length > 0 && highestProficiency) {
      const profScore = PROFICIENCY_VALUES[highestProficiency];
      if (profScore >= 0.8) {
        coveragePercentage = 100;
        status = 'covered';
      } else {
        coveragePercentage = 65;
        status = 'partial';
      }
    } else {
      coveragePercentage = 0;
      status = 'missing';
      missingSkills.push(req.skillName);
    }

    totalScore += coveragePercentage;

    coverageList.push({
      skillName: req.skillName,
      category: req.category,
      requirementType: req.requirementType,
      coveragePercentage,
      coveredBy,
      status,
    });
  });

  const overallCoverageScore = Math.round(totalScore / requirements.length);

  return {
    coverageList,
    overallCoverageScore,
    missingSkills,
  };
}

/**
 * Ranks recommended teams for a student
 */
export function getRecommendedTeamsForStudent(
  student: Student,
  teams: Team[],
  eventIdFilter?: string
): { team: Team; breakdown: MatchBreakdown }[] {
  let eligibleTeams = teams.filter((t) => t.status === 'recruiting' && t.members.length < t.maxMembers);

  if (eventIdFilter) {
    eligibleTeams = eligibleTeams.filter((t) => t.eventId === eventIdFilter);
  }

  const results = eligibleTeams.map((team) => ({
    team,
    breakdown: calculateMatchScore(student, team),
  }));

  // Sort descending by finalScore
  results.sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);
  return results;
}

/**
 * Ranks recommended student candidates for a team
 */
export function getRecommendedCandidatesForTeam(
  team: Team,
  students: Student[]
): { student: Student; breakdown: MatchBreakdown }[] {
  // Exclude current team members
  const memberIds = new Set(team.members.map((m) => m.studentId));
  const eligibleStudents = students.filter(
    (s) => !memberIds.has(s.id) && s.isLookingForTeam && s.isVerified
  );

  const results = eligibleStudents.map((student) => ({
    student,
    breakdown: calculateMatchScore(student, team),
  }));

  // Sort descending by finalScore
  results.sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);
  return results;
}
