# 🚀 Quick Start Guide - Cricket Hand-Game Arena

Get up and running in 5 minutes!

## 🎯 For Players (Using Deployed Version)

1. **Open the Game**: Visit the deployed website URL
2. **Create a Room**: Click "Create New Room" button
3. **Share Room Code**: Copy the 6-character room code
4. **Invite Friend**: Share the code with your friend
5. **Friend Joins**: Friend enters the code and clicks "Join Room"
6. **Play**: Follow the on-screen instructions to play!

## 💻 For Developers (Local Setup)

### Prerequisites
- Node.js 18 or higher
- npm or pnpm

### Step 1: Start Backend Server

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start server
npm start
```

✅ Backend running at `http://localhost:3001`

### Step 2: Start Frontend (New Terminal)

```bash
# Navigate back to root
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### Step 3: Test the Game

1. Open `http://localhost:5173` in Chrome
2. Click "Create Room" → Note the room code
3. Open `http://localhost:5173` in Firefox (or Incognito)
4. Click "Join Room" → Enter the room code
5. Play a complete match!

## 🎮 Game Flow

```
1. Home Page
   ↓
2. Create/Join Room
   ↓
3. Waiting Room (until 2 players)
   ↓
4. Toss (Player 1 chooses Heads/Tails)
   ↓
5. Bat/Bowl Choice (Toss winner decides)
   ↓
6. First Innings (18 balls or 5 wickets)
   ↓
7. Second Innings (chase target)
   ↓
8. Match Result (winner declared)
```

## 🔧 Common Issues

### "Cannot connect to server"
- **Solution**: Make sure backend is running on port 3001
- Check `.env` file has correct `VITE_SOCKET_URL`

### "Room not found"
- **Solution**: Room codes are case-sensitive
- Make sure both players use the same backend server

### "Room is full"
- **Solution**: Each room supports only 2 players
- Create a new room for a new match

## 📱 Testing on Mobile

1. Find your computer's local IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

2. Update `.env`:
   ```
   VITE_SOCKET_URL=http://YOUR_IP:3001
   ```

3. Access from mobile:
   - Open `http://YOUR_IP:5173` on your phone
   - Make sure phone and computer are on same WiFi

## 🚀 Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

**Quick Deploy:**
1. Backend → Render/Railway
2. Frontend → Netlify
3. Update CORS and environment variables
4. Share your game URL with the world!

## 🎉 You're Ready!

Start playing Cricket Hand-Game Arena and challenge your friends! 🏏
