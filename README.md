# EscrowFlow

![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Styling](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC)
![UI](https://img.shields.io/badge/UI-MaterialUI-007FFF)
![State](https://img.shields.io/badge/State-ReduxToolkit-purple)
![Design](https://img.shields.io/badge/Design-Figma-black)

A SaaS-based freelance platform that ensures secure payments and a structured workflow between clients and freelancers using an escrow system.

---

## Figma Prototype

View full UI flow here:

[https://www.figma.com/proto/7BwnU9bfaneGRB0np7fZWy/Abdul-Haque-s-team-library?node-id=3354-453&p=f&viewport=154%2C236%2C0.22&t=PGDWcmQ4FwmPUERs-1&scaling=contain&content-scaling=fixed&starting-point-node-id=3350%3A2&page-id=3339%3A2
](https://www.figma.com/proto/89b3fyiWNX0WV9JNnUE6K2/Untitled?node-id=1-97&p=f&viewport=263%2C169%2C0.08&t=F2mceD7l7O7sE4w4-1&scaling=contain&content-scaling=fixed&page-id=0%3A1
)
---

## Problem Analysis

Freelancing platforms suffer from multiple interconnected issues that impact trust, workflow, and delivery.

### Detailed Problem Breakdown

| Main Problem          | Root Issues             | Secondary Problems           | Impact           |
| --------------------- | ----------------------- | ---------------------------- | ---------------- |
| Payment Insecurity    | No escrow, no guarantee | Delayed payments, fraud risk | Loss of trust    |
| Lack of Transparency  | No tracking system      | Miscommunication             | Project delays   |
| Ghosting              | No accountability       | Abandoned work               | Time loss        |
| Unstructured Workflow | No defined system       | Chat-based work              | Confusion        |
| Weak Disputes         | No proof system         | No resolution                | Conflicts remain |

---

## Solution

EscrowFlow introduces a structured, system-driven workflow to solve these problems.

### Problem → Solution Mapping

| Problem              | Solution              | Implementation           |
| -------------------- | --------------------- | ------------------------ |
| Payment Insecurity   | Escrow System         | Funds locked before work |
| Lack of Transparency | Progress Tracking     | Status & deadlines       |
| Ghosting             | Accountability System | Milestone tracking       |
| Workflow Issues      | Milestone System      | Structured execution     |
| Disputes             | Evidence System       | Timeline + proof         |

---

## System Workflow

```plaintext id="7r4m2x"
Create Project → Lock Funds → Work → Submit → Approve → Release Payment
```

---

## Feature Breakdown
* Escrow-based secure payments
* Milestone-based workflow
* Project workspace
* Status tracking
* Deadline management
* Dispute-ready system

---


## Frontend Folder Structure (Detailed Explanation)

```bash id="fullstruct1"
src/
├── assets/                      # Static resources
│   ├── images/                 # Images used across UI
│   ├── icons/                  # SVG icons
│   └── fonts/                  # Custom fonts
│
├── components/                  # Reusable UI components
│   ├── common/                  # Basic reusable components
│   │   ├── Button.jsx          # Reusable button (primary/secondary)
│   │   ├── Input.jsx           # Form input field
│   │   ├── Modal.jsx           # Popup / dialog box
│   │   └── Loader.jsx          # Loading spinner
│   │
│   ├── layout/                  # Layout structure
│   │   ├── Sidebar.jsx         # Left navigation menu
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   └── Layout.jsx          # Wraps pages (sidebar + navbar)
│   │
│   └── ui/                      # UI building blocks
│       ├── Card.jsx            # Card container
│       ├── Table.jsx           # Data table layout
│       ├── Badge.jsx           # Status labels (Active, Pending, Completed)
│       ├── Tabs.jsx            # Tab navigation
│       └── ProgressBar.jsx     # Progress indicator
│
├── pages/                       # Main pages (route level)
│   ├── Login.jsx               # User login page
│   ├── Dashboard.jsx           # Overview dashboard (summary data)
│   ├── Projects.jsx            # All projects list
│   ├── CreateProject.jsx       # Project creation form
│   ├── Workspace.jsx           # Main working area (core feature)
│   ├── Payments.jsx            # Payment tracking page
│   ├── Disputes.jsx            # Dispute management page
│   └── Settings.jsx            # User settings page
│
├── routes/                      # Routing system
│   ├── AppRoutes.jsx           # All route definitions
│   ├── ProtectedRoute.jsx      # Private routes (auth required)
│   └── PublicRoute.jsx         # Public routes (login)
│
├── store/                       # Global state management (Redux)
│   ├── store.js                # Redux store setup
│   └── slices/
│       ├── authSlice.js        # Authentication state
│       ├── projectSlice.js     # Project-related state
│       └── uiSlice.js          # UI state (loading, theme, etc.)
│
├── services/                    # API layer
│   ├── axios.js                # Axios configuration
│   └── endpoints.js            # API endpoints
│
├── hooks/                       # Custom hooks
│   ├── useAuth.js              # Authentication logic
│   └── useDebounce.js          # Debounce optimization
│
├── utils/                       # Helper utilities
│   ├── helpers.js              # Common helper functions
│   ├── constants.js            # Static values/constants
│   └── storage.js              # Local storage handling
│
├── styles/                      # Global styles
│   └── globals.css             # Global CSS styles
│
├── App.jsx                      # Root component (layout + routes)
└── main.jsx                     # Application entry point
```

---

## Design System

### Colors

| Type           | Color   | Usage               |
| -------------- | ------- | ------------------- |
| Primary        | #6C5CE7 | Buttons, highlights |
| Background     | #F8F9FC | Page background     |
| Card           | #FFFFFF | Cards               |
| Text Primary   | #1A1A1A | Main text           |
| Text Secondary | #6B7280 | Sub text            |
| Success        | #22C55E | Completed status    |
| Warning        | #F59E0B | Pending status      |
| Danger         | #EF4444 | Overdue / error     |

---

### Typography

| Element    | Font  | Size    | Weight  |
| ---------- | ----- | ------- | ------- |
| Heading    | Inter | 24–28px | Bold    |
| Subheading | Inter | 18–20px | Medium  |
| Body       | Inter | 14–16px | Regular |
| Small Text | Inter | 12px    | Light   |

---

### UI Styling Rules

* Buttons: Rounded, primary gradient color
* Cards: White background, soft shadow, 12px radius
* Inputs: Light gray background, rounded edges
* Tables: Clean rows with hover effect
* Badges: Color-based status (green, orange, red)

---

## Design Principles

* Consistent spacing and alignment
* Clean and minimal UI
* Focus on readability and usability
* Clear visual hierarchy
* Responsive layout (mobile-first)



## Technical Skills Used

* React (Hooks, components)
* Redux Toolkit (State management)
* React Router (Routing)
* Axios (API handling)
* Tailwind CSS (Styling)
* Material UI (UI components)
* Responsive Design
* Modular Architecture
* System Design (Escrow logic)

---

## How to Run

```bash id="k92l1p"
git clone <repo-url>
cd EscrowFlow
npm install
npm run dev
```

Open: http://localhost:5173

---

## Architecture Highlights

* Modular component design
* Scalable structure
* Clean separation of concerns
* Maintainable codebase

---

## Frontend Folder Structure

(keep your existing structure here)

---

## Final Outcome

* Secure payments
* Structured workflow
* Reduced risk
* Better collaboration

---

## Backend Architecture (Complete Overview)

The backend follows a **scalable MVC + Service Layer architecture** designed for real-world SaaS applications.

---

## Backend Folder Structure

```bash
backend/
├── src/
│
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   ├── payment.controller.js
│   │   └── dispute.controller.js
│
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Project.model.js
│   │   ├── Milestone.model.js
│   │   ├── Payment.model.js
│   │   └── Dispute.model.js
│
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── payment.routes.js
│   │   └── dispute.routes.js
│
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── project.service.js
│   │   ├── payment.service.js
│   │   └── dispute.service.js
│
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── responseHandler.js
│   │   └── constants.js
│
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── project.validation.js
│   │   └── payment.validation.js
│
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## File Explanation (What Each File Does)

### config/

* **db.js**

  * Connects backend to MongoDB
  * Handles connection errors

* **env.js**

  * Loads environment variables
  * Stores secrets (JWT, DB URL)

---

### controllers/ (Request Handling Layer)

* **auth.controller.js**

  * Login, register, logout APIs

* **project.controller.js**

  * Create project
  * Get project list
  * Update project status

* **payment.controller.js**

  * Lock funds (escrow)
  * Release payment

* **dispute.controller.js**

  * Create and manage disputes

👉 Role: Handles request & sends response

---

### models/ (Database Layer)

* **User.model.js**

  * Stores user (client/freelancer)

* **Project.model.js**

  * Project info (title, status, deadline)

* **Milestone.model.js**

  * Tracks project steps & payments

* **Payment.model.js**

  * Stores escrow transaction data

* **Dispute.model.js**

  * Stores conflict details and proof

👉 Role: Defines database structure

---

### routes/ (API Layer)

* **auth.routes.js**

  * /login, /register

* **project.routes.js**

  * /projects APIs

* **payment.routes.js**

  * Payment APIs

* **dispute.routes.js**

  * Dispute APIs

👉 Role: Connect URL → controller

---

### middlewares/ (Security & Control)

* **auth.middleware.js**

  * JWT authentication
  * Protects private routes

* **error.middleware.js**

  * Global error handling

* **validate.middleware.js**

  * Validates request data

👉 Role: Filters request before controller

---

### services/ (Business Logic Layer)

* **auth.service.js**

  * Token generation
  * Password validation

* **project.service.js**

  * Project creation logic
  * Milestone handling

* **payment.service.js**

  * Escrow logic (lock/release funds)

* **dispute.service.js**

  * Dispute resolution logic

👉 Role: Core logic (important layer)

---

### utils/ (Helper Functions)

* **generateToken.js**

  * Creates JWT token

* **responseHandler.js**

  * Standard API responses

* **constants.js**

  * Status values, roles, enums

---

### validations/

* **auth.validation.js**

  * Login/register validation

* **project.validation.js**

  * Project form validation

* **payment.validation.js**

  * Payment validation

👉 Role: Prevent invalid data

---

### Root Files

* **app.js**

  * Setup express app
  * Middleware + routes

* **server.js**

  * Start server
  * Connect database

---

## Backend Flow

```plaintext
Request → Route → Controller → Service → Model → Database → Response
```

---

## Features Implemented in Backend

### Core Features

* User authentication (JWT based)
* Project creation & management
* Milestone-based workflow
* Escrow payment system
* Dispute handling system

---

### Advanced Features

* Secure API with middleware
* Structured error handling
* Input validation system
* Scalable architecture design

---

### Optional Integrations (Future Ready)

* Cloudinary (file uploads)
* Google OAuth (login)
* Firebase (notifications)
* Email system (alerts)
* AI integration (OpenAI)

---

## Why This Backend is Strong

* Follows industry-standard architecture
* Clean separation of concerns
* Easy to scale and maintain
* Supports real-world SaaS features
* Ready for production-level upgrades


## Summary

EscrowFlow converts freelancing into a structured and secure system with escrow-based payments.
