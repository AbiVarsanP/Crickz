# Cricket Hand-Game Arena - Backend Server

## 🚀 Quick Start

```bash
# Install dependencies (first time only)
npm install

# Start server
npm start
```

Server will run on **http://localhost:3001**

## ✅ Verify Server is Running

Open browser: http://localhost:3001

You should see:
```json
{"status":"ok","message":"Cricket Hand-Game Server"}
```

## 📋 What This Does

This backend server handles:
- ✅ Real-time multiplayer communication via Socket.io
- ✅ Room creation and management
- ✅ Game state synchronization
- ✅ Cricket game logic (scoring, wickets, overs)
- ✅ Toss mechanism
- ✅ Match result calculation

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3001)

Example:
```bash
PORT=3002 npm start
```

### CORS Settings

Update `allowedOrigins` in `server.js` for production:

```javascript
const allowedOrigins = [
  'http://localhost:5173',           // Local development
  'https://your-app.netlify.app'    // Production frontend
];
```

## 📁 File Structure

```
backend/
├── server.js           # Express + Socket.io server
├── roomManager.js      # Room CRUD operations
├── gameLogic.js        # Cricket game rules
├── socketHandlers.js   # Socket event handlers
└── package.json        # Dependencies
```

## 🎮 Socket.io Events

### Client → Server
- `createRoom` - Create new game room
- `joinRoom` - Join existing room
- `tossChoice` - Submit toss choice (heads/tails)
- `batBowlChoice` - Submit bat/bowl choice
- `playBall` - Submit number selection (1-6)

### Server → Client
- `roomCreated` - Room creation confirmation
- `playerJoined` - Player joined notification
- `roomUpdate` - Room state update
- `startToss` - Toss phase start
- `tossResult` - Toss result
- `inningsStart` - Innings start
- `ballResult` - Ball result with score
- `inningsComplete` - Innings completion
- `matchComplete` - Match result
- `joinError` - Error handling

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill it
kill -9 <PID>

# Or use different port
PORT=3002 npm start
```

### Cannot Find Module

```bash
npm install
```

### Connection Issues

1. Check server is running: `npm start`
2. Check port 3001 is accessible
3. Check firewall settings
4. Verify CORS configuration

## 🌐 Deployment

### Deploy to Render

1. Create new Web Service
2. Connect Git repository
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`

### Deploy to Railway

1. Create new project
2. Connect Git repository
3. Set root directory: `backend`
4. Railway auto-detects Node.js

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## 📊 API Endpoints

- `GET /` - Server status
- `GET /health` - Health check

## 🔒 Security Notes

- Rooms are stored in memory (cleared on restart)
- No authentication required (add if needed)
- CORS configured for allowed origins
- Rate limiting not implemented (add for production)

## 📝 Dependencies

```json
{
  "express": "^4.18.2",
  "socket.io": "^4.6.1",
  "cors": "^2.8.5"
}
```

## 🎯 Game Logic

### Cricket Rules
- **Max Wickets**: 5 per innings
- **Max Overs**: 3 (18 balls)
- **Scoring**: Number selection (1-6)
- **OUT**: When numbers match
- **Target**: First innings + 1

### Room Management
- Unique 6-character room codes
- Maximum 2 players per room
- In-memory storage
- Auto-cleanup on disconnect

## 📞 Need Help?

- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - Common issues
- [BACKEND_SETUP.md](../BACKEND_SETUP.md) - Detailed setup guide
- [PROJECT_README.md](../PROJECT_README.md) - Full documentation

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: December 6, 2025
