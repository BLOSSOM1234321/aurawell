# 🚀 AuraWell Quick Start Guide

## ONE COMMAND TO START EVERYTHING

Just run this from the root folder:

```bash
npm start
```

That's it! This will start:
- ✅ Backend API (http://localhost:3001)
- ✅ Frontend (http://localhost:5173)

Both will run in the same terminal with colored output:
- 🔵 Blue = Backend logs
- 🟢 Green = Frontend logs

## Alternative Commands

If you want to run them separately:

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

**Both together (same as npm start):**
```bash
npm run dev:all
```

## First Time Setup

If this is your first time:

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   cd backend
   npm install
   cd ..
   ```

2. **Setup database:**
   ```bash
   cd backend
   npm run setup
   cd ..
   ```

3. **Start everything:**
   ```bash
   npm start
   ```

## Test the App

1. Visit: http://localhost:5173
2. Click "Use test account"
3. Login with:
   - Email: `user@test.com`
   - Password: `password123`
4. Check support groups - you should see 6 groups from the database!

## Stopping the Servers

Press `Ctrl+C` once - it will stop both frontend and backend together!

## Troubleshooting

**"Port already in use":**
```bash
# Kill port 3001 (backend)
npx kill-port 3001

# Kill port 5173 (frontend)
npx kill-port 5173

# Then try again
npm start
```

**"Database error":**
```bash
# Make sure PostgreSQL is running
# Then reset the database
cd backend
npm run setup
cd ..
npm start
```

**"npm command not found":**
- Make sure Node.js is installed
- Restart your terminal

## What's Running?

When you run `npm start`, you'll see:

```
[backend] 🚀 AuraWell API Server Running
[backend] 📍 Port: 3001
[backend] 💚 Health Check: http://localhost:3001/health
[frontend]
[frontend]   VITE v6.1.0  ready in 500 ms
[frontend]   ➜  Local:   http://localhost:5173/
```

Both are ready when you see this!

## Next Steps

- 📱 Test on iOS (see SETUP_GUIDE.md)
- 🌍 Deploy to production (see backend/README.md)
- 🚀 Add more features

---

**That's it! Just `npm start` and you're good to go!** 🎉
