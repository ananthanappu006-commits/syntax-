import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Student,
  Team,
  EventItem,
  ProjectIdea,
  Skill,
  Conversation,
  ChatMessage,
  NotificationItem,
  JoinRequest,
  TeamInvitation,
  ReportItem,
  UserRole,
  StudentSkill,
  TeamSkillRequirement,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEAMS,
  INITIAL_EVENTS,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
} from '../data/mockData';
import { calculateMatchScore } from '../services/matchingEngine';
import {
  auth,
  db,
  signInWithGoogle,
  signUpWithEmail,
  loginWithEmail,
  logoutUser,
} from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: Student;
  currentRole: UserRole;
  isAdmin: boolean;
  students: Student[];
  teams: Team[];
  events: EventItem[];
  projects: ProjectIdea[];
  skills: Skill[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  notifications: NotificationItem[];
  joinRequests: JoinRequest[];
  teamInvitations: TeamInvitation[];
  reports: ReportItem[];
  toasts: ToastNotification[];
  selectedEventFilter: string | null;

  // Firebase Auth State & Methods
  firebaseUser: FirebaseUser | null;
  isFirebaseAuthLoading: boolean;
  firebaseLogin: (email: string, pass: string) => Promise<void>;
  firebaseSignUp: (
    email: string,
    pass: string,
    fullName: string,
    collegeId: string,
    preferredRole: string,
    collegeName?: string
  ) => Promise<void>;
  firebaseGoogleSignIn: () => Promise<void>;
  firebaseLogout: () => Promise<void>;
  
  // Admin Tab Navigation
  adminTab: 'overview' | 'students' | 'teams' | 'skills' | 'reports';
  setAdminTab: (tab: 'overview' | 'students' | 'teams' | 'skills' | 'reports') => void;

  // Persona & Role Switching
  currentPersonaKey: 'rahul' | 'anjali' | 'priya' | 'arjun' | 'admin';
  switchPersona: (personaKey: 'rahul' | 'anjali' | 'priya' | 'arjun' | 'admin') => void;
  setSelectedEventFilter: (eventId: string | null) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Student Actions
  updateStudentProfile: (studentId: string, updates: Partial<Student>) => void;
  addStudentSkill: (studentId: string, skill: StudentSkill) => void;
  removeStudentSkill: (studentId: string, skillId: string) => void;
  toggleLookingForTeam: (studentId: string) => void;
  toggleBookmark: (type: 'team' | 'student', id: string) => void;

  // Team Actions
  createTeam: (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'members'>) => Team;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  removeMemberFromTeam: (teamId: string, studentId: string) => void;
  addStudentDirectlyToTeam: (teamId: string, studentId: string, role?: string) => void;

  // Match & Collaboration Flows
  sendJoinRequest: (teamId: string, message?: string) => void;
  acceptJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  sendTeamInvitation: (teamId: string, studentId: string, message?: string) => void;
  acceptTeamInvitation: (invitationId: string) => void;
  declineTeamInvitation: (invitationId: string) => void;

  // Projects & Events
  createProject: (projectData: Partial<ProjectIdea>) => void;
  
  // Chat & Messaging
  sendMessage: (conversationId: string, text: string) => void;
  createOrOpenDirectChat: (targetStudent: Student) => string;

  // Admin Actions
  toggleVerifyStudent: (studentId: string) => void;
  resolveReport: (reportId: string, status: 'resolved' | 'dismissed') => void;
  addGlobalSkill: (skill: Omit<Skill, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('teamup_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('teamup_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('teamup_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [projects, setProjects] = useState<ProjectIdea[]>(() => {
    const saved = localStorage.getItem('teamup_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('teamup_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('teamup_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('teamup_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('teamup_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(() => {
    const saved = localStorage.getItem('teamup_join_requests');
    if (saved) return JSON.parse(saved);
    // Initial sample request for Priya to see from Rahul
    const priyaTeam = INITIAL_TEAMS[0];
    const rahul = INITIAL_STUDENTS[0];
    const breakdown = calculateMatchScore(rahul, priyaTeam);
    return [
      {
        id: 'req-sample-1',
        teamId: priyaTeam.id,
        teamName: priyaTeam.name,
        studentId: rahul.id,
        studentName: rahul.fullName,
        studentAvatar: rahul.profileImage,
        studentRole: rahul.preferredRoles[0],
        message: 'Hi Priya! I have 3 years of Python & ML experience and would love to build the AI Campus Assistant model with AI Innovators.',
        matchScore: breakdown.finalScore,
        breakdown,
        status: 'pending',
        createdAt: '1 hour ago',
      },
    ];
  });

  const [teamInvitations, setTeamInvitations] = useState<TeamInvitation[]>(() => {
    const saved = localStorage.getItem('teamup_invitations');
    if (saved) return JSON.parse(saved);
    const priyaTeam = INITIAL_TEAMS[0];
    const anjali = INITIAL_STUDENTS[1];
    const breakdown = calculateMatchScore(anjali, priyaTeam);
    return [
      {
        id: 'inv-sample-1',
        teamId: priyaTeam.id,
        teamName: priyaTeam.name,
        studentId: anjali.id,
        invitedBy: priyaTeam.ownerId,
        invitedByName: priyaTeam.ownerName,
        message: 'Hey Anjali, we saw your amazing Figma and UI work! We need a product designer for AI Hackathon 2026.',
        matchScore: breakdown.finalScore,
        breakdown,
        status: 'pending',
        createdAt: '30 mins ago',
      },
    ];
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('teamup_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [currentPersonaKey, setCurrentPersonaKey] = useState<'rahul' | 'anjali' | 'priya' | 'arjun' | 'admin'>('rahul');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState<'overview' | 'students' | 'teams' | 'skills' | 'reports'>('overview');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState<string | null>(null);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseAuthLoading, setIsFirebaseAuthLoading] = useState(true);
  const [authenticatedStudent, setAuthenticatedStudent] = useState<Student | null>(null);

  // Sync Firebase Auth state & Firestore user document
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Student;
            setAuthenticatedStudent(data);
            setStudents((prev) => {
              const idx = prev.findIndex((s) => s.id === data.id);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = data;
                return updated;
              }
              return [data, ...prev];
            });
          } else {
            // Initialize new profile document in Firestore
            const newStudent: Student = {
              id: user.uid,
              userId: user.uid,
              fullName: user.displayName || user.email?.split('@')[0] || 'College Innovator',
              email: user.email || '',
              profileImage: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              collegeName: 'MIT Campus',
              collegeId: `COL-${user.uid.slice(0, 6).toUpperCase()}`,
              department: 'Computer Science & Engineering',
              course: 'B.Tech CSE',
              year: 3,
              semester: 6,
              bio: 'Passionate developer and collegiate hacker ready to build impactful projects.',
              isVerified: true,
              experienceLevel: 'intermediate',
              skills: [
                { skillId: 'sk-1', skillName: 'Python', category: 'technical', proficiency: 'advanced', yearsExperience: 2 },
                { skillId: 'sk-3', skillName: 'React', category: 'technical', proficiency: 'intermediate', yearsExperience: 2 },
              ],
              preferredRoles: ['Full Stack Developer'],
              interests: ['Hackathons', 'AI/ML', 'Web Development'],
              availability: {
                weekdays: true,
                weekends: true,
                timeOfDay: ['evening'],
                mode: 'hybrid',
                hoursPerWeek: 15,
              },
              teamsJoinedIds: [],
              bookmarkedTeamIds: [],
              bookmarkedStudentIds: [],
              isLookingForTeam: true,
            };
            await setDoc(userDocRef, newStudent);
            setAuthenticatedStudent(newStudent);
            setStudents((prev) => [newStudent, ...prev]);
          }
        } catch (e) {
          console.error('Error fetching/saving user profile in Firestore:', e);
        }
      } else {
        setAuthenticatedStudent(null);
      }
      setIsFirebaseAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const firebaseLogin = async (email: string, pass: string) => {
    await loginWithEmail(email, pass);
  };

  const firebaseSignUp = async (
    email: string,
    pass: string,
    fullName: string,
    collegeId: string,
    preferredRole: string,
    collegeName?: string
  ) => {
    const user = await signUpWithEmail(email, pass, fullName);
    if (user) {
      // Parse sample college ID format like "2025/CS/006"
      const parts = collegeId.split('/');
      const parsedYear = parts[0] ? parseInt(parts[0], 10) : 2025;
      const deptCode = (parts[1] || 'CS').toUpperCase();
      const deptMap: Record<string, string> = {
        CS: 'Computer Science & Engineering',
        IT: 'Information Technology',
        EC: 'Electronics & Communication',
        EE: 'Electrical Engineering',
        ME: 'Mechanical Engineering',
        AI: 'Artificial Intelligence & Data Science',
      };
      const department = deptMap[deptCode] || `${deptCode} Department`;
      const currentAcademicYear = parsedYear >= 2020 ? Math.min(4, Math.max(1, 2027 - parsedYear)) : 3;

      const newStudent: Student = {
        id: user.uid,
        userId: user.uid,
        fullName: fullName || user.displayName || 'College Innovator',
        email: user.email || '',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        collegeName: collegeName || 'Campus Engineering College',
        collegeId: collegeId.trim() || '2025/CS/006',
        department: department,
        course: `B.Tech ${deptCode}`,
        year: currentAcademicYear,
        semester: currentAcademicYear * 2,
        bio: 'Passionate developer ready to team up for exciting competitions.',
        isVerified: true,
        experienceLevel: 'intermediate',
        skills: [
          { skillId: 'sk-1', skillName: 'Python', category: 'technical', proficiency: 'intermediate', yearsExperience: 1 },
          { skillId: 'sk-3', skillName: 'React', category: 'technical', proficiency: 'intermediate', yearsExperience: 1 },
        ],
        preferredRoles: [preferredRole || 'Full Stack Developer'],
        interests: ['Hackathons', 'Startups', 'AI/ML'],
        availability: {
          weekdays: true,
          weekends: true,
          timeOfDay: ['evening'],
          mode: 'hybrid',
          hoursPerWeek: 15,
        },
        teamsJoinedIds: [],
        bookmarkedTeamIds: [],
        bookmarkedStudentIds: [],
        isLookingForTeam: true,
      };
      await setDoc(doc(db, 'users', user.uid), newStudent);
      setAuthenticatedStudent(newStudent);
      setStudents((prev) => [newStudent, ...prev]);
    }
  };

  const firebaseGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const firebaseLogout = async () => {
    await logoutUser();
    setAuthenticatedStudent(null);
  };

  // Active current user derived from authenticated student or selected demo persona
  const activeStudentId =
    currentPersonaKey === 'rahul'
      ? 'std-rahul'
      : currentPersonaKey === 'anjali'
      ? 'std-anjali'
      : currentPersonaKey === 'priya'
      ? 'std-priya'
      : currentPersonaKey === 'arjun'
      ? 'std-arjun'
      : 'std-rahul';

  const currentUser =
    authenticatedStudent ||
    students.find((s) => s.id === activeStudentId) ||
    students[0];
  const currentRole: UserRole = isAdmin
    ? 'admin'
    : currentUser.teamsJoinedIds.length > 0 &&
      teams.some((t) => t.ownerId === currentUser.id)
    ? 'team_leader'
    : 'student';

  // Persist state updates
  useEffect(() => {
    localStorage.setItem('teamup_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('teamup_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('teamup_join_requests', JSON.stringify(joinRequests));
  }, [joinRequests]);

  useEffect(() => {
    localStorage.setItem('teamup_invitations', JSON.stringify(teamInvitations));
  }, [teamInvitations]);

  useEffect(() => {
    localStorage.setItem('teamup_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('teamup_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('teamup_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchPersona = (personaKey: 'rahul' | 'anjali' | 'priya' | 'arjun' | 'admin') => {
    setCurrentPersonaKey(personaKey);
    if (personaKey === 'admin') {
      setIsAdmin(true);
      showToast('Admin Mode Active', 'Switched to College Administrator view with moderations and analytics.', 'info');
    } else {
      setIsAdmin(false);
      const studentName =
        personaKey === 'rahul'
          ? 'Rahul Sharma (Student / ML)'
          : personaKey === 'anjali'
          ? 'Anjali Mehta (UI/UX Designer)'
          : personaKey === 'priya'
          ? 'Priya Nair (Team Leader - AI Innovators)'
          : 'Arjun Patel (Full Stack Dev)';
      showToast('Switched Persona', `Now interacting as ${studentName}`, 'success');
    }
  };

  const updateStudentProfile = (studentId: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
    showToast('Profile Updated', 'Your student profile information has been saved.', 'success');
  };

  const addStudentSkill = (studentId: string, newSkill: StudentSkill) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const exists = s.skills.some((sk) => sk.skillName.toLowerCase() === newSkill.skillName.toLowerCase());
        if (exists) {
          return {
            ...s,
            skills: s.skills.map((sk) =>
              sk.skillName.toLowerCase() === newSkill.skillName.toLowerCase() ? newSkill : sk
            ),
          };
        }
        return { ...s, skills: [...s.skills, newSkill] };
      })
    );
    showToast('Skill Added', `${newSkill.skillName} (${newSkill.proficiency}) added to your profile.`, 'success');
  };

  const removeStudentSkill = (studentId: string, skillId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, skills: s.skills.filter((sk) => sk.skillId !== skillId) } : s
      )
    );
    showToast('Skill Removed', 'Skill removed from your profile.', 'info');
  };

  const toggleLookingForTeam = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, isLookingForTeam: !s.isLookingForTeam } : s
      )
    );
    const student = students.find((s) => s.id === studentId);
    showToast(
      student?.isLookingForTeam ? 'Status: Not Looking' : 'Status: Looking for Team',
      student?.isLookingForTeam ? 'You will not appear in recruitment recommendations.' : 'You will now receive team match recommendations!',
      'info'
    );
  };

  const toggleBookmark = (type: 'team' | 'student', id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== currentUser.id) return s;
        if (type === 'team') {
          const has = s.bookmarkedTeamIds.includes(id);
          return {
            ...s,
            bookmarkedTeamIds: has
              ? s.bookmarkedTeamIds.filter((tId) => tId !== id)
              : [...s.bookmarkedTeamIds, id],
          };
        } else {
          const has = s.bookmarkedStudentIds.includes(id);
          return {
            ...s,
            bookmarkedStudentIds: has
              ? s.bookmarkedStudentIds.filter((stId) => stId !== id)
              : [...s.bookmarkedStudentIds, id],
          };
        }
      })
    );
  };

  const createTeam = (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'members'>): Team => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [
        {
          studentId: currentUser.id,
          fullName: currentUser.fullName,
          role: currentUser.preferredRoles[0] || 'Team Leader',
          profileImage: currentUser.profileImage,
          isLeader: true,
          joinedAt: new Date().toISOString().split('T')[0],
          skills: currentUser.skills,
        },
      ],
    };

    setTeams((prev) => [newTeam, ...prev]);

    // Mark current user as part of this team
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentUser.id
          ? { ...s, teamsJoinedIds: [...s.teamsJoinedIds, newTeam.id] }
          : s
      )
    );

    // Create team conversation
    const newConv: Conversation = {
      id: `conv-${newTeam.id}`,
      type: 'team',
      participantIds: [currentUser.id],
      participantNames: { [currentUser.id]: currentUser.fullName },
      participantAvatars: { [currentUser.id]: currentUser.profileImage },
      teamId: newTeam.id,
      title: `${newTeam.name} (Team Chat)`,
      lastMessage: 'Team created! Start inviting teammates to collaborate.',
      lastMessageTimestamp: 'Just now',
      unreadCount: 0,
    };
    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newConv.id]: [
        {
          id: `msg-${Date.now()}`,
          conversationId: newConv.id,
          senderId: currentUser.id,
          senderName: currentUser.fullName,
          senderAvatar: currentUser.profileImage,
          text: `Welcome to ${newTeam.name}! Let's build something great.`,
          timestamp: 'Just now',
          isRead: true,
        },
      ],
    }));

    showToast('Team Created Successfully', `${newTeam.name} is now live and recruiting!`, 'success');
    return newTeam;
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
    showToast('Team Updated', 'Team details have been updated.', 'info');
  };

  const removeMemberFromTeam = (teamId: string, studentId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const updatedMembers = t.members.filter((m) => m.studentId !== studentId);
        return {
          ...t,
          members: updatedMembers,
          status: updatedMembers.length < t.maxMembers ? 'recruiting' : t.status,
        };
      })
    );
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, teamsJoinedIds: s.teamsJoinedIds.filter((id) => id !== teamId) }
          : s
      )
    );
    showToast('Member Removed', 'Student has been removed from the team.', 'info');
  };

  const addStudentDirectlyToTeam = (teamId: string, studentId: string, role?: string) => {
    const team = teams.find((t) => t.id === teamId);
    const student = students.find((s) => s.id === studentId);
    if (!team || !student) return;

    if (team.members.length >= team.maxMembers) {
      showToast('Team Full', 'This team has already reached its maximum member capacity.', 'warning');
      return;
    }

    if (team.members.some((m) => m.studentId === student.id)) {
      showToast('Already a Member', `${student.fullName} is already a member of ${team.name}.`, 'info');
      return;
    }

    const assignedRole = role || student.preferredRoles[0] || 'Squad Member';

    const updatedMembers = [
      ...team.members,
      {
        studentId: student.id,
        fullName: student.fullName,
        role: assignedRole,
        profileImage: student.profileImage,
        isLeader: false,
        joinedAt: new Date().toISOString().split('T')[0],
        skills: student.skills,
      },
    ];

    setTeams((prev) =>
      prev.map((t) =>
        t.id === team.id
          ? {
              ...t,
              members: updatedMembers,
              status: updatedMembers.length >= t.maxMembers ? 'full' : 'recruiting',
            }
          : t
      )
    );

    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, teamsJoinedIds: [...s.teamsJoinedIds, team.id] }
          : s
      )
    );

    // Also mark any pending join requests from this student as accepted
    setJoinRequests((prev) =>
      prev.map((r) =>
        r.teamId === team.id && r.studentId === student.id && r.status === 'pending'
          ? { ...r, status: 'accepted' }
          : r
      )
    );

    // Add to team chat
    setConversations((prev) =>
      prev.map((c) => {
        if (c.teamId === team.id && !c.participantIds.includes(student.id)) {
          return {
            ...c,
            participantIds: [...c.participantIds, student.id],
            participantNames: { ...c.participantNames, [student.id]: student.fullName },
            participantAvatars: { ...c.participantAvatars, [student.id]: student.profileImage },
          };
        }
        return c;
      })
    );

    // Notify student
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: student.id,
      type: 'request_accepted',
      title: `Accepted into ${team.name}! 🎉`,
      message: `Congratulations! ${team.ownerName} accepted you into ${team.name} as ${assignedRole}.`,
      relatedId: team.id,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Student Accepted', `${student.fullName} has been accepted into ${team.name}!`, 'success');
  };

  // Join Requests
  const sendJoinRequest = (teamId: string, message = '') => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    if (team.members.length >= team.maxMembers) {
      showToast('Team Full', 'This team has already reached its maximum member capacity.', 'warning');
      return;
    }

    const existing = joinRequests.find(
      (r) => r.teamId === teamId && r.studentId === currentUser.id && r.status === 'pending'
    );
    if (existing) {
      showToast('Already Requested', 'You already have a pending join request for this team.', 'warning');
      return;
    }

    const breakdown = calculateMatchScore(currentUser, team);

    const newRequest: JoinRequest = {
      id: `req-${Date.now()}`,
      teamId,
      teamName: team.name,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentAvatar: currentUser.profileImage,
      studentRole: currentUser.preferredRoles[0] || 'Member',
      message: message || `Hi ${team.ownerName}, I would love to join ${team.name} and contribute to the project!`,
      matchScore: breakdown.finalScore,
      breakdown,
      status: 'pending',
      createdAt: 'Just now',
    };

    setJoinRequests((prev) => [newRequest, ...prev]);

    // Send notification to team owner
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: team.ownerId,
      type: 'join_request',
      title: `New Join Request for ${team.name}`,
      message: `${currentUser.fullName} (${breakdown.finalScore}% Match) requested to join ${team.name}.`,
      relatedId: newRequest.id,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Join Request Sent', `Your request to join ${team.name} has been sent to ${team.ownerName}!`, 'success');
  };

  const acceptJoinRequest = (requestId: string) => {
    const req = joinRequests.find((r) => r.id === requestId);
    if (!req) return;

    const team = teams.find((t) => t.id === req.teamId);
    const applicant = students.find((s) => s.id === req.studentId);
    if (!team || !applicant) return;

    if (team.members.length >= team.maxMembers) {
      showToast('Cannot Accept', 'Team is already full.', 'warning');
      return;
    }

    // Add to team
    const updatedMembers = [
      ...team.members,
      {
        studentId: applicant.id,
        fullName: applicant.fullName,
        role: req.studentRole,
        profileImage: applicant.profileImage,
        isLeader: false,
        joinedAt: new Date().toISOString().split('T')[0],
        skills: applicant.skills,
      },
    ];

    setTeams((prev) =>
      prev.map((t) =>
        t.id === team.id
          ? {
              ...t,
              members: updatedMembers,
              status: updatedMembers.length >= t.maxMembers ? 'full' : 'recruiting',
            }
          : t
      )
    );

    // Update applicant
    setStudents((prev) =>
      prev.map((s) =>
        s.id === applicant.id
          ? { ...s, teamsJoinedIds: [...s.teamsJoinedIds, team.id] }
          : s
      )
    );

    // Update request status
    setJoinRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r))
    );

    // Add applicant to team chat
    setConversations((prev) =>
      prev.map((c) => {
        if (c.teamId === team.id) {
          return {
            ...c,
            participantIds: [...c.participantIds, applicant.id],
            participantNames: { ...c.participantNames, [applicant.id]: applicant.fullName },
            participantAvatars: { ...c.participantAvatars, [applicant.id]: applicant.profileImage },
          };
        }
        return c;
      })
    );

    // Notify applicant
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: applicant.id,
      type: 'request_accepted',
      title: `Accepted into ${team.name}! 🎉`,
      message: `Congratulations! ${team.ownerName} accepted your join request for ${team.name}.`,
      relatedId: team.id,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Request Accepted', `${applicant.fullName} has joined ${team.name}!`, 'success');
  };

  const rejectJoinRequest = (requestId: string) => {
    setJoinRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r))
    );
    showToast('Request Declined', 'Join request was declined.', 'info');
  };

  // Team Invitations
  const sendTeamInvitation = (teamId: string, studentId: string, message = '') => {
    const team = teams.find((t) => t.id === teamId);
    const student = students.find((s) => s.id === studentId);
    if (!team || !student) return;

    const breakdown = calculateMatchScore(student, team);

    const newInv: TeamInvitation = {
      id: `inv-${Date.now()}`,
      teamId,
      teamName: team.name,
      studentId,
      invitedBy: team.ownerId,
      invitedByName: team.ownerName,
      message: message || `Hey ${student.fullName}, we think your skill set is a fantastic match for ${team.name}!`,
      matchScore: breakdown.finalScore,
      breakdown,
      status: 'pending',
      createdAt: 'Just now',
    };

    setTeamInvitations((prev) => [newInv, ...prev]);

    // Send notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: studentId,
      type: 'invitation',
      title: `Team Invitation: ${team.name}`,
      message: `${team.ownerName} invited you to join ${team.name} (${breakdown.finalScore}% match).`,
      relatedId: newInv.id,
      isRead: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Invitation Sent', `Invited ${student.fullName} to join ${team.name}!`, 'success');
  };

  const acceptTeamInvitation = (invitationId: string) => {
    const inv = teamInvitations.find((i) => i.id === invitationId);
    if (!inv) return;

    const team = teams.find((t) => t.id === inv.teamId);
    const student = students.find((s) => s.id === inv.studentId);
    if (!team || !student) return;

    if (team.members.length >= team.maxMembers) {
      showToast('Team Full', 'The team is already at max capacity.', 'warning');
      return;
    }

    const updatedMembers = [
      ...team.members,
      {
        studentId: student.id,
        fullName: student.fullName,
        role: student.preferredRoles[0] || 'Team Member',
        profileImage: student.profileImage,
        isLeader: false,
        joinedAt: new Date().toISOString().split('T')[0],
        skills: student.skills,
      },
    ];

    setTeams((prev) =>
      prev.map((t) =>
        t.id === team.id
          ? {
              ...t,
              members: updatedMembers,
              status: updatedMembers.length >= t.maxMembers ? 'full' : 'recruiting',
            }
          : t
      )
    );

    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? { ...s, teamsJoinedIds: [...s.teamsJoinedIds, team.id] }
          : s
      )
    );

    setTeamInvitations((prev) =>
      prev.map((i) => (i.id === invitationId ? { ...i, status: 'accepted' } : i))
    );

    // Add to team chat
    setConversations((prev) =>
      prev.map((c) => {
        if (c.teamId === team.id) {
          return {
            ...c,
            participantIds: [...c.participantIds, student.id],
            participantNames: { ...c.participantNames, [student.id]: student.fullName },
            participantAvatars: { ...c.participantAvatars, [student.id]: student.profileImage },
          };
        }
        return c;
      })
    );

    showToast('Joined Team', `You have officially joined ${team.name}!`, 'success');
  };

  const declineTeamInvitation = (invitationId: string) => {
    setTeamInvitations((prev) =>
      prev.map((i) => (i.id === invitationId ? { ...i, status: 'rejected' } : i))
    );
    showToast('Invitation Declined', 'The team invitation has been declined.', 'info');
  };

  const createProject = (projectData: Partial<ProjectIdea>) => {
    const newProj: ProjectIdea = {
      id: `proj-${Date.now()}`,
      title: projectData.title || 'Untitled Project',
      description: projectData.description || '',
      problemStatement: projectData.problemStatement || '',
      proposedSolution: projectData.proposedSolution || '',
      creatorId: currentUser.id,
      creatorName: currentUser.fullName,
      creatorAvatar: currentUser.profileImage,
      requiredSkills: projectData.requiredSkills || [],
      preferredSkills: projectData.preferredSkills || [],
      requiredRoles: projectData.requiredRoles || [],
      openPositions: projectData.openPositions || 3,
      status: 'team_forming',
      createdAt: new Date().toISOString(),
      eventId: projectData.eventId,
      teamId: projectData.teamId,
    };
    setProjects((prev) => [newProj, ...prev]);
    showToast('Project Published', 'Your project idea is published on the Project Board!', 'success');
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderAvatar: currentUser.profileImage,
      text,
      timestamp: 'Just now',
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTimestamp: 'Just now',
            }
          : c
      )
    );
  };

  const createOrOpenDirectChat = (targetStudent: Student): string => {
    const existing = conversations.find(
      (c) =>
        c.type === 'direct' &&
        c.participantIds.includes(currentUser.id) &&
        c.participantIds.includes(targetStudent.id)
    );

    if (existing) {
      return existing.id;
    }

    const newId = `conv-dm-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      type: 'direct',
      participantIds: [currentUser.id, targetStudent.id],
      participantNames: {
        [currentUser.id]: currentUser.fullName,
        [targetStudent.id]: targetStudent.fullName,
      },
      participantAvatars: {
        [currentUser.id]: currentUser.profileImage,
        [targetStudent.id]: targetStudent.profileImage,
      },
      title: targetStudent.fullName,
      lastMessage: 'Direct conversation started.',
      lastMessageTimestamp: 'Just now',
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newId]: [
        {
          id: `msg-${Date.now()}`,
          conversationId: newId,
          senderId: currentUser.id,
          senderName: currentUser.fullName,
          senderAvatar: currentUser.profileImage,
          text: `Hi ${targetStudent.fullName}! I saw your profile on TeamUp.`,
          timestamp: 'Just now',
          isRead: true,
        },
      ],
    }));

    return newId;
  };

  // Admin Actions
  const toggleVerifyStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, isVerified: !s.isVerified } : s))
    );
    showToast('Verification Toggled', 'Student college verification status updated.', 'info');
  };

  const resolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
    showToast('Report Updated', `Report marked as ${status}.`, 'info');
  };

  const addGlobalSkill = (newSkill: Omit<Skill, 'id'>) => {
    const skill: Skill = {
      ...newSkill,
      id: `sk-${Date.now()}`,
    };
    setSkills((prev) => [...prev, skill]);
    showToast('Skill Added to Taxonomy', `${skill.name} is now available platform-wide.`, 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        isAdmin,
        students,
        teams,
        events,
        projects,
        skills,
        conversations,
        messages,
        notifications,
        joinRequests,
        teamInvitations,
        reports,
        toasts,
        selectedEventFilter,
        firebaseUser,
        isFirebaseAuthLoading,
        firebaseLogin,
        firebaseSignUp,
        firebaseGoogleSignIn,
        firebaseLogout,
        adminTab,
        setAdminTab,
        currentPersonaKey,
        switchPersona,
        setSelectedEventFilter,
        showToast,
        removeToast,
        updateStudentProfile,
        addStudentSkill,
        removeStudentSkill,
        toggleLookingForTeam,
        toggleBookmark,
        createTeam,
        updateTeam,
        removeMemberFromTeam,
        addStudentDirectlyToTeam,
        sendJoinRequest,
        acceptJoinRequest,
        rejectJoinRequest,
        sendTeamInvitation,
        acceptTeamInvitation,
        declineTeamInvitation,
        createProject,
        sendMessage,
        createOrOpenDirectChat,
        toggleVerifyStudent,
        resolveReport,
        addGlobalSkill,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
