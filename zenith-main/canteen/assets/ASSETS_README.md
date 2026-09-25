# 📁 Smart Canteen Management Platform — Assets & Full Feature Documentation

> **Last Updated:** September 2026  
> **Platform Version:** 1.0 (Black & Lavender Theme)  
> **Location:** `d:\canteen\`

---

## 📂 Project File Structure

```
d:\canteen\
│
├── index.html              # Main HTML shell — all page views & modals
├── serve.ps1               # PowerShell local dev HTTP server script
├── start-server.bat        # One-click Windows launcher for local server
│
├── css/
│   └── styles.css          # Complete design system — Black & Lavender theme
│
├── js/
│   ├── data.js             # Seed data: menu, orders, inventory, feedback
│   ├── storage.js          # Reactive state manager + localStorage persistence
│   ├── audio.js            # Web Audio API sound synthesizer
│   ├── student.js          # Student portal logic (all tabs & features)
│   ├── admin.js            # Admin & kitchen console logic
│   └── app.js              # Master app controller (role switcher, toasts)
│
└── assets/                 # Food photography images + docs
    ├── chicken_biryani.jpg
    ├── veg_meals.jpg
    ├── paneer_fried_rice.jpg
    ├── masala_dosa.jpg
    ├── samosa_chai.jpg
    └── lime_juice.jpg
```

---

## 🖼️ Assets Directory — Image Files

All food photography images in this folder are **AI-generated, high-quality, gourmet food images** used throughout the menu. Each image is a 1:1 aspect ratio JPEG.

| File Name | Used For | File Size |
|---|---|---|
| `chicken_biryani.jpg` | Hyderabadi Chicken Biryani, Chicken Tikka Rice Bowl, Kathi Roll, Momos, Burger | ~865 KB |
| `veg_meals.jpg` | Deluxe Veg Thali, Dal Makhani, Rajma Chawal, Gulab Jamun | ~938 KB |
| `paneer_fried_rice.jpg` | Paneer Fried Rice, Paneer Tikka Wrap, Hakka Noodles Combo | ~883 KB |
| `masala_dosa.jpg` | Masala Dosa, Idli & Vada Combo, Aloo Paratha | ~761 KB |
| `samosa_chai.jpg` | Samosa with Chai, Poha, Pav Bhaji, Peri-Peri Fries | ~835 KB |
| `lime_juice.jpg` | Lime Mint Soda, Cold Coffee, Mango Lassi, Brownie Sundae | ~830 KB |

---

## 🍽️ Complete Menu — All 24 Food Items

### 🌅 Breakfast (4 Items)

| # | Item Name | Price | Rating | Prep Time | Type | Stock |
|---|---|---|---|---|---|---|
| 1 | **Crispy Masala Dosa** | ₹60 | ⭐ 4.9 (310 reviews) | 8 min | 🟢 Veg | 45 |
| 2 | **Steamed Idli & Medu Vada Combo** | ₹50 | ⭐ 4.8 (180 reviews) | 4 min | 🟢 Veg | 50 |
| 3 | **Stuffed Aloo Paratha with Curd** | ₹55 | ⭐ 4.8 (142 reviews) | 8 min | 🟢 Veg | 35 |
| 4 | **Indori Poha with Crunchy Sev** | ₹35 | ⭐ 4.6 (95 reviews) | 3 min | 🟢 Veg | 40 |

### 🍛 Lunch & Meals (6 Items)

| # | Item Name | Price | Rating | Prep Time | Type | Stock |
|---|---|---|---|---|---|---|
| 5 | **Hyderabadi Chicken Dum Biryani** | ₹130 | ⭐ 4.9 (210 reviews) | 10 min | 🔴 Non-Veg | 42 |
| 6 | **Deluxe Veg Thali Meals** | ₹85 | ⭐ 4.8 (245 reviews) | 5 min | 🟢 Veg | 65 |
| 7 | **Sizzling Paneer Fried Rice** | ₹95 | ⭐ 4.7 (118 reviews) | 12 min | 🟢 Veg | 30 |
| 8 | **Punjabi Dal Makhani Rice Bowl** | ₹80 | ⭐ 4.8 (92 reviews) | 6 min | 🟢 Veg | 35 |
| 9 | **Campus Rajma Chawal Special** | ₹75 | ⭐ 4.7 (134 reviews) | 5 min | 🟢 Veg | 40 |
| 10 | **Chicken Tikka Rice Bowl** | ₹120 | ⭐ 4.9 (160 reviews) | 10 min | 🔴 Non-Veg | 25 |

### 🥟 Snacks & Quick Bites (4 Items)

| # | Item Name | Price | Rating | Prep Time | Type | Stock |
|---|---|---|---|---|---|---|
| 11 | **Crispy Samosa with Masala Chai** | ₹40 | ⭐ 4.9 (220 reviews) | 3 min | 🟢 Veg | 28 |
| 12 | **Double Egg Chicken Kathi Roll** | ₹75 | ⭐ 4.8 (155 reviews) | 7 min | 🔴 Non-Veg | 26 |
| 13 | **Butter Pav Bhaji Platter** | ₹70 | ⭐ 4.8 (188 reviews) | 6 min | 🟢 Veg | 32 |
| 14 | **Grilled Paneer Tikka Wrap** | ₹65 | ⭐ 4.7 (84 reviews) | 7 min | 🟢 Veg | 22 |

### 🍕 Fast Food & Street (4 Items)

| # | Item Name | Price | Rating | Prep Time | Type | Stock |
|---|---|---|---|---|---|---|
| 15 | **Crispy Peri-Peri French Fries** | ₹55 | ⭐ 4.7 (120 reviews) | 5 min | 🟢 Veg | 35 |
| 16 | **Classic Chicken Cheese Burger** | ₹85 | ⭐ 4.9 (175 reviews) | 8 min | 🔴 Non-Veg | 24 |
| 17 | **Veg Hakka Noodles & Manchurian** | ₹80 | ⭐ 4.8 (140 reviews) | 9 min | 🟢 Veg | 28 |
| 18 | **Steamed Chicken Momos (6 pcs)** | ₹70 | ⭐ 4.9 (195 reviews) | 6 min | 🔴 Non-Veg | 30 |

### 🥤 Beverages & Shakes (4 Items)

| # | Item Name | Price | Rating | Prep Time | Type | Stock |
|---|---|---|---|---|---|---|
| 19 | **Chilled Fresh Lime Mint Soda** | ₹30 | ⭐ 4.7 (165 reviews) | 3 min | 🟢 Veg | 55 |
| 20 | **Thick Cold Coffee with Ice Cream** | ₹65 | ⭐ 4.9 (280 reviews) | 4 min | 🟢 Veg | 38 |
| 21 | **Alphonso Mango Lassi** | ₹45 | ⭐ 4.8 (110 reviews) | 3 min | 🟢 Veg | 30 |
| 22 | **Special Masala Cutting Chai** | ₹15 | ⭐ 4.9 (320 reviews) | 2 min | 🟢 Veg | 80 |

### 🍨 Desserts & Sweets (2 Items)

| # | Item Name | Price | Rating | Prep Time | Type | Stock |
|---|---|---|---|---|---|---|
| 23 | **Hot Gulab Jamun with Rabri** | ₹45 | ⭐ 4.9 (145 reviews) | 3 min | 🟢 Veg | 25 |
| 24 | **Fudge Chocolate Brownie Sundae** | ₹65 | ⭐ 4.9 (175 reviews) | 4 min | 🟢 Veg | 20 |

> **Price Range:** ₹15 (Masala Chai) — ₹130 (Chicken Biryani)  
> **Veg Items:** 18 | **Non-Veg Items:** 6  
> **Today's Specials Tagged:** Biryani, Paneer Fried Rice, Chicken Tikka Bowl, Butter Pav Bhaji, Cold Coffee, Gulab Jamun, Chicken Burger

---

## 📦 Inventory — 10 Tracked Ingredients

| Ingredient | Category | Quantity | Unit | Min. Threshold |
|---|---|---|---|---|
| Basmati & Sona Masoori Rice | Grains | 50 | kg | 20 kg |
| Fresh Farm Chicken | Poultry | 18 | kg | 12 kg |
| Fresh Dairy Paneer | Dairy | 22 | kg | 8 kg |
| Fresh Red Tomatoes | Vegetables | 14 | kg | 10 kg |
| Refined Sunflower Cooking Oil | Oils | 16 | L | 10 L |
| Whole Wheat Atta & Maida | Grains | 35 | kg | 15 kg |
| Assam Tea Leaves & Spices Mix | Dry Goods | 8.5 | kg | 4 kg |
| Fresh Yellow Lemons & Mint | Produce | 60 | pcs | 25 pcs |
| Full Cream Dairy Milk | Dairy | 40 | L | 15 L |
| Vanilla Ice Cream Tubs | Frozen | 12 | tubs | 5 tubs |

---

## 🚀 Implemented Features

### 👨‍🎓 Student Portal (8 Tabs)

#### 🏠 Home Tab
- **Hero Banner** — Campus Dining tagline with real-time kitchen status pills (Open/Closed, queue wait time, express pickup counter)
- **Pre-Order Pickup Time Selector** — 4 slots: ⚡ ASAP, 12:30 PM, 1:00 PM, 1:30 PM
- **Live Search Bar** — Instant full-text search across all 24 menu items (name, description, ingredients)
- **Category Pills Bar** — Filter by: All Items, Today's Specials, Breakfast, Lunch & Meals, Snacks, Beverages, Fast Food, Desserts
- **Dietary Toggle** — Switch between All / 🟢 Veg Only / 🔴 Non-Veg
- **Today's Specials Carousel** — Highlighted chef-special dishes with premium card UI
- **Popular Items Grid** — Top-rated items sorted by review count
- **Quick Add to Cart** — One-tap add buttons on every food card

#### 🍽️ Menu Tab
- **Complete 24-item food grid** — Cards with image, name, badge tag, star rating, price, prep time, veg/non-veg dot, spice level, calorie count
- **Live availability indicator** — Items marked Sold Out when stock = 0
- **Favorite Heart Toggle** — Tap to add/remove from favorites (persisted to localStorage)
- **Quantity Selector** — Inline +/- controls on food cards

#### 🛒 Cart Drawer (Slide-In Side Panel)
- **Slide-in cart panel** — Accessible via top nav 🛒 button
- **Item quantity controls** — Increase / Decrease / Remove
- **Subtotal, 10% discount, and final total** calculated dynamically
- **Pickup time** reflected from pre-order selector
- **Checkout CTA** — Triggers full payment modal

#### 💳 Checkout & Payment Modal
- **Payment methods:** Campus Wallet, UPI (GPay/PhonePe/Paytm), Cash on Counter
- **Order summary** with automatic 10% discount applied
- **Wallet balance validation** — Blocks checkout if insufficient funds
- **UPI transaction ID simulation**
- **Animated order confirmation** — Token number generated (e.g., #A1042) with celebration confetti
- **Sound effects** on successful payment

#### 📜 Orders History Tab
- **Full order history** for current student
- **Status badges:** RECEIVED → PREPARING → READY → COLLECTED / CANCELLED
- **Order card details:** token #, items list, total, payment method, pickup time, timestamp
- **Reorder button** — Re-adds past order items to cart instantly
- **Rate & Review link** for completed orders

#### 🎫 Track Order Tab (Live Queue Tracker)
- **Real-time queue status** — Animated 5-stage progress stepper
- **Token number** prominently displayed (e.g., #A1042)
- **Queue position countdown** — "2 orders ahead of you"
- **Estimated wait time** — Updated dynamically
- **Stages:** RECEIVED → ACCEPTED → COOKING → READY → COLLECTED
- **Pickup ready celebration** — Full-screen success animation + ding sound
- **Active order pill** in top navbar while order is in-progress

#### 💳 Campus Wallet Tab
- **Wallet balance display** (starts at ₹450 in demo)
- **Quick top-up buttons** — ₹100, ₹250, ₹500, ₹1000
- **Custom amount top-up** — Via prompt dialog
- **Transaction history** — All wallet credits and debits listed
- **Student profile info** inline — Name, Student ID, Department, Email

#### ❤️ Favorites Tab
- **Saved favorite items grid** — Persisted in localStorage across sessions
- **Quick Add to Cart** from favorites
- **Remove from Favorites** toggle
- **Empty state** — Friendly prompt + explore menu CTA

#### ⭐ Feedback Tab
- **3-axis 5-star rating** — Separate stars for Food Quality, Service Speed, Value for Money
- **Comment text field** with character counter
- **Order token linking** — Attach review to a specific order token
- **Own submitted reviews** display
- **Community reviews list** — All student feedback visible

#### 👤 Profile Tab
- **Student profile card** — Avatar, full name, student ID, department, email, phone
- **Wallet balance** display
- **Favorites count** and **Order statistics** (total, completed, pending)

---

### 👨‍🍳 Admin & Kitchen Console (5 Tabs)

#### 📊 Dashboard KPI Bar (Always Visible)
7 real-time metric cards:
- Total Orders Today | Pending Orders | Completed Orders | Cancelled / Refunded
- Today's Revenue (₹ total) | Active Queue Count | Low Stock Ingredient Alerts

#### 📋 Live Orders Tab (Kanban Board)
- **4-column Kanban:** RECEIVED | PREPARING | READY | COLLECTED
- **Order cards:** token #, student name, items, total, payment method, elapsed time, special notes
- **One-click status advance** — Move orders forward through pipeline
- **Cancel & Refund** — Cancels order and returns funds to campus wallet
- **Veg / Non-Veg indicators** on every item line
- **Special instructions** displayed (e.g., "Pack raita separately")
- **Countdown timers** from order placement time

#### 🍽️ Menu & Stock Tab
- **On/Off availability toggle** per item — Students see items as unavailable instantly
- **Stock quantity inline editor** — Set exact remaining stock
- **Item cards** with thumbnail, current stock, price, category badge
- **Low stock visual alert** when stock < 10
- **Quick restock** button

#### 📦 Ingredients Inventory Tab
- **Table of 10 tracked ingredients** — Name, category, quantity, unit, threshold, last updated
- **Status badges** — Available (green) / Low Stock (amber) / Out of Stock (red)
- **Update Stock modal** — Set new quantity
- **Low threshold alerts** — Row highlighted with ⚠️ when below minimum

#### 📈 Sales Analytics Tab
- **Revenue summary** — Today's total, average order value, top-selling item
- **Hourly sales bar chart** — Pure CSS bars, 8 AM to 8 PM (no external chart libraries)
- **Top 5 selling items** ranked by order count with percentage bars
- **Payment method split** — Wallet vs UPI vs Cash percentages

#### ⭐ Student Reviews Tab
- **Chronological feedback feed** — All submitted reviews
- **3-metric star display** per review (Food / Service / Value)
- **Admin reply** visible per review
- **Student name + order token** on each card
- **Review timestamps**

---

### 🔔 Global Features (Both Portals)

| Feature | Description |
|---|---|
| **Role Switcher** | Top navbar toggle: Student Portal ↔ Admin & Kitchen Console |
| **Notifications Drawer** | Bell icon → slide-in panel with all alerts (read/unread status) |
| **Sound Effects (Web Audio API)** | Synthesized sounds: add-to-cart tick, checkout success chime, order-ready ding, notification pop, UI tap |
| **Sound Toggle** | 🔊/🔇 button in top nav to mute/unmute all effects |
| **Toast Notifications** | Slide-in pop-ups for: order placed, payment confirmed, wallet top-up, item added |
| **LocalStorage Persistence** | All state survives page refresh — cart, favorites, orders, wallet balance, settings |
| **Reset Demo Data** | 🔄 button resets entire platform to factory seed data |
| **Active Order Pill** | Live token # + status shown in navbar when student has an in-progress order |
| **Wallet Balance Pill** | Real-time balance in navbar with direct top-up shortcut |
| **Cart Badge Counter** | Red bubble on 🛒 icon showing total item count |
| **Notification Badge** | Red bubble on 🔔 icon showing unread count |
| **Mobile Bottom Navigation** | Fixed bottom nav bar (Home, Menu, Orders, Track, Wallet) on small screens |
| **Fully Responsive Layout** | Mobile (< 768px), Tablet, and Desktop breakpoints |
| **Black & Lavender Theme** | Deep black `#0A0A0F` bg + electric lavender `#A78BFA` / `#7C3AED` accents |
| **Glassmorphism UI** | Frosted-glass cards using `backdrop-filter: blur()` throughout the app |
| **Micro-animations** | Hover lift, button ripple, progress stepper, shimmer loading states |
| **Premium Typography** | Google Fonts: `Outfit` (display) + `Space Grotesk` (body) |
| **SEO Optimized** | Proper `<title>`, `<meta description>`, semantic HTML5, single `<h1>` per view |
| **Favicon** | 🍱 emoji SVG favicon |

---

## 🏗️ Technical Architecture

### Stack
- **HTML5** — Single-page, multi-view architecture with `style="display: none"` view toggling
- **Vanilla CSS** — Full design system via CSS custom properties (variables), no frameworks
- **Vanilla JavaScript (ES6+)** — OOP class-based modules, zero external dependencies

### JavaScript Modules

| File | Class | Responsibility |
|---|---|---|
| `data.js` | `INITIAL_DATA` (global const) | All seed data: 24 menu items, 4 orders, 10 inventory items, 3 feedback entries, 3 notifications |
| `storage.js` | `CanteenStorage` | localStorage CRUD, pub/sub event bus (`on()`/`emit()`), reactive state |
| `audio.js` | `CanteenAudio` | Web Audio API oscillator-based sound synthesis |
| `student.js` | `StudentPortal` | Renders all 8 student tabs; handles cart, checkout, queue tracking |
| `admin.js` | `AdminConsole` | Renders Kanban, menu toggle, inventory table, analytics chart, reviews |
| `app.js` | `CanteenApp` | Role switching, toast system, notifications drawer, wallet modal |

### State & Data Flow
```
Student places order:
  StudentPortal.checkout()
    → CanteenStorage.saveOrder()
    → Event emitted: "ordersUpdated"
    → AdminConsole.renderOrders()   ← Kanban auto-refreshes
    → StudentPortal.updateActiveOrderPill()
    → CanteenAudio.playOrderPlaced()
    → App.showToast("Order Placed!")

Admin marks order as READY:
  AdminConsole.updateOrderStatus("READY")
    → CanteenStorage.updateOrder()
    → Event emitted: "ordersUpdated"
    → StudentPortal tracker auto-refreshes (queue position 0)
    → CanteenAudio.playOrderReady()
    → Notification pushed to student notifications list
```

---

## 🎨 Design System — Black & Lavender Theme

| CSS Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0A0A0F` | Page background (deep black) |
| `--bg-secondary` | `#12121A` | Section backgrounds |
| `--bg-card` | `#1A1A2E` | Card surfaces |
| `--accent-primary` | `#A78BFA` | Primary lavender accent |
| `--accent-secondary` | `#7C3AED` | Deep violet buttons |
| `--accent-glow` | `rgba(167,139,250,0.2)` | Glow / shadow effects |
| `--text-primary` | `#F1F0FF` | Main text (lavender-tinted white) |
| `--text-secondary` | `#94A3B8` | Muted/secondary text |
| `--success` | `#10B981` | Available, completed states |
| `--warning` | `#F59E0B` | Low stock, pre-order alerts |
| `--error` | `#EF4444` | Error, cancelled, out of stock |
| `--border-subtle` | `rgba(167,139,250,0.15)` | Card borders |

**Typography:** `Outfit` (headers, weights 600–800) + `Space Grotesk` (body, weights 400–600)

---

## 🖥️ Running Locally

```powershell
# Option A — PowerShell
cd d:\canteen
.\serve.ps1
# → http://localhost:8080

# Option B — Double-click
start-server.bat

# Option C — Python (if installed)
python -m http.server 8080
```

*Built with ❤️ as a complete campus digital dining solution.*
