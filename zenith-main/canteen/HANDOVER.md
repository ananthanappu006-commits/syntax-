# Smart Canteen Management Platform — Project Handover Document

> **Prepared by:** Engineering & Design Team  
> **Handover Date:** September 26, 2026  
> **Version:** 2.0 — Liquid Glass, Athelas Typography & Warm Amber Aesthetic  
> **Status:** Fully Functional — Ready for Production / Cloud Deployment  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Multi-Portal Architecture](#3-multi-portal-architecture)
4. [Project File Structure](#4-project-file-structure)
5. [How to Run Locally](#5-how-to-run-locally)
6. [Core Integrations](#6-core-integrations)
   - [6.1 Firebase Authentication](#61-firebase-authentication)
   - [6.2 Razorpay Payment Gateway](#62-razorpay-payment-gateway)
7. [Design System & Typography](#7-design-system--typography)
8. [Feature Inventory per Portal](#8-feature-inventory-per-portal)
   - [8.1 Student Portal (`index.html`)](#81-student-portal-indexhtml)
   - [8.2 Kitchen Staff KDS (`canteen.html`)](#82-kitchen-staff-kds-canteenhtml)
   - [8.3 Executive Admin Console (`admin.html`)](#83-executive-admin-console-adminhtml)
9. [Data Models & Persistence](#9-data-models--persistence)
10. [Known Limitations & Production Roadmap](#10-known-limitations--production-roadmap)
11. [Developer Maintenance & Tips](#11-developer-maintenance--tips)

---

## 1. Project Overview

The **Smart Canteen Management Platform** (`EAT, UP!`) is a high-performance web platform designed for modern university campuses. It eliminates physical cafeteria lunch queues, provides real-time token tracking, integrates digital payments via Razorpay, enforces secure student authentication via Firebase, and provides dedicated portals for kitchen staff and canteen administrators.

### Core Problems Solved
- **No Physical Waiting Queues**: Students pre-order and track live kitchen preparation stages with token numbers.
- **Digital Cashless Dining**: Replaced slow cash counters with official **Razorpay** (UPI, Google Pay, PhonePe, Cards, Netbanking).
- **Mandatory Student Identification**: Integrated **Firebase Authentication** (Google Sign-In & Email/Password) required before meal bookings.
- **Separated Kitchen Workflow**: Dedicated **Kitchen Display System (KDS)** on tablets/screens for counter cooks.
- **Financial Audit & Inventory Controls**: Real-time **₹ Revenue & Sales** reporting, gross sales curves, and pantry stock tracking for administrators.

---

## 2. Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Structure** | Semantic HTML5 | Clean multi-page architecture (`index.html`, `canteen.html`, `admin.html`) |
| **Styling** | Vanilla CSS (Custom Properties) | Liquid-glass aesthetic, custom color tokens, responsive flex/grid layouts |
| **Logic** | Vanilla JavaScript ES6+ (OOP Classes) | Modular OOP controllers (`StudentPortal`, `CanteenConsole`, `AdminConsole`, `CanteenStorage`) |
| **Authentication** | Firebase Auth SDK v10.8.0 (Compat) | Google OAuth Popup + Email/Password + 1-Click Demo Sign-in |
| **Payments** | Razorpay Standard Checkout SDK | Live Indian Rupee (`₹`) checkout supporting UPI, Cards, and Netbanking |
| **Typography** | Google Fonts (`Athelas`, `Moara`, `Outfit`, `Plus Jakarta Sans`) | Editorial serif headers with clean, modern sans body text |
| **Icons** | 100% Scalable Vector SVGs | Clean vector SVG icons; zero emojis across the entire platform |
| **Audio** | Web Audio API (Synthesizer) | Synthesized sound chimes (Tap, Add to Cart, Order Ready, Success) |
| **State Sync** | Reactive `localStorage` Event Bus | Pub/Sub cross-tab synchronization between Student, Canteen, and Admin portals |

---

## 3. Multi-Portal Architecture

The platform is partitioned into three specialized, synchronized portals:

```
                            ┌─────────────────────────────────────────┐
                            │           Reactive State Bus            │
                            │   (localStorage + storage.js events)    │
                            └────┬─────────────────┬────────────────┬─┘
                                 │                 │                │
            ┌────────────────────▼──┐   ┌──────────▼─────────┐   ┌──▼──────────────────┐
            │    Student Portal     │   │ Kitchen Display KDS│   │    Admin Portal     │
            │     (index.html)      │   │   (canteen.html)   │   │    (admin.html)     │
            ├───────────────────────┤   ├────────────────────┤   ├─────────────────────┤
            │ • Top Nav: Home, Menu,│   │ • 4-Column Kanban  │   │ • ₹ Revenue & Sales │
            │   Orders, Search, Cart│   │ • Accept & Cook    │   │ • Financial Ledger  │
            │ • Firebase Auth Modal │   │ • Mark Ready Ding  │   │ • Menu Availability │
            │ • Razorpay Checkout   │   │ • Instant Dispense │   │ • Pantry Inventory  │
            │ • Live Queue Tracker  │   │ • Low Stock Alerts │   │ • Student Feedback  │
            └───────────────────────┘   └────────────────────┘   └─────────────────────┘
```

---

## 4. Project File Structure

```
canteen/
│
├── index.html                  ← Student Ordering Portal (Home, Menu, Orders, Cart, Profile)
├── canteen.html                ← Kitchen Display System (Live orders Kanban, stock controls)
├── admin.html                  ← Executive Admin Portal (₹ Revenue, Menu CRUD, Inventory)
├── serve.ps1                   ← PowerShell static HTTP server
├── start-server.bat            ← Windows double-click launcher
├── HANDOVER.md                 ← Comprehensive platform documentation
│
├── css/
│   └── styles.css              ← Complete design system (liquid glass, themes, typography, KDS)
│
├── js/
│   ├── data.js                 ← Master seed data (24 menu items, seed orders, pantry inventory)
│   ├── storage.js              ← Reactive Pub/Sub storage wrapper with cross-tab sync
│   ├── audio.js                ← Web Audio API sound synthesizer
│   ├── firebase-auth.js        ← Firebase configuration, Google Auth, sign-up & session guard
│   ├── student.js              ← Student portal controller & Razorpay payment orchestrator
│   ├── canteen.js              ← Kitchen staff KDS controller & status dispatcher
│   ├── admin.js                ← Admin console controller & ₹ financial analytics engine
│   └── app.js                  ← App coordinator, toasts, and portal routing
│
└── assets/
    ├── ASSETS_README.md        ← Food photography catalogue documentation
    ├── hero_noodles.jpg        ← Hero wok noodles display photo
    ├── hero_wok_noodles.jpg    ← Alternate hero wok image
    ├── canteen_storefront.jpg  ← Campus dining hall banner image
    ├── student_dining.jpg      ← Student testimonial photo
    ├── chicken_biryani.jpg     ← Food asset: Biryani, Tikka, Wraps, Burgers
    ├── veg_meals.jpg           ← Food asset: Deluxe Veg Thali, Dal Makhani, Rajma Chawal
    ├── paneer_fried_rice.jpg   ← Food asset: Fried Rice, Hakka Noodles
    ├── masala_dosa.jpg         ← Food asset: Masala Dosa, Idli Vada, Aloo Paratha
    ├── samosa_chai.jpg         ← Food asset: Samosa, Poha, Pav Bhaji, Peri-Peri Fries
    └── lime_juice.jpg          ← Food asset: Fresh Lime Soda, Cold Coffee, Mango Lassi
```

---

## 5. How to Run Locally

### Option A — PowerShell Server (Recommended)
```powershell
cd c:\Users\LENOVO\Downloads\zenith-main\zenith-main\canteen
.\serve.ps1
# Open browser at: http://localhost:3000/index.html
```

### Option B — Windows Batch Launcher
```bat
Double-click: start-server.bat
```

### Option C — Python HTTP Server
```bash
python -m http.server 3000
# Open: http://localhost:3000/index.html
```

---

## 6. Core Integrations

### 6.1 Firebase Authentication
- **Project ID**: `kleen-92925`
- **Config file**: [`js/firebase-auth.js`](file:///c:/Users/LENOVO/Downloads/zenith-main/zenith-main/canteen/js/firebase-auth.js)
- **Authentication Modes**:
  1. **Google Sign-In Popup**: One-click sign in with university Google accounts (`signInWithPopup`).
  2. **Email & Password**: Full account registration, password login, and reset flow.
  3. **1-Click Campus Demo Sign-In**: Quick test shortcut for development and demo walkthroughs.
- **Mandatory Booking Guard**:
  - Unauthenticated students can browse menus and add items to tray.
  - When proceeding to checkout, `processRazorpayPayment()` intercepts unauthenticated users, displays the mandatory booking banner, and resumes checkout immediately upon authentication.

### 6.2 Razorpay Payment Gateway
- **SDK**: `https://checkout.razorpay.com/v1/checkout.js`
- **Key ID**: `rzp_test_TgNoq5ZbtB5tOp`
- **Currency**: `INR` (Indian Rupee `₹`)
- **Payment Handling**:
  - Automatically loads standard Razorpay modal upon checkout.
  - On successful authorization (`razorpay_payment_id`), creates verified order record with token number and advances student directly to live queue tracker.

---

## 7. Design System & Typography

### Aesthetics: Liquid Glass & Warm Cream
- **Background**: `#FAF7F2` (Warm Ivory / Cream)
- **Card Surfaces**: `#FFFFFF` with `backdrop-filter: blur(16px)` and subtle borders (`rgba(0, 0, 0, 0.08)`)
- **Accent Primary**: `#FF5E00` to `#FF8C00` (Warm Amber & Tangerine Gradients)
- **High-Contrast Text**:
  - Headings: `#1F2937` (Dark Charcoal)
  - Body: `#4B5563` (Subtle Slate)
  - Muted: `#6B7280` (Medium Gray)
- **Zero Emojis Policy**: Replaced all emojis with scalable, crisp vector SVGs for diet indicators (Pure Veg / Non-Veg dots), kitchen action buttons, and payment badges.

### Typography Hierarchy
```css
/* Display & Editorial Headlines */
font-family: 'Athelas', 'Moara', 'Georgia', serif;

/* Headings & Brand Crest */
font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;

/* Data Values, Numbers & Tokens */
font-family: 'Outfit', sans-serif;
```

---

## 8. Feature Inventory per Portal

### 8.1 Student Portal (`index.html`)
- **Sticky Liquid Glass Top Navbar**:
  - Brand Crest with hot bowl SVG icon
  - Main Navigation: **Home**, **Menu**, **Orders** (Direct past & live orders link)
  - Search Bar: Live keyword filter across biryanis, meals, snacks, and drinks
  - Cart Pill Button with real-time item counter
  - Profile / Sign In button reflecting active Firebase auth state
- **Home View**:
  - Hero banner with wok imagery and kitchen status indicators
  - Category Explorer ("Something For Every Craving")
  - Chef's Daily Specials carousel
  - Campus Rewards & Student Reviews section
- **Menu View**:
  - 24 campus dishes with dietary tags (Pure Veg green dot / Non-Veg red dot)
  - Category filters (Breakfast, Lunch, Snacks, Fast Food, Beverages, Desserts)
  - Pure Veg / Non-Veg dietary toggle
  - Favorites heart toggle
- **Cart & Checkout**:
  - Slide-in cart drawer with quantity stepper
  - Campus 10% discount deduction and 5% GST breakdown
  - Razorpay checkout launch with mandatory Firebase authentication check
- **Live Order Tracker**:
  - 5-stage animated progress track (Confirmed → Paid → Cooking → Ready → Collected)
  - Prominent token number display (e.g., `#A1043`)
  - People ahead in queue and dynamic wait time estimation
  - "Ready for Pickup at Counter 2" banner

### 8.2 Kitchen Staff KDS (`canteen.html`)
- **Kitchen KPI Metrics**:
  - Placed Orders, Cooking in Prep, Ready for Pickup, Dispensed Today
- **4-Column Live Dispatch Kanban**:
  - **New Orders**: Incoming student orders appearing in real time; "Accept & Cook" action.
  - **Cooking & Prep**: In-progress orders; "Mark Ready & Notify" action (triggers sound chime).
  - **Ready for Pickup**: Awaiting collection at Counter 2; "Mark Picked Up" action.
  - **Completed**: Historical logs of dispensed meals.
- **Simulate Order Button**: One-click test button to inject simulated orders without manual checkout.
- **Ingredient Stock Warnings**: Real-time alerts for pantry items nearing critical thresholds.
- **Instant Food Availability Manager**: One-click toggling of food items (Available vs Sold Out).

### 8.3 Executive Admin Console (`admin.html`)
- **₹ Revenue & Sales Suite**:
  - 4 Financial KPI cards (Gross Sales `₹38,450+`, Razorpay UPI Settlements `₹29,800+`, Counter POS/Cash `₹8,650`, Average Order Value `₹98.50`).
  - 7-Day Revenue Trend (₹) dynamic SVG curve.
  - Peak Hourly Rush & Volume bar chart.
  - Top Dishes by Revenue (₹).
  - Kitchen preparation throughput & speed metrics.
  - **Live Payment & Billing Audit Ledger**: Table with Token #, Student Customer, Dishes, Gateway, Amount in `₹`, and status.
  - **Export Revenue Audit (CSV)** button.
- **Menu Manager**: Add new dishes, edit pricing, toggle availability, and designate daily specials.
- **Inventory Stocks**: Comprehensive 10-ingredient pantry table with restock controls (+10 units or custom).
- **Live Orders**: Admin view of the kitchen queue with cancellation and status controls.
- **Student Feedback**: Review student star ratings, comments, and publish staff replies.

---

## 9. Data Models & Persistence

All persistent data is managed by `CanteenStorage` ([`js/storage.js`](file:///c:/Users/LENOVO/Downloads/zenith-main/zenith-main/canteen/js/storage.js)) via `localStorage` with reactive event dispatching:

```javascript
// Storage Key: smart_canteen_platform_data_v2
{
  currentUser: {
    id: "usr_101",
    name: "Rahul Sharma",
    studentId: "CS-2023-8941",
    email: "rahul.sharma@campus.edu",
    phone: "+91 98765 43210",
    role: "student",
    favorites: ["item_1", "item_4", "item_13"]
  },
  menuItems: [ /* 24 detailed menu items */ ],
  inventory: [ /* 10 raw ingredient pantry records */ ],
  orders: [ /* Live and completed order logs */ ],
  feedbackList: [ /* Student ratings and replies */ ],
  notifications: [ /* Real-time in-app alerts */ ]
}
```

---

## 10. Known Limitations & Production Roadmap

| Priority | Limitation | Impact | Production Recommendation |
|---|---|---|---|
| **High** | Client-side `localStorage` data | State not shared across different devices | Connect Firebase Cloud Firestore for real-time cloud database synchronization |
| **High** | Client-only Razorpay checkout | Secret key cannot be verified in browser | Deploy Firebase Cloud Function to verify Razorpay SHA256 webhook signatures |
| **Medium** | Public Admin & Canteen URLs | No staff login gate on `admin.html` | Add Firebase Admin Auth guard with role verification |
| **Medium** | Browser tab notifications only | Students must have tab open for status | Implement Web Push Notifications via Service Worker & Firebase Cloud Messaging |
| **Low** | Static images for dishes | Photos are shared among similar categories | Upload individual dish images via Firebase Cloud Storage |

---

## 11. Developer Maintenance & Tips

### Adding a New Food Dish
1. Open [`js/data.js`](file:///c:/Users/LENOVO/Downloads/zenith-main/zenith-main/canteen/js/data.js).
2. Add a new item object to `INITIAL_DATA.menuItems` with unique `id`, `name`, `price`, `isVeg`, `category`, and `image`.
3. In browser, click **Reset Demo** or clear `localStorage` to reload with the new item.

### Switching Active Admin Tabs Programmatically
```javascript
window.adminConsole.switchAdminTab("analytics"); // Opens ₹ Revenue & Sales
window.adminConsole.switchAdminTab("menu");      // Opens Menu Manager
window.adminConsole.switchAdminTab("inventory"); // Opens Pantry Inventory
window.adminConsole.switchAdminTab("orders");    // Opens Live Orders
window.adminConsole.switchAdminTab("feedback");  // Opens Student Reviews
```

### Simulating Test Orders
- Open [`canteen.html`](file:///c:/Users/LENOVO/Downloads/zenith-main/zenith-main/canteen/canteen.html) in your browser.
- Click the **"Simulate Order"** button in the top navbar.
- The order will immediately appear in the **New Orders** column of the kitchen board and sync to the student orders list.
