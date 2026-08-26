# EverKeep

**Keep What Matters. Never Lose It Again.**

EverKeep is an AI-powered Personal Asset Lifecycle Management Platform that helps individuals and families organize, track, and manage their important assets and everything associated with them — from purchase invoices and warranties to insurance policies, subscriptions, renewals, documents, and service history.

---

## Overview

Managing important personal records across emails, folders, cloud storage, spreadsheets, and paper documents quickly becomes difficult. EverKeep provides a centralized system where users can:

- Manage personal assets
- Store and organize important documents
- Track warranties and insurance policies
- Monitor subscriptions and renewals
- Maintain service and purchase history
- Receive smart reminders
- Get AI-powered insights
- Manage family access
- Monitor overall asset health

The goal is simple: **turn scattered personal records into one organized, intelligent asset system.**

---

## Key Features

### Asset Management
Create and manage a complete lifecycle record for every important asset — electronics, vehicles, home appliances, furniture, personal equipment, and other valuables. Each asset can be linked to its documents, purchase information, warranty, insurance, and service history.

### Document Vault
Keep important documents organized in one place, including invoices, receipts, warranty documents, insurance policies, identity documents, certificates, and service records. Documents are associated with relevant assets wherever applicable.

### Smart Renewals & Reminders
Stay ahead of important dates — warranty expiry, insurance renewal, subscription renewal, service schedules, and document expiry — with a clear view of upcoming renewals and timely notifications.

### AI Insights
AI capabilities help surface missing documents, upcoming renewal pressure, overall asset health, potential duplicate subscriptions, and practical recommendations based on stored data.

### Family Sharing
Manage household assets together, with planned support for family members, shared assets and documents, role-based access, and a household asset timeline.

### Dashboard
A personal command center providing an overview of total assets, documents, upcoming renewals, asset health score, recent activity, AI insights, quick actions, asset categories, and renewal trends.

---

## Design Philosophy

EverKeep follows a modern SaaS product design approach, prioritizing:

- Clean, minimal interface with a light visual theme
- Strong typography hierarchy and consistent spacing
- Responsive layouts across devices
- Subtle shadows, soft borders, and rounded components
- Minimal animation and clear visual hierarchy

The UI is designed to feel like a premium productivity platform rather than a traditional CRUD application.

---

## Tech Stack

**Frontend:** React.js, Vite, JavaScript (ES6+), Tailwind CSS, Framer Motion, Lucide React, React Router, Axios, Zustand

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, REST APIs

**Services:** MongoDB Atlas, Cloudinary, Email service, AI services

**Development Tools:** Git, GitHub, VS Code, Postman, npm

---

## Authentication

EverKeep uses token-based authentication:

```
User → Register / Login → Backend Authentication → JWT Token → Authenticated Client → Protected Routes → Dashboard
```

Protected application areas require a valid authentication session.

---

## Application Flow

```
Landing Page
  ├── Login → Authentication → Dashboard
  └── Get Started → Register → Authentication → Dashboard
```

Within the dashboard, users can navigate to Assets, Documents, Renewals, Calendar, AI Insights, Analytics, Family, Notifications, and Settings.

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/EverKeep.git
cd EverKeep
```

### 2. Install frontend dependencies
```bash
cd client
npm install
```

### 3. Install backend dependencies
```bash
cd server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Never commit `.env` files to GitHub. Ensure `.gitignore` includes:

```gitignore
.env
.env.local
node_modules/
dist/
```

---

## Running the Application

**Backend**
```bash
cd server
npm run dev
```
Runs on `http://localhost:5000`

**Frontend** (in a separate terminal)
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173`

---

## API Architecture

The frontend communicates with the backend through REST APIs:

```
React Client → (HTTP / Axios) → Express API
                                    ├── Authentication
                                    ├── Assets
                                    ├── Documents
                                    ├── Renewals
                                    ├── Notifications
                                    └── Users
                                          ↓
                                      MongoDB
```

---

## Database

EverKeep uses MongoDB Atlas for cloud database management. Core collections include:

```
users, assets, documents, notifications, renewals, subscriptions, familyMembers
```

The exact collection structure may evolve as the application grows.

---

## Development Workflow

```
Create Feature → Frontend Component → Service / API Layer → Backend Route
  → Controller → Database Model → Test with Postman → Integrate Frontend
```

---

## API Testing

Backend APIs are tested using Postman, grouped by resource:

```
/auth  /users  /assets  /documents  /renewals  /notifications  /family  /ai
```

---

## Deployment

- **Frontend:** Vercel or Netlify
- **Backend:** Render, Railway, or AWS
- **Database:** MongoDB Atlas

---

## Security Considerations

EverKeep handles potentially sensitive personal information, so security is a core requirement:

- JWT-based authentication and protected API routes
- Password hashing
- Environment-based secrets management
- Secure document storage
- Role-based authorization
- Input validation and API error handling
- CORS configuration
- Secure production deployment practices

Secrets must never be committed to the repository.

---

## Responsive Design

EverKeep is designed to work across desktop, laptop, tablet, and mobile, with responsive layouts and dedicated mobile navigation behavior.

---

## Product Vision

EverKeep aims to become a personal asset operating system — replacing disconnected folders, spreadsheets, emails, calendars, receipts, insurance portals, and warranty cards with one intelligent workspace covering the complete asset lifecycle.

---

## Roadmap

**Phase 1 — Foundation**
- [x] Landing page
- [x] Frontend architecture
- [x] Dashboard architecture
- [x] Responsive UI
- [ ] Authentication
- [ ] Backend API integration

**Phase 2 — Core Platform**
- [ ] Asset CRUD
- [ ] Document management
- [ ] File uploads
- [ ] Renewal tracking
- [ ] Notifications
- [ ] Search

**Phase 3 — Intelligence**
- [ ] AI document analysis
- [ ] Asset health scoring
- [ ] Renewal prediction
- [ ] Smart recommendations
- [ ] Automated document insights

**Phase 4 — Collaboration**
- [ ] Family workspaces
- [ ] Shared assets
- [ ] Role-based access
- [ ] Activity timeline

**Phase 5 — Production**
- [ ] Production deployment
- [ ] Monitoring
- [ ] Error tracking
- [ ] Performance optimization
- [ ] Security hardening

---

## Contributing

Contributions, suggestions, and improvements are welcome.

```bash
git checkout -b feature/your-feature
# make your changes and test them
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

Then open a Pull Request.

---

## License

This project is currently intended as a personal/academic product project. License details will be added on official release.

---

## Author

**Krish Sendhav**
B.Tech — Computer Science & Engineering

---

**EverKeep** — Keep What Matters. Never Lose It Again.
A smarter way to manage the things, documents, and decisions that matter.