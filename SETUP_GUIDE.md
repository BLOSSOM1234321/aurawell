# AuraWell - Complete Setup Guide

## Overview

Your AuraWell project now has TWO parts:
1. **Frontend** (React + Capacitor) - Mobile app for iOS & Android
2. **Backend** (Node.js + Express + PostgreSQL) - Custom API server

## Architecture

```
┌─────────────────┐          ┌──────────────────┐
│   iOS App       │          │                  │
│  (iPhone/iPad)  │─────────▶│                  │
└─────────────────┘          │                  │
                              │  Backend API     │
┌─────────────────┐          │  (Port 3001)     │
│  Android App    │─────────▶│                  │
│   (Phone)       │          │  PostgreSQL DB   │
└─────────────────┘          │                  │
                              └──────────────────┘
                              Hosted on LiquidWeb
```

## Part 1: Backend Setup (Do This First!)

### Step 1: Install PostgreSQL

**Windows:**
Download from https://www.postgresql.org/download/windows/
- During installation, set password for 'postgres' user
- Remember this password!

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Step 2: Create Database

Open terminal/command prompt:

```bash
# Windows: Search for "SQL Shell (psql)" in Start Menu
# Mac: Run this in terminal

psql -U postgres

# Inside psql, run:
CREATE DATABASE aurawell_db;
\q
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Configure .env File

The `.env` file is already created. Edit it if needed:

```bash
# Open backend/.env and update if necessary:
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
```

### Step 5: Run Database Migration

```bash
npm run migrate
```

You should see: ✅ Schema created successfully

### Step 6: Seed Database with Sample Data

```bash
npm run seed
```

This creates:
- 6 support groups (Anxiety, Depression, Trauma, PTSD, Grief, Self-Care)
- 3 test users:
  - user@test.com / password123
  - therapist@test.com / password123
  - admin@test.com / password123

### Step 7: Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 AuraWell API Server Running
📍 Port: 3001
💚 Health Check: http://localhost:3001/health
```

**Leave this running!** Open a new terminal for the next steps.

## Part 2: Frontend Setup

### Step 8: Update Frontend to Use Custom Backend

Create a new file: `src/config/api.js`

```javascript
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.yourdomain.com'  // Your LiquidWeb URL (later)
  : 'http://localhost:3001';      // Local backend

export const api = {
  baseURL: `${API_URL}/api`,

  // Helper to make authenticated requests
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  },

  // Auth
  signup: (userData) => api.request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => api.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getMe: () => api.request('/auth/me'),

  // Support Groups
  getSupportGroups: () => api.request('/support-groups'),

  // Support Rooms
  joinRoom: (data) => api.request('/support-rooms/join', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMyRooms: () => api.request('/support-rooms/my-rooms'),

  // More endpoints as needed...
};

export default api;
```

### Step 9: Test Locally

#### Test Backend (in browser or Postman):
```
http://localhost:3001/health
```

Should return: `{"success":true,"message":"AuraWell API is running"}`

#### Test Frontend:
```bash
npm run dev
```

Visit: http://localhost:5173

## Part 3: iOS Testing (on Mac)

### Step 10: Update iOS to Connect to Local Backend

For iOS simulator to connect to your Windows backend:

1. Find your Windows IP address:
   ```bash
   # Windows:
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. Update `src/config/api.js`:
   ```javascript
   const API_URL = 'http://192.168.1.100:3001'; // Your Windows IP
   ```

3. Rebuild and sync:
   ```bash
   npm run build
   npx cap sync ios
   npx cap open ios
   ```

## Part 4: Development Workflow

### Daily Development (Windows)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd ..
npm run dev
```

Now you can code on Windows and see changes instantly!

### Testing on iOS (Mac)

```bash
# After making changes on Windows:
git add .
git commit -m "Your changes"
git push

# On Mac:
git pull
npm run build
npx cap sync ios
npx cap open ios
```

## Part 5: Deploy to Production (LiquidWeb)

### When Ready to Deploy:

1. **Push backend code to GitHub:**
   ```bash
   git add backend/
   git commit -m "Add custom backend"
   git push
   ```

2. **SSH into LiquidWeb server:**
   ```bash
   ssh your-user@your-server.com
   ```

3. **Follow deployment steps in `backend/README.md`**

4. **Update frontend API URL:**
   ```javascript
   // src/config/api.js
   const API_URL = 'https://api.yourdomain.com';
   ```

5. **Rebuild apps and publish to App Stores**

## Common Issues

### "Database connection error"
- Check PostgreSQL is running
- Verify password in `.env` matches your postgres password

### "Port 3001 already in use"
- Kill the process: `npx kill-port 3001`
- Or change PORT in `.env`

### iOS can't connect to backend
- Use your Windows IP address (not localhost)
- Make sure firewall allows port 3001

### Support groups don't sync
- Backend must be running
- Check API URL in frontend config
- Verify token is being sent with requests

## Next Steps

1. ✅ Backend is complete and running
2. ⏳ Update frontend to use custom API (replace Base44 SDK calls)
3. ⏳ Test all features work with new backend
4. ⏳ Deploy to LiquidWeb
5. ⏳ Publish to App Stores

## Quick Reference

**Backend:** http://localhost:3001
**Frontend:** http://localhost:5173
**Database:** PostgreSQL on port 5432

**Test User:** user@test.com / password123

## Questions?

Check the full documentation in `backend/README.md` for API endpoints and deployment details!
