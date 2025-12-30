# AuraWell Backend API

Custom Node.js + Express + PostgreSQL backend for AuraWell mental health app.

## Features

- ✅ Full authentication system (JWT + bcrypt)
- ✅ PostgreSQL database with proper relationships
- ✅ Support groups and rooms with atomic joins
- ✅ Mood tracking & journaling
- ✅ Real-time chat messages
- ✅ Meditations & reels
- ✅ Role-based authorization
- ✅ Rate limiting & security headers
- ✅ Production-ready error handling

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher)
3. **npm** or **yarn**

## Quick Start

### 1. Install PostgreSQL

#### Windows:
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey:
choco install postgresql
```

#### Mac:
```bash
brew install postgresql@15
brew services start postgresql@15
```

### 2. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE aurawell_db;

# Exit
\q
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
```

Edit `.env`:
```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=aurawell_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD

JWT_SECRET=change_this_to_a_random_secret_key_12345
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173,capacitor://localhost,http://localhost
```

### 5. Run Migrations

```bash
npm run migrate
```

### 6. Seed Database (Optional)

```bash
npm run seed
```

This creates:
- 6 support groups
- 3 test users (password: `password123`)
  - user@test.com (regular user)
  - therapist@test.com (therapist)
  - admin@test.com (admin)
- Sample meditations
- Sample achievements

### 7. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs at: **http://localhost:3001**

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout

### Support Groups
- `GET /api/support-groups` - Get all groups
- `GET /api/support-groups/:id` - Get single group
- `GET /api/support-groups/:id/stats` - Get group stats

### Support Rooms
- `POST /api/support-rooms/join` - Join a room (atomic)
- `POST /api/support-rooms/:roomId/leave` - Leave room
- `GET /api/support-rooms/my-rooms` - Get user's rooms
- `GET /api/support-rooms/:roomId/members` - Get room members

### Messages
- `GET /api/messages/:roomId` - Get room messages
- `POST /api/messages` - Send message

### Mood Tracking
- `GET /api/moods` - Get mood entries
- `POST /api/moods` - Create mood entry

### Journals
- `GET /api/journals` - Get journal entries
- `POST /api/journals` - Create journal entry

### Meditations
- `GET /api/meditations` - Get meditations
- `GET /api/meditations?category=sleep` - Filter by category

### Reels
- `GET /api/reels` - Get all reels
- `POST /api/reels` - Create reel

## Testing

Test with curl or Postman:

```bash
# Health check
curl http://localhost:3001/health

# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Database Schema

See `database/schema.sql` for full schema.

Key tables:
- `users` - User accounts
- `support_groups` - Mental health support groups
- `support_rooms` - Individual chat rooms (10 members max)
- `support_room_members` - Room memberships
- `messages` - Chat messages
- `mood_entries` - Mood tracking data
- `journal_entries` - User journals
- `meditations` - Meditation content
- `reels` - Short-form video content

## Deployment to LiquidWeb

### 1. Prepare Server

SSH into your LiquidWeb server:

```bash
ssh your-user@your-server.com
```

Install Node.js and PostgreSQL:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres createdb aurawell_db
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your_secure_password';"
```

### 2. Upload Backend Code

```bash
# From your Windows machine
cd backend
git push origin main

# On server
git clone https://github.com/BLOSSOM1234321/aurawell.git
cd aurawell/backend
npm install --production
```

### 3. Configure Production Environment

```bash
# Create .env file on server
nano .env
```

Set production values:
```env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aurawell_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
JWT_SECRET=super_secret_production_key_change_this
CORS_ORIGIN=https://yourdomain.com,capacitor://localhost
```

### 4. Run Migrations

```bash
npm run migrate
npm run seed
```

### 5. Start with PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start server
pm2 start server.js --name aurawell-api

# Auto-start on reboot
pm2 startup
pm2 save
```

### 6. Configure Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/aurawell-api
```

Add:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/aurawell-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection pool
├── database/
│   ├── schema.sql           # Database schema
│   ├── migrate.js           # Migration runner
│   └── seed.js              # Seed data
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Error handling
│   └── validator.js         # Request validation
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── users.js             # User management
│   ├── supportGroups.js     # Support groups
│   ├── supportRooms.js      # Room management
│   ├── messages.js          # Chat messages
│   ├── moods.js             # Mood tracking
│   ├── journals.js          # Journal entries
│   ├── meditations.js       # Meditations
│   └── reels.js             # Reels
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── server.js                # Main server file
└── README.md
```

## Support

For issues or questions, contact the development team or open an issue on GitHub.
