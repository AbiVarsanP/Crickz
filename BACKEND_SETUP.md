# 🚀 Backend Server Setup Guide

## ⚠️ IMPORTANT: Backend Must Be Running

The Cricket Hand-Game Arena requires a backend server to handle real-time multiplayer functionality. **You must start the backend server before using the application.**

## Quick Start

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies (First Time Only)

```bash
npm install
```

This will install:
- express (Web server)
- socket.io (Real-time communication)
- cors (Cross-origin requests)

### Step 3: Start the Server

```bash
npm start
```

You should see:
```
Server running on port 3001
```

## Verification

### Check if Backend is Running

Open your browser and visit:
```
http://localhost:3001
```

You should see:
```json
{"status":"ok","message":"Cricket Hand-Game Server"}
```

### Check Health Endpoint

Visit:
```
http://localhost:3001/health
```

You should see:
```json
{"status":"healthy"}
```

## Common Issues

### Issue 1: "Port 3001 is already in use"

**Solution:**
```bash
# Find the process using port 3001
lsof -i :3001

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use a different port
PORT=3002 npm start
```

If using a different port, update `.env` in the frontend:
```
VITE_SOCKET_URL=http://localhost:3002
```

### Issue 2: "Cannot find module 'express'"

**Solution:**
```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies
npm install
```

### Issue 3: "EADDRINUSE: address already in use"

**Solution:**
Another application is using port 3001. Either:
1. Stop the other application
2. Use a different port (see Issue 1)

### Issue 4: Frontend shows "Connection Error"

**Checklist:**
- ✅ Backend server is running (`npm start` in backend folder)
- ✅ Backend shows "Server running on port 3001"
- ✅ Can access http://localhost:3001 in browser
- ✅ `.env` file has correct `VITE_SOCKET_URL=http://localhost:3001`
- ✅ Frontend was restarted after changing `.env`

## Testing the Connection

### Test 1: Backend Status
```bash
curl http://localhost:3001
```

Expected output:
```json
{"status":"ok","message":"Cricket Hand-Game Server"}
```

### Test 2: Health Check
```bash
curl http://localhost:3001/health
```

Expected output:
```json
{"status":"healthy"}
```

### Test 3: Socket.io Connection

Open browser console on the frontend and look for:
```
Connected to server
```

If you see:
```
Connection error: ...
```

The backend is not running or not accessible.

## Running Backend in Background

### Using nohup (Linux/Mac)
```bash
cd backend
nohup npm start > server.log 2>&1 &
```

### Using screen (Linux/Mac)
```bash
screen -S cricket-backend
cd backend
npm start
# Press Ctrl+A, then D to detach
```

To reattach:
```bash
screen -r cricket-backend
```

### Using pm2 (Recommended for Production)
```bash
# Install pm2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start npm --name "cricket-backend" -- start

# View logs
pm2 logs cricket-backend

# Stop backend
pm2 stop cricket-backend
```

## Environment Variables

The backend supports these environment variables:

- `PORT` - Server port (default: 3001)

Example:
```bash
PORT=3002 npm start
```

## Logs and Debugging

### Enable Debug Logs

Edit `backend/server.js` and add:
```javascript
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // ... rest of the code
});
```

### View Real-time Logs

The backend logs important events:
- Client connections
- Room creation
- Player joins
- Game events

Watch the terminal where you ran `npm start` to see these logs.

## Next Steps

Once the backend is running:

1. ✅ Backend running on port 3001
2. ✅ Frontend can connect to backend
3. ✅ Ready to create and join rooms!

Now you can:
- Start the frontend: `npm run dev` (in root directory)
- Open http://localhost:5173
- Create a room and start playing!

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Need more help?** Check:
- [QUICKSTART.md](./QUICKSTART.md) - Complete setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [PROJECT_README.md](./PROJECT_README.md) - Technical documentation
