# Burari Ekta Society RWA — Official Website

**Burari Ekta Society Resident Welfare Association**  
C-6, Plot No. 07, Kh. No. 723, 2nd Floor, Extended Lal Dora, Gali No. 02,  
Sant Nagar, Burari, Delhi – 110084  
📧 burariektasocietyrwa@gmail.com

---

## Project Overview

A complete, production-ready website for Burari Ekta Society RWA built with:

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Firebase Authentication + Firestore + Storage + Hosting
- **Features:** Public website, Admin dashboard, Notices, Events, Documents, Gallery, Complaints, Location map

---

## Quick Start (Demo Mode)

Run without Firebase — uses sample data only.

```bash
git clone <your-repo>
cd burari-ekta-society-rwa
npm install
npm run dev
```

Open http://localhost:5173

> Demo mode is active when `VITE_APP_MODE=demo` or Firebase credentials are not configured.
> A banner will clearly indicate demo mode.

**Demo admin login:** `demo@admin.com` / `demo1234`

---

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase project values (from Firebase Console → Project Settings → Web App):
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_APP_MODE=live
   ```

3. Restart the dev server.

---

## Firebase Setup (Step-by-Step)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → name it (e.g. `burari-ekta-rwa`)
3. Enable Google Analytics (optional)

### 2. Enable Authentication

1. Firebase Console → **Authentication** → **Get started**
2. Enable **Email/Password** sign-in method
3. Add authorized domains (your hosting domain)

### 3. Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode** (we apply rules next)
3. Pick a region (e.g. `asia-south1` for India)

### 4. Enable Storage

1. Firebase Console → **Storage** → **Get started**
2. Choose Production mode

### 5. Deploy Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase init  # select Hosting, Firestore, Storage — use existing project
firebase deploy --only firestore:rules,storage
```

### 6. Create First Admin User

**IMPORTANT:** Never create admins through the public website.
Use the Firebase Admin SDK or Firebase Console:

**Option A — Firebase Console:**
1. Authentication → Add user → enter admin email and password
2. Firestore → `users` collection → Add document:
   - Document ID = the user's UID (from Authentication)
   - Fields:
     ```
     email: "admin@yourdomain.com"
     displayName: "RWA Admin"
     role: "superAdmin"
     isActive: true
     createdAt: (timestamp)
     updatedAt: (timestamp)
     ```

**Option B — Admin SDK Script** (safer, run once):
```js
// scripts/createAdmin.js — run with Node.js on a trusted server
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // NEVER commit this file

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function createAdmin() {
  const userRecord = await admin.auth().createUser({
    email: 'your-admin@email.com',
    password: 'a-strong-password',
    displayName: 'RWA Super Admin',
  });

  await admin.firestore().collection('users').doc(userRecord.uid).set({
    email: userRecord.email,
    displayName: userRecord.displayName,
    role: 'superAdmin',
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log('Admin created:', userRecord.uid);
  process.exit(0);
}

createAdmin();
```

> ⚠️ `serviceAccountKey.json` must NEVER be committed to Git. It is in `.gitignore`.

### 7. Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

---

## GitHub + Firebase Deployment Workflow

**GitHub** hosts your source code.  
**Firebase** hosts the live website, database, authentication, and file storage.

These are separate services. You push code to GitHub; Firebase hosts the built `dist/` folder.

### Recommended Workflow

1. Develop locally with `npm run dev`
2. Test the production build: `npm run build && npm run preview`
3. Push to GitHub: `git push origin main`
4. Deploy to Firebase: `firebase deploy`

### Optional: GitHub Actions CI/CD

Add `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_APP_MODE: live
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: your-project-id
```

Store Firebase credentials as GitHub Secrets (never in code).

---

## Project Structure

```
burari-ekta-society-rwa/
├── src/
│   ├── components/
│   │   ├── layout/      # Navbar, Footer, PublicLayout, AdminLayout
│   │   ├── ui/          # Button, Card, Badge, Modal, Input, DemoBanner
│   │   ├── public/      # Reusable public components
│   │   └── admin/       # ProtectedRoute, admin components
│   ├── context/
│   │   └── AuthContext.tsx   # Firebase auth + demo mode
│   ├── data/
│   │   └── demoData.ts       # Sample data for demo mode
│   ├── lib/
│   │   └── firebase.ts       # Firebase initialization
│   ├── pages/
│   │   ├── public/      # All public pages
│   │   └── admin/       # Admin dashboard pages
│   ├── types/
│   │   └── index.ts     # TypeScript types
│   ├── utils/
│   │   └── helpers.ts   # Utility functions
│   ├── App.tsx          # Router
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind + global styles
├── public/
│   └── favicon.svg
├── firestore.rules      # Firestore security rules
├── firestore.indexes.json
├── storage.rules        # Storage security rules
├── firebase.json        # Firebase hosting config
├── .env.example         # Environment variable template
├── .gitignore
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Firestore Database Schema

| Collection        | Description                                    | Public Read      |
|-------------------|------------------------------------------------|------------------|
| `siteSettings`    | Society name, address, phones, map location    | ✅ Always         |
| `notices`         | RWA notices and announcements                  | ✅ Published only |
| `events`          | Society events and activities                  | ✅ Published only |
| `documents`       | Approved downloadable documents                | ✅ Public + published |
| `gallery`         | Approved society photographs                   | ✅ Published only |
| `pages`           | Editable page content (About, etc.)            | ✅ Published only |
| `committeeMembers`| Office bearers                                 | ✅ Active only     |
| `complaints`      | Resident complaints (SENSITIVE)                | ❌ Admin only      |
| `contactMessages` | Contact form submissions                       | ❌ Admin only      |
| `users`           | User profiles and roles                        | ❌ Own + Admin     |
| `auditLogs`       | Admin action audit trail                       | ❌ Super admin     |

---

## Security Notes

- Firestore and Storage rules are enforced server-side — clients cannot bypass them.
- User roles are stored in Firestore and validated by rules on every request.
- No user can change their own role.
- Complaint data is never publicly readable.
- All admin routes are protected by `ProtectedRoute` on the frontend AND by Firestore rules on the backend.
- Secrets are kept in `.env` (not committed to Git).
- The demo mode clearly labels all sample data and does not simulate real authentication.

---

## Content Migration Checklist

| Section                    | Source Status         | Migrated  |
|----------------------------|-----------------------|-----------|
| Society name               | ✅ Confirmed          | ✅        |
| Address                    | ✅ Confirmed          | ✅        |
| Phone numbers (4)          | ✅ Confirmed          | ✅        |
| Email                      | ✅ Confirmed          | ✅        |
| President (D.S. Chauhan)   | ✅ Confirmed          | ✅        |
| Secretary (Yashwant Singh) | ✅ Confirmed          | ✅        |
| Treasurer (Bala Dutt)      | ✅ Confirmed          | ✅        |
| Welcome message / About    | ✅ Confirmed          | ✅        |
| President's message        | ✅ Confirmed          | ✅        |
| Society purpose            | ✅ Confirmed          | ✅        |
| Map / Location             | ✅ Confirmed          | ✅        |
| Society photographs        | ⚠️ Not accessible     | Placeholder gallery ready |
| Registration number        | ❌ Not on source site  | Admin to add |
| Society rules / bylaws     | ❌ Not on source site  | Admin to upload |
| Meeting minutes            | ❌ Not on source site  | Admin to upload |

**Missing information to be filled by administrator:**
- Society registration number (if applicable)
- Official bylaws document (upload via admin dashboard)
- Committee members' photos (optional, upload via admin dashboard)
- Historical event photographs (upload via gallery)
- Approved contact details for committee members (configured in admin dashboard)

---

## Available Scripts

| Command             | Description                        |
|---------------------|------------------------------------|
| `npm run dev`       | Start development server           |
| `npm run build`     | Production build                   |
| `npm run preview`   | Preview production build locally   |
| `npm run lint`      | Run ESLint                         |
| `npm test`          | Run tests (vitest)                 |

---

## Outstanding Configuration Tasks

1. **Firebase project** — Create and configure (see Firebase Setup above)
2. **First admin user** — Provision through Firebase Console or Admin SDK script
3. **Custom domain** — Configure in Firebase Hosting if desired
4. **Google Maps API key** — Add to `.env` for enhanced map features
5. **Society logo** — Upload through admin dashboard → Settings
6. **Society bylaws** — Upload through admin dashboard → Documents
7. **Committee photos** — Upload through admin dashboard → Committee
8. **Real content** — Replace sample notices/events with actual content
9. **GitHub repository** — Create and push code
10. **CI/CD** — Configure GitHub Actions if automated deployment is desired
