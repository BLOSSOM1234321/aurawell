# 🚀 Deploy AuraWell Backend to LiquidWeb

Complete guide to deploy your backend to LiquidWeb so all devices can access it.

## Prerequisites

1. LiquidWeb server (VPS or Dedicated)
2. SSH access to your server
3. Domain name (e.g., api.aurawell.com)

## Step 1: Connect to Your LiquidWeb Server

```bash
ssh your-username@your-server-ip
# Or if you have a domain:
ssh your-username@yourdomain.com
```

## Step 2: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Reverse Proxy)
sudo apt install -y nginx
```

## Step 3: Create PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside psql, run:
CREATE DATABASE aurawell_db;
CREATE USER aurawell_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE aurawell_db TO aurawell_user;
\q
```

## Step 4: Clone Your Repository

```bash
# Navigate to home directory
cd ~

# Clone your repo
git clone https://github.com/BLOSSOM1234321/aurawell.git

# Go to backend folder
cd aurawell/backend

# Install dependencies
npm install --production
```

## Step 5: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add this content (update with your values):

```env
PORT=3001
NODE_ENV=production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=aurawell_db
DB_USER=aurawell_user
DB_PASSWORD=your_secure_password_here

JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING_12345678901234567890
JWT_EXPIRE=7d

CORS_ORIGIN=https://yourdomain.com,capacitor://localhost,http://localhost

APP_NAME=AuraWell
MAX_ROOM_MEMBERS=10
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

## Step 6: Run Database Migrations

```bash
# Create database and seed data
npm run setup
```

You should see:
```
✅ Database 'aurawell_db' created successfully!
✅ Schema created successfully
✅ Database seeding completed successfully!
```

## Step 7: Test the Backend

```bash
# Start the server temporarily
npm start
```

In another terminal, test:
```bash
curl http://localhost:3001/health
```

Should return: `{"success":true,"message":"AuraWell API is running"}`

Stop the server: `Ctrl+C`

## Step 8: Start Backend with PM2

```bash
# Start with PM2
pm2 start server.js --name aurawell-api

# Save PM2 configuration
pm2 save

# Setup auto-start on server reboot
pm2 startup

# Copy and run the command PM2 shows
```

Check status:
```bash
pm2 status
```

View logs:
```bash
pm2 logs aurawell-api
```

## Step 9: Configure Nginx (Reverse Proxy)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/aurawell-api
```

Add this content:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Change to your domain

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit.

Enable the site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/aurawell-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 10: Install SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d api.yourdomain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)
```

Your API is now available at: **https://api.yourdomain.com**

## Step 11: Update Frontend Configuration

**On your Windows/Mac development machine:**

Edit `.env`:
```env
VITE_API_URL=https://api.yourdomain.com
```

**Rebuild frontend:**
```bash
npm run build
npx cap sync ios
npx cap sync android
```

## Step 12: Test Everything

**Test API:**
```bash
curl https://api.yourdomain.com/health
```

**Test from browser:**
```
https://api.yourdomain.com/health
```

**Test login:**
```bash
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'
```

## Useful PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs aurawell-api

# Restart
pm2 restart aurawell-api

# Stop
pm2 stop aurawell-api

# Start
pm2 start aurawell-api

# View detailed info
pm2 show aurawell-api
```

## Updating Your Backend (After Code Changes)

```bash
# SSH into server
ssh your-username@your-server-ip

# Navigate to backend
cd ~/aurawell/backend

# Pull latest changes
git pull

# Install dependencies (if any new ones)
npm install --production

# Restart with PM2
pm2 restart aurawell-api

# Check logs
pm2 logs aurawell-api
```

## Security Checklist

- [ ] Changed JWT_SECRET to a strong random string
- [ ] Changed PostgreSQL password
- [ ] SSL certificate installed (HTTPS)
- [ ] Firewall configured (UFW)
- [ ] Regular backups configured
- [ ] PM2 auto-restart enabled

## Firewall Configuration (Optional but Recommended)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22

# Allow HTTP
sudo ufw allow 80

# Allow HTTPS
sudo ufw allow 443

# Check status
sudo ufw status
```

## Database Backups

```bash
# Create backup script
nano ~/backup-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/home/yourusername/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U aurawell_user -h localhost aurawell_db > $BACKUP_DIR/aurawell_db_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "aurawell_db_*.sql" -mtime +7 -delete
```

Make executable:
```bash
chmod +x ~/backup-db.sh
```

Add to crontab (daily backup at 2 AM):
```bash
crontab -e
```

Add:
```
0 2 * * * /home/yourusername/backup-db.sh
```

## Troubleshooting

**Backend won't start:**
```bash
pm2 logs aurawell-api
```

**Database connection error:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check .env file has correct password
nano ~/aurawell/backend/.env
```

**Nginx error:**
```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

**Can't connect from frontend:**
- Check CORS_ORIGIN in .env includes your domain
- Check firewall allows ports 80 and 443
- Check SSL certificate is valid

## Success! 🎉

Your backend is now deployed and accessible at:
- **API:** https://api.yourdomain.com
- **Health:** https://api.yourdomain.com/health
- **Docs:** See backend/README.md for all endpoints

All your devices (Windows, iOS, Android) can now connect to the same backend!

## Next Steps

1. Update mobile apps with production API URL
2. Test on all devices
3. Submit to App Stores
4. Monitor with PM2 logs
5. Setup regular database backups
