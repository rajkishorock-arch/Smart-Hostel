# Smart Hostel & Mess Administration Platform

A modern, full-stack campus residential administration platform engineered to streamline **Hostel Room Allocation**, **Weekly Mess & Dining Timetables**, **AI-Classified Maintenance Issue Resolution**, and **Warden Administration**.

---

## 🏆 Competition Criteria Alignment

| Evaluation Category | Marks | Implementation Details |
|---|---|---|
| **Authentication & Role-Based Routing** | 30 Marks | Real Firebase Authentication + Firestore authorization. Multi-role support (`resident` and `warden`). Protected route guards (`/dashboard` vs `/admin/dashboard`) with automatic role redirection and access-denied protections. |
| **Landing Page Completeness** | 30 Marks | **Public Landing Page FIRST**. Accessible without authentication. Problem-specific: Hero, How It Works, Features, About Us, Testimonials, Contact Us, and Professional Footer. Focused specifically on hostel living, dining schedules, and room inventory. |
| **Functional Dashboards** | 30 Marks | **Resident**: My Room (Hostel/Block/Room/Bed), Today's Mess, Weekly Mess Menu, Maintenance Summary, Lodge Maintenance Issue, My Tickets with status tracking.<br/>**Warden**: Metrics (Total Residents, Occupancy %, Open, In Progress, Resolved), 1. Maintenance Resolution Board, 2. Resident Management, 3. Room Allocation, 4. Weekly Mess Menu Editor. |
| **AI Integration Bonus** | +10 Marks | **Automatic Maintenance Ticket Classification Engine**: Automatically analyzes issue descriptions (e.g. *"Fan is not working and there is a burning smell"* $\rightarrow$ `Electrical` + `Urgent`), scores confidence, and categorizes into `Electrical`, `Plumbing`, `Carpentry`, or `Other`. Directly assists the maintenance workflow. |

---

## 🚀 Critical User Flow

```
Visitor Opens System
        ↓
Public Landing Page (No Auth Required)
        ↓
Explore Hostel Features & How It Works
        ↓
Login / Signup (Resident or Warden)
        ↓
Role-Based Protected Redirection:
   • Hostel Resident  → /dashboard
   • Warden Admin     → /admin/dashboard
```

---

## ⚡ Instant Evaluator Demo Credentials

Pre-configured accounts with instant one-click login buttons on `/login`:

| Role | Email | Password | Access URL | Features |
|---|---|---|---|---|
| **Hostel Resident** | `resident@hostel.edu` | `Hostel@123` | `/dashboard` | Room 204 allotment, Today's & Weekly Mess timetable, AI maintenance reporting, Live ticket tracking |
| **Warden Admin** | `warden@hostel.edu` | `Warden@123` | `/admin/dashboard` | Maintenance Resolution Board, Resident Directory, Room & Bed Allotment, Weekly Mess Editor |

*(You can also register brand-new resident or warden accounts via the Signup page!)*

---

## 🤖 AI Maintenance Classification Engine

The system features an automatic classification model in [`src/services/aiClassifier.ts`](file:///c:/Users/rajki/Desktop/Smart%20Hostel/src/services/aiClassifier.ts):

* **Electrical**: Scans for fan, spark, burning smell, socket, wiring, geyser, short circuit, flickering.
* **Plumbing**: Scans for tap, leak, commode, flush, clogged drain, washbasin, pipe burst, flooding.
* **Carpentry**: Scans for door, lock, hinge, almirah, drawer, cupboard, window latch, broken leg.
* **Urgency Evaluator**: High-risk triggers like "burning smell", "sparking", or "flooding" automatically elevate priority to **Urgent** and alert the warden desk.

### Interactive Demonstration in Lodge Modal:
Click **"Report Maintenance Issue"** on the resident dashboard. As you type (or click the test prompts), the AI updates in real-time, displays its reasoning and confidence percentage, and automatically selects the category and urgency level.

---

## 🔄 Real-Time Workflow

1. **Resident Lodges Ticket** $\rightarrow$ Saved to Firestore $\rightarrow$ Instantly appears on Warden Resolution Board.
2. **Warden Updates Status** (Open $\rightarrow$ In Progress $\rightarrow$ Resolved) + adds technician notes $\rightarrow$ Resident immediately sees the updated badge and resolution notes on their dashboard.
3. **Warden Edits Weekly Mess Menu** $\rightarrow$ Saved to Firestore $\rightarrow$ Resident immediately views the updated Breakfast, Lunch, Snacks, or Dinner menu.

---

## 🔒 Firestore Security Rules

Hardened security rules defined in [`firestore.rules`](file:///c:/Users/rajki/Desktop/Smart%20Hostel/firestore.rules):

* `users/{userId}`: Residents can only read and edit their own profile; Wardens can view all residents and update room allocations.
* `tickets/{ticketId}`: Residents can only access tickets where `residentId == request.auth.uid`. Wardens have full administrative read/update privileges to change statuses and attach notes.
* `mess_menu/{menuDoc}`: Authenticated residents can read; only authorized wardens can write or publish.
* `rooms/{roomId}`: All residents can read room availability; only wardens can write/allocate beds.

---

## 🛠️ Tech Stack

* **Framework**: React 19 + TypeScript + Vite
* **Styling**: Vanilla CSS Design System with custom color tokens, glassmorphism, responsive grid, and badges
* **Icons**: Lucide React
* **Routing**: React Router v7 with Protected Route guards
* **Database & Auth**: Firebase Auth + Cloud Firestore with reactive real-time state listeners
