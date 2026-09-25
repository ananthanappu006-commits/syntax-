# ⚡ TeamUp — College-Exclusive Smart Squad & Hackathon Formation Platform

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12.19-orange?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **TeamUp** is a college-exclusive collaboration ecosystem designed to solve the two-way talent matching problem for college hackathons, technical competitions, academic capstones, startup incubators, and student club projects.
>
> Built with modern **Liquid Glass / Glassmorphism** aesthetics, weighted **Two-Way Skill Matching**, multi-portal switching, and cloud-backed authentication.

---

## 📑 Table of Contents

- [The Core Problem & Solution](#-the-core-problem--solution)
- [Technical Stack & Architecture](#-technical-stack--architecture)
- [Design System & Aesthetics](#-design-system--aesthetics)
- [Key Features & Portal Architecture](#-key-features--portal-architecture)
  - [1. Student Portal (Solo Seeker)](#1-student-portal-solo-seeker)
  - [2. Team Leader Portal (Squad Management)](#2-team-leader-portal-squad-management)
  - [3. Administrator Portal (Governance)](#3-administrator-portal-governance)
  - [4. Floating Persistent Portal Switcher](#4-floating-persistent-portal-switcher)
  - [5. Authentication & College ID Parsing](#5-authentication--college-id-parsing)
- [Two-Way Skill Matching Engine](#-two-way-skill-matching-engine)
- [Directory Structure](#-directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Firebase Services & Security](#-firebase-services--security)
- [Scripts](#-scripts)

---

## 🎯 The Core Problem & Solution

In college tech ecosystems:
1. **Students** want to compete in hackathons but lack teammates with complementary skill sets (e.g., an ML student needing a UI/UX designer and frontend dev).
2. **Team Leaders** have an innovative idea but struggle to identify, vet, and recruit students with specific missing skills.
3. **College Organizers** struggle with unbalanced teams, unverified students, and last-minute dropouts.

### TeamUp solves this with:
- **Two-Way Compatibility Engine**: Evaluates both Student $\rightarrow$ Team fit and Team $\rightarrow$ Student skill gap coverage.
- **Skill Gap Heatmap**: Automatically identifies missing technical proficiencies and recommends exact students to fill them.
- **Role-Based Workspaces**: Tailored experiences for solo applicants, team leaders, and college administrators.

---

## 🛠 Technical Stack & Architecture

### **Frontend Core**
- **React 19 (`v19.2.8`)**: Next-generation React leveraging concurrent rendering and modern hook patterns.
- **TypeScript (`~6.0.2`)**: Strict end-to-end typing for domain models, matching metrics, and application state.
- **Vite 8 (`v8.3.1`)**: Ultra-fast build tool and dev server featuring Hot Module Replacement (HMR).
- **Lucide React (`v1.48.0`)**: Streamlined, customizable SVG icon library.
- **Canvas Confetti (`v1.9.4`)**: Micro-interaction feedback for successful squad additions and achievements.

### **Styling & Design Engine**
- **Tailwind CSS v4 (`v4.3.3`)** with `@tailwindcss/vite`: Utility-first CSS engine with zero runtime.
- **Custom Liquid Glass System**: Specially tuned CSS filters combining `backdrop-blur(28px)`, saturation boosts (`190%`), dual-layer inset specular light reflections, and translucent frosted backdrops (`rgba(255, 255, 255, 0.75)`).
- **Typography Tokens**:
  - `font-moara`: Editorial high-contrast serif for headings and hero titles.
  - `font-athelas`: Elegant serif companion.
  - `font-uber`: Geometric clean sans-serif for UI labels, badges, inputs, and tabular data.

### **Backend & Cloud Services**
- **Firebase SDK (`v12.19.0`)**:
  - **Firebase Authentication**: Email/Password authentication & Google Sign-In with college credentials.
  - **Cloud Firestore**: Real-time NoSQL document database (`nam5`) storing student profiles, squads, join requests, ontologies, and conversations.
  - **Firestore Security Rules**: Role-based access control protecting student contact info and administrative operations.

### **State Management**
- **React Context (`AppContext`)**: Single source of truth managing:
  - Active user session & authenticated student profile.
  - Active demo personas (`rahul`, `anjali`, `priya`, `arjun`, `admin`).
  - Real-time squad collections, join requests, invitations, and notifications.
  - Local persistence via `localStorage` synchronization for seamless offline state recovery.

---

## 🎨 Design System & Aesthetics

Inspired by modern luxury SaaS and editorial web design:

| Token | Value / Effect | Usage |
|---|---|---|
| **Warm Pearl Background** | `#f8f9fa` with radial orange/amber glow | Global body background |
| **Vibrant Coral Accent** | `#ff4d15` (`.btn-primary-coral`) | Primary CTAs, active badges, highlights |
| **Dark Obsidian Pill** | `#18181b` (`.btn-dark-pill`) | Secondary actions, active tab pills |
| **Liquid Glass Card** | Translucent frosted white + `blur(24px)` | Content cards, modals, preview containers |
| **Liquid Search Bar** | Multi-segment glass dock with input dividers | Hero discovery bar |
| **Corner Lens Blur** | Radial feathered `backdrop-blur-[14px]` | Hero visual centerpiece corner treatment |

---

## 🚀 Key Features & Portal Architecture

### 1. Student Portal (Solo Seeker)
- **Explore Squads**: Search and filter teams by hackathon, required skills, team size, and role vacancies.
- **Two-Way Match Breakdown Modal**: Inspect exactly why a team matches your profile with visual gauges for Skill (50%), Role (20%), Interests (15%), Experience (10%), and Availability (5%).
- **1-Click "Request to Join Team"**: Submit an application accompanied by an introductory pitch message.
- **Student Profile Management**: Showcase technical stack, proficiency levels, GitHub/portfolio links, college ID, and preferred roles.
- **Bookmarks**: Bookmark high-potential teams and fellow students for quick access.

### 2. Team Leader Portal (Squad Management)
- **Squad Header Banner**: Displays squad avatar, capacity gauge, recruiting status toggle, and direct squad chat link.
- **Skill Coverage Heatmap (`SkillCoverageBar`)**: Automatically calculates team-wide skill coverage and pinpoints missing technical requirements.
- **Interactive Join Applications Review**:
  - View incoming applicant cards directly on the **Overview** dashboard and **Join Requests** tab.
  - Inspect applicant match score, pitch message, department, year, and verified status.
  - 🧡 **Accept into Squad**: 1-click acceptance that adds the student to squad members, increments capacity, syncs team chat, and sends real-time congratulatory notification.
  - ✖️ **Decline**: Gracefully rejects requests.
  - 💬 **Chat with Applicant**: Pre-acceptance interview chat room.
- **Instant Candidate Recruitment**: Proactively browse recommended students and 1-click **"Instant Add to Squad"** or dispatch official team invitations.
- **Member Management**: Assign roles, review member contributions, or rebalance team seats.

### 3. Administrator Portal (Governance)
- **Dedicated Top Navbar**: When entering the Admin portal, standard student features (`+ Create Team`, notifications bell) are replaced with executive administration controls:
  - 📊 **Analytics KPI**: Platform metrics (Total Students, Solo Seekers, Active Squads, Moderation Queue).
  - 🛡️ **Verify Students**: Manage student verification badges and audit college ID syntax.
  - 🗂️ **Moderate Teams**: Oversee active squads, ensure compliance, and archive inactive groups.
  - ✨ **Skills Taxonomy**: Expand the global technical taxonomy and define aliases (e.g., `React.js` $\rightarrow$ `React`).
  - 🚩 **Safety Reports**: Review and resolve student/team flags.
  - 🚪 **Exit Admin**: 1-click return to the student platform.

### 4. Floating Persistent Portal Switcher
- A docked frosted glass bar (`PortalSwitcherBar`) fixed at the bottom of the screen allowing seamless switching between:
  - 🎓 **Student Portal** (Rahul Sharma — Solo ML Seeker)
  - 👥 **Team Lead Portal** (Priya Nair — Leader of AI Innovators)
  - 🛡️ **Admin Portal** (Administrator — Governance & Verification)
- Features real-time active portal indicators and an minimize/expand toggle.

### 5. Authentication & College ID Parsing
- Seamless authentication supporting **Email/Password** and **Google Sign-In**.
- Structured College ID validation adhering to university conventions:
  $$\text{Format: } \mathbf{YYYY/DEPT/ROLL} \quad \text{(e.g., } 2025/\text{CS}/006\text{)}$$
- Automatically parses admission year and department into the student's persistent profile.

---

## 🧮 Two-Way Skill Matching Engine

The matching engine in `src/services/matchingEngine.ts` computes compatibility using a weighted multi-factor formula:

$$\text{Final Match Score} = S_{\text{skills}} + S_{\text{role}} + S_{\text{interest}} + S_{\text{experience}} + S_{\text{availability}}$$

| Component | Weight | Calculation Method |
|---|---|---|
| **Skills Coverage** | **50%** | Intersection of student skills and team's required/missing skills weighted by student proficiency (Beginner, Intermediate, Advanced, Expert). |
| **Role Complementarity** | **20%** | Match between student preferred roles and open positions within the squad. |
| **Interest Alignment** | **15%** | Jaccard similarity across project domains (e.g., AI/ML, Web3, FinTech, Healthcare). |
| **Experience Level** | **10%** | Compatibility between student year/experience and team target complexity. |
| **Availability & Mode** | **5%** | Overlap in weekly time commitments and collaboration preference (In-Person / Remote / Hybrid). |

---

## 📁 Directory Structure

```
teamup/
├── public/                       # Static public assets
│   ├── hero-team.jpg             # Hero collaboration showcase visual
│   ├── favicon.svg               # Brand favicon
│   └── icons.svg
├── src/
│   ├── components/               # Reusable presentation components
│   │   ├── layout/               # Top Navbar, Bottom PortalSwitcherBar, ToastContainer
│   │   ├── matching/             # SkillCoverageBar, MatchScoreModal
│   │   ├── students/             # StudentCard, StudentProfileModal
│   │   └── teams/                # CreateTeamModal, TeamDetailsModal
│   ├── context/
│   │   └── AppContext.tsx        # Central state, persona switching, Firebase session
│   ├── data/
│   │   └── mockData.ts           # Initial college dataset (hackathons, squads, students)
│   ├── pages/                    # Route and portal views
│   │   ├── AdminDashboard.tsx    # Governance, ID verification, skills taxonomy
│   │   ├── AuthPage.tsx          # Login & Signup with College ID format
│   │   ├── ChatPage.tsx          # Real-time team and direct messaging
│   │   ├── EventsPage.tsx        # Hackathons and technical competitions board
│   │   ├── FindTeammates.tsx     # Student discovery directory with skill filters
│   │   ├── FindTeams.tsx         # Team discovery directory with coverage inspection
│   │   ├── LandingPage.tsx       # Homrent-inspired hero showcase & discovery
│   │   ├── ProfilePage.tsx       # Editable student resume & skills portfolio
│   │   ├── ProjectBoardPage.tsx  # Student startup and research project board
│   │   ├── StudentDashboard.tsx  # Solo student recommendations and applications
│   │   └── TeamLeaderDashboard.tsx # Squad management, applicant review & acceptance
│   ├── services/
│   │   ├── firebase.ts           # Firebase App, Auth & Firestore initialization
│   │   └── matchingEngine.ts     # Two-way mathematical scoring algorithm
│   ├── types/
│   │   └── index.ts              # TypeScript domain interfaces
│   ├── App.tsx                   # Master root layout & navigation
│   ├── index.css                 # Tailwind v4 configuration & liquid glass utilities
│   └── main.tsx                  # Application entry point
├── .firebaserc                   # Active Firebase project alias (sample-95ec0)
├── firebase.json                 # Firebase deployment configuration
├── firestore.rules               # Cloud Firestore security rules
├── package.json                  # Dependencies and build scripts
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite configuration
```

---

## ⚡ Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.0.0` or higher)
- [npm](https://www.npmjs.com/) (version `9.0.0` or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/teamup.git
cd teamup
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
The repository is pre-configured with project `sample-95ec0`. If you wish to use your own Firebase project, update `src/services/firebase.ts` with your web app credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

---

## 🔒 Firebase Services & Security

The project includes production-ready Cloud Firestore security rules (`firestore.rules`):
- **Users**: Read access for authenticated college students; write access restricted to profile owners.
- **Teams**: Public read; modifications restricted to team leaders; member management restricted to leaders.
- **Join Requests**: Created by applicants; read and accepted/declined exclusively by squad owners.
- **Conversations & Messages**: Accessible solely by conversation participants.

To deploy security rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Compiles TypeScript (`tsc -b`) and generates production bundle |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs ultra-fast Oxlint analysis across the codebase |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
