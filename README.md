<div align="center">

# 🚀 JobPilot

### Your personal command center for the job hunt.

Track applications, manage recruiter conversations, plan your day, and never miss a follow-up — all in one fast, private, installable web app.

[![Live Demo](https://img.shields.io/badge/Live_Demo-sarf--jobpilot.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://sarf-jobpilot.vercel.app/)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952b3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Storage](https://img.shields.io/badge/Data-100%25_Local-059669?style=for-the-badge)

**[🌐 Open the Live App](https://sarf-jobpilot.vercel.app/)** · **[📖 Read the Technical Docs](./PROJECT_DOCS.md)**

</div>

---

## 📌 Overview

**JobPilot** is a frontend-only job search tracker built with React. A job hunt means juggling dozens of applications, recruiters, deadlines and follow-ups, and JobPilot gives you one clean dashboard for all of it.

There is **no backend, no account and no sign-up**. Everything is stored in your browser's `localStorage`, so the app is instant, works with zero setup, and your data stays on your device.

What makes it more than a spreadsheet:

- ⏰ **Built-in follow-up engines** automatically move stale applications to *Follow-up* and then *No Response*, and flag contacts who haven't replied.
- 📊 **History-aware analytics** count an interview even if the application was later rejected.
- 🔥 **Daily streaks, tasks and logs** keep you consistent.
- 📱 **Installable as a PWA** on desktop and mobile.

---

## ✨ Key Features

### 📊 Dashboard
- At-a-glance cards: **Total Apps, Interviews, Offers, Rejections, Contacts**
- Stats are calculated from each application's **status history**, not just its current status
- **Application Pipeline** bar chart (Recharts)
- Recent applications, recent networking activity, and a **Career Snapshot** with your profile links
- 🔥 **Day Streak** badge for consecutive days of activity
- Today's pending tasks and daily log preview

### 💼 Applications
- Add, edit, view and delete applications with company, role, location, employment type, work mode, source, salary, recruiter, job URL and notes
- Search by company or title, and filter by status or source
- Full **status timeline** for every application
- ⚡ **Auto follow-ups**: a 5-day follow-up date is set automatically, and stale applications are moved to **Follow-up**, then **No Response**
- 8 pipeline statuses: Applied · Assessment · Interview · Follow-up · Selected · Rejected · No Response · Withdrawn

### 🤝 Contacts (People & Networking)
- Track recruiters, HR, employees, developers and alumni
- Log a **conversation history** for every contact
- Track response status and referral status
- Link contacts to applications at the same company
- ⚡ **Auto follow-ups**: a 3-day follow-up date is set automatically, and contacts who haven't replied are marked **No Response**

### ✅ Daily Activity
- Date-based task manager with priorities and categories
- A **Daily Log** with four prompts: accomplished, problems, tomorrow, other notes
- A **Pending Follow-ups** panel that collects every due application and contact
- Configurable daily goals (for example, "Apply to 10 companies", "Contact 5 recruiters")
- Optional motivational quote cards

### ⚙️ Settings
- **Profile** with photo upload (stored locally)
- **Preferences**: light/dark theme, daily goals, feature toggles
- **Category manager** for application sources, contact types and task categories. Renaming or deleting a category updates all existing records.
- **Data & Export**:
  - 📦 JSON backup and restore
  - 📄 CSV export of applications
  - 🧠 **AI Career Brief**: a Markdown summary of your search that you can paste into ChatGPT or Claude for coaching
- 🗑️ Danger Zone to clear all data

### 🧭 Everywhere
- Live clock, quick-add menu and a notifications bell in the top bar
- Fully responsive with a collapsible mobile sidebar
- Light and dark themes

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Create React App / `react-scripts` 5) |
| **Routing** | React Router 7 |
| **State** | React Context API (`DataContext`, `ToastContext`) |
| **UI & Styling** | Bootstrap 5 + custom CSS variables |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Persistence** | Browser `localStorage` |
| **Hosting** | Vercel |

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or later (recommended)
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mohamedsarfaras/JobPilot.git

# 2. Move into the project
cd JobPilot

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The app opens at **http://localhost:3000**.

### Available Scripts

| Command | What it does |
|---|---|
| `npm start` | Runs the app in development mode with hot reload |
| `npm run build` | Creates an optimized production build in `/build` |
| `npm test` | Runs the test runner |

---

## 🗂️ Project Structure

```
JobPilot/
├── public/
│   ├── index.html            # HTML shell + PWA meta tags
│   ├── site.webmanifest      # PWA manifest
│   ├── vercel.json           # SPA rewrite rule for Vercel
│   └── *.png / favicon.ico   # App icons
└── src/
    ├── App.js                # Providers + routes + theme loader
    ├── index.js              # Entry point
    ├── context/              # DataContext (state + engines), ToastContext
    ├── pages/                # Dashboard, Applications, People, DailyActivity, Settings
    ├── components/           # layout/, applications/, contacts/, tasks/, ui/
    ├── data/                 # constants, defaults, quotes
    ├── utils/                # storage, dates, ids, stats
    └── styles/               # variables, global, overrides
```

For a file-by-file breakdown, see **[PROJECT_DOCS.md](./PROJECT_DOCS.md)**.

---

## ▲ Deploying to Vercel

JobPilot is a static single-page app, so it deploys to Vercel's free tier in a couple of minutes.

1. **Push** your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New → Project** and import your repository.
4. Vercel detects **Create React App** automatically:
   - **Build command:** `npm run build`
   - **Output directory:** `build`
5. Click **Deploy**. 🎉

### 🔀 Why `vercel.json` matters

JobPilot uses client-side routing (`/applications`, `/people`, `/daily-activity`, `/settings`). Without a rewrite rule, refreshing the page on one of those URLs, or opening a direct link to it, returns a 404, because those paths don't exist as real files on the server.

The project includes a `vercel.json` with a catch-all rewrite that sends every path to `index.html` so React Router can take over:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> 💡 The file currently lives in `public/`. If refreshing a deep link such as `/applications` gives you a 404 on your own deployment, move `vercel.json` to the **project root** (next to `package.json`).

---

## 📲 Install as an App (PWA)

JobPilot ships with a web app manifest and icons, so you can install it like a native app:

| Platform | How to install |
|---|---|
| **Chrome / Edge (desktop)** | Click the **install icon** in the address bar, or open the browser menu and choose **Install JobPilot** |
| **Android (Chrome)** | Menu (⋮) → **Install app** or **Add to Home screen** |
| **iPhone / iPad (Safari)** | Tap **Share** → **Add to Home Screen** |

Once installed, JobPilot opens in its own window with no browser chrome.

> ℹ️ JobPilot does not register a service worker, so it needs to be loaded online at least once per session; offline mode is not currently supported.

---

## 🔒 Privacy

**Your data never leaves your device.**

- All applications, contacts, tasks, notes, profile details and your profile photo are stored in your browser's **`localStorage`**.
- There is **no server, no database, no account and no analytics**.
- Nothing is uploaded anywhere. Clearing your browser data, or using a different browser or device, means starting fresh.
- The only external requests are the background images for the optional motivational quote cards (loaded from Unsplash). You can turn them off in **Settings → Preferences**.

⚠️ Because data lives in the browser, **back up regularly**: go to **Settings → Data & Export → JSON Backup**. You can restore a backup or move to a new device with **Import**.

---

## 🛣️ Ideas for the Future

- Optional cloud sync
- Email and calendar reminders
- Kanban board view for the pipeline
- Offline support with a service worker

---

<div align="center">

Built with ☕ and React by **[Mohamed Sarfaras](https://github.com/mohamedsarfaras)**

⭐ If JobPilot helps your job search, consider starring the repo!

</div>
