# 🔧 Troubleshooting Guide - Cricket Hand-Game Arena

## Common Issues and Solutions

### 🔴 Issue: "Room not creating" or "Connection Error"

This is the most common issue and usually means the backend server is not running.

#### Solution Steps:

**Step 1: Check if Backend is Running**

Open a new terminal and run:
```bash
cd backend
npm start
```

You should see:
```
Server running on port 3001
```

**Step 2: Verify Backend is Accessible**

Open your browser and visit:
```
http://localhost:3001
```

You should see:
```json
{"status":"ok","message":"Cricket Hand-Game Server"}
```

**Step 3: Check Connection Status**

On the homepage, look for the connection badge at the top:
- 🟢 **Connected** - Backend is running, you can create rooms
- 🔴 **Disconnected** - Backend is not running or not accessible

**Step 4: Check Browser Console**

Open browser developer tools (F12) and check the Console tab:

✅ **Good - Connected:**
```
Connected to server
```

❌ **Bad - Not Connected:**
```
Connection error: ...
```

#### Quick Fix Commands:

```bash
# Terminal 1: Start Backend
cd backend
npm install  # Only needed first time
npm start

# Terminal 2: Start Frontend (in root directory)
npm run dev
```

---

### 🔴 Issue: "Port 3001 is already in use"

#### Solution:

**Option 1: Kill the Process**
```bash
# Find what's using port 3001
lsof -i :3001

# Kill it (replace PID with actual number)
kill -9 PID
```

**Option 2: Use Different Port**
```bash
# Start backend on different port
PORT=3002 npm start
```

Then update `.env` in frontend:
```
VITE_SOCKET_URL=http://localhost:3002
```

Restart the frontend after changing `.env`.

---

### 🔴 Issue: "Cannot find module 'express'"

#### Solution:

```bash
cd backend
npm install
```

This installs all required dependencies:
- express
- socket.io
- cors

---

### 🔴 Issue: Room code not working / "Room not found"

#### Possible Causes:

1. **Case Sensitivity**: Room codes are case-sensitive
   - Solution: Use uppercase letters (automatically converted)

2. **Backend Restarted**: Rooms are stored in memory
   - Solution: Create a new room after backend restart

3. **Wrong Backend**: Players connecting to different backends
   - Solution: Ensure both players use same backend URL

---

### 🔴 Issue: "Connection Timeout"

#### Solution:

1. **Check Backend Logs**: Look at the terminal where backend is running
2. **Check Firewall**: Ensure port 3001 is not blocked
3. **Check CORS**: Backend should allow your frontend domain

---

### 🔴 Issue: Players can't see each other

#### Solution:

1. **Both players must join same room**: Verify room code matches exactly
2. **Backend must be running**: Check connection status
3. **Check browser console**: Look for Socket.io errors

---

### 🔴 Issue: Game freezes or doesn't update

#### Solution:

1. **Refresh both browsers**: F5 or Cmd+R
2. **Check connection**: Look for "Disconnected" badge
3. **Restart backend**: Stop and start the backend server
4. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

### 🔴 Issue: "npm: command not found"

#### Solution:

Install Node.js from https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

---

### 🔴 Issue: Frontend shows blank page

#### Solution:

1. **Check browser console** (F12) for errors
2. **Verify frontend is running**: Should see "Local: http://localhost:5173"
3. **Clear browser cache**: Hard refresh
4. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

## Debugging Checklist

Use this checklist to diagnose issues:

### Backend Checklist
- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Terminal shows "Server running on port 3001"
- [ ] Can access http://localhost:3001 in browser
- [ ] No error messages in backend terminal

### Frontend Checklist
- [ ] Frontend is running (`npm run dev` in root folder)
- [ ] Can access http://localhost:5173 in browser
- [ ] Connection badge shows "🟢 Connected"
- [ ] No errors in browser console (F12)

### Environment Checklist
- [ ] `.env` file exists in root directory
- [ ] `.env` contains `VITE_SOCKET_URL=http://localhost:3001`
- [ ] Frontend was restarted after changing `.env`

### Network Checklist
- [ ] Port 3001 is not blocked by firewall
- [ ] No other application using port 3001
- [ ] Both players on same network (for local testing)

---

## Testing Connection

### Test 1: Backend Health Check
```bash
curl http://localhost:3001/health
```

Expected:
```json
{"status":"healthy"}
```

### Test 2: Socket.io Connection

Open browser console on frontend:
```javascript
// Should see this log
Connected to server
```

### Test 3: Create Room

1. Click "Create New Room"
2. Should see toast: "Room Created"
3. Should navigate to game page
4. Should see 6-character room code

---

## Still Having Issues?

### Check These Files:

1. **Backend Configuration**
   - File: `backend/server.js`
   - Check: Port number (default 3001)
   - Check: CORS settings

2. **Frontend Configuration**
   - File: `.env`
   - Check: `VITE_SOCKET_URL` matches backend URL

3. **Socket Service**
   - File: `src/services/socket.ts`
   - Check: Connection settings

### Enable Debug Mode

**Backend Debug:**

Edit `backend/server.js` and add console.logs:
```javascript
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('createRoom', () => {
    console.log('Create room request from:', socket.id);
    // ... rest of code
  });
});
```

**Frontend Debug:**

Open browser console (F12) and check for:
- Connection logs
- Socket.io events
- Error messages

---

## Quick Reference

### Start Everything (Fresh Start)

```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend (new terminal, from root)
npm install
npm run dev
```

### Verify Everything is Working

1. Backend: http://localhost:3001 → Should show JSON
2. Frontend: http://localhost:5173 → Should show homepage
3. Connection: Badge should show "🟢 Connected"
4. Create Room: Should work without errors

---

## Getting Help

If you're still stuck:

1. **Check Documentation**:
   - [QUICKSTART.md](./QUICKSTART.md) - Setup guide
   - [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Backend-specific help
   - [PROJECT_README.md](./PROJECT_README.md) - Technical details

2. **Check Logs**:
   - Backend terminal output
   - Browser console (F12)
   - Network tab in browser dev tools

3. **Common Patterns**:
   - 90% of issues = Backend not running
   - 5% of issues = Wrong port/URL configuration
   - 5% of issues = Firewall/network problems

---

**Remember**: The backend MUST be running for the game to work! 🚀
