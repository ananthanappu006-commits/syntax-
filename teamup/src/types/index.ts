export type SkillCategory = 'technical' | 'design' | 'business' | 'soft';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type UserRole = 'student' | 'team_leader' | 'organizer' | 'admin';

export type TeamStatus = 'recruiting' | 'full' | 'closed' | 'completed';

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  aliases?: string[];
}

export interface StudentSkill {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsExperience?: number;
}

export interface Availability {
  weekdays: boolean;
  weekends: boolean;
  timeOfDay: ('morning' | 'afternoon' | 'evening')[];
  mode: 'online' | 'offline' | 'hybrid';
  hoursPerWeek?: number;
}

export interface Student {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  collegeId: string;
  collegeName: string;
  department: string;
  course: string;
  year: number; // e.g. 1, 2, 3, 4
  semester: number;
  bio: string;
  profileImage: string;
  skills: StudentSkill[];
  interests: string[];
  preferredRoles: string[];
  availability: Availability;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  isLookingForTeam: boolean;
  isVerified: boolean;
  teamsJoinedIds: string[];
  bookmarkedTeamIds: string[];
  bookmarkedStudentIds: string[];
}

export interface TeamSkillRequirement {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  requirementType: 'required' | 'preferred' | 'optional';
  minimumProficiency: ProficiencyLevel;
}

export interface TeamMember {
  studentId: string;
  fullName: string;
  role: string;
  profileImage: string;
  isLeader: boolean;
  joinedAt: string;
  skills: StudentSkill[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  ownerId: string;
  ownerName: string;
  eventId?: string;
  eventName?: string;
  projectId?: string;
  projectTitle?: string;
  maxMembers: number;
  members: TeamMember[];
  status: TeamStatus;
  visibility: 'public' | 'college' | 'event_only';
  requiredSkills: TeamSkillRequirement[];
  requiredRoles: string[];
  preferredRoles: string[];
  availabilityRequirements: {
    weekendsRequired: boolean;
    mode: 'online' | 'offline' | 'hybrid';
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  organizer: string;
  venue: string;
  mode: 'online' | 'offline' | 'hybrid';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  minTeamSize: number;
  maxTeamSize: number;
  prizePool: string;
  bannerUrl: string;
  requiredSkills: string[];
  registeredTeamsCount: number;
  rules: string[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  proposedSolution: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  teamId?: string;
  eventId?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredRoles: string[];
  openPositions: number;
  status: 'ideation' | 'team_forming' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface MatchBreakdown {
  finalScore: number; // 0 - 100
  skillScore: number; // out of 50
  roleScore: number; // out of 20
  interestScore: number; // out of 15
  experienceScore: number; // out of 10
  availabilityScore: number; // out of 5
  matchedSkills: {
    name: string;
    level: ProficiencyLevel;
    requirementType: 'required' | 'preferred' | 'optional';
  }[];
  missingSkills: {
    name: string;
    requirementType: 'required' | 'preferred' | 'optional';
  }[];
  matchedRoles: string[];
  matchedInterests: string[];
}

export interface JoinRequest {
  id: string;
  teamId: string;
  teamName: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentRole: string;
  message: string;
  matchScore: number;
  breakdown: MatchBreakdown;
  status: RequestStatus;
  createdAt: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  studentId: string;
  invitedBy: string;
  invitedByName: string;
  message: string;
  matchScore: number;
  breakdown: MatchBreakdown;
  status: RequestStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'team';
  participantIds: string[];
  participantNames: Record<string, string>;
  participantAvatars: Record<string, string>;
  teamId?: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'invitation' | 'join_request' | 'request_accepted' | 'request_rejected' | 'message' | 'recommendation' | 'announcement';
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'student' | 'team' | 'project';
  targetId: string;
  targetName: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  studentsWithoutTeams: number;
  totalTeams: number;
  openTeams: number;
  completedTeams: number;
  totalEvents: number;
  totalProjects: number;
  pendingReports: number;
  successfulMatches: number;
}
