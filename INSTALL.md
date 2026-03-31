# MAllPrint - CRM Installation Guide

## System Requirements

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (bundled with Node.js)
- OS: Windows, macOS, or Linux

---

## Installation Steps

### 1. Extract the project

Extract the zip file to your desired location, for example:
```
C:\Projects\mallprint-crm\
```

### 2. Install dependencies

Open a terminal, navigate to the project folder, and run:

```bash
cd mallprint-crm
npm install
```

This installs dependencies for both the web app and the server.

### 3. Start the application

```bash
npm run dev:web
```

The app will start on **http://localhost:3000**

---

## Login

Once the app is running, open your browser and go to:

```
http://localhost:3000
```

Use the demo credentials to log in:

| Field    | Value               |
|----------|---------------------|
| Email    | admin@company.com   |
| Password | admin1234           |

---

## Available Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev:web` | Start the web app only (port 3000)   |
| `npm run dev`     | Start both web app + Express server  |

---

## Project Structure

```
mallprint-crm/
├── apps/
│   ├── web/                  # Next.js frontend (port 3000)
│   │   ├── app/              # Pages (App Router)
│   │   ├── components/       # UI components & modals
│   │   └── lib/mock-data/    # All mock data (no real database)
│   └── server/               # Express.js server (port 3001)
└── package.json              # Root workspace config
```

---

## Notes

- **Phase 1** — Frontend only with mock data. No real database or external API connections.
- All data is stored in memory and resets on page refresh.
- Designed for demonstration and client feedback purposes.

---

## Troubleshooting

**Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS / Linux
lsof -ti:3000 | xargs kill
```

**Dependencies not installing:**
Make sure you are using Node.js v18+:
```bash
node --version
npm --version
```
