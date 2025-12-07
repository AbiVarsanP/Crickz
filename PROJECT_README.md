# 🏏 Crickz

A real-time multiplayer web-based cricket hand-game platform where two players compete in number-matching cricket matches through room-based sessions.

## 🎮 Game Overview

Crickz is a digital version of the classic hand cricket game. Two players compete by selecting numbers (1-6) simultaneously. If the numbers match, the batsman is OUT. Otherwise, the batsman scores runs equal to their selected number.

### Game Rules

- **Players**: 2 players per match
- **Innings**: 2 innings per match
- **Overs**: 3 overs (18 balls) per innings
- **Wickets**: Maximum 5 wickets per innings
- **Scoring**: Select numbers 1-6. If numbers match = OUT, if different = runs scored
- **Target**: Second innings team must chase the first innings score + 1

## ✨ Features

- 🎲 **Real-time Multiplayer**: Play with friends using room codes
- 🪙 **Toss System**: Fair coin toss to decide batting/bowling order
- 📊 **Live Scoreboard**: Real-time score updates and statistics
- 🎯 **Innings Tracking**: Complete tracking of runs, wickets, balls, and overs
- 🏆 **Match Results**: Detailed scorecard at the end of each match
- 🎨 **Crickz Design**: Futuristic neon UI with high-contrast translucent cards and animated backgrounds
- ⚡ **Smooth Animations**: Engaging animations for wickets, runs, and transitions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Socket.io Client** for real-time communication
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Socket.io** for WebSocket connections
- **In-memory storage** for room management
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
crickz/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── game/                # Game-specific components
│   │   │   ├── WaitingRoom.tsx
│   │   │   ├── TossPhase.tsx
│   │   │   ├── BatBowlChoice.tsx
│   │   │   ├── GamePlay.tsx
│   │   │   └── MatchResultDisplay.tsx
│   │   └── ui/                  # shadcn/ui components
│   ├── pages/
│   │   ├── HomePage.tsx         # Create/Join room page
│   │   └── GamePage.tsx         # Main game page
│   ├── services/
│   │   └── socket.ts            # Socket.io service
│   ├── types/
│   │   └── game.ts              # TypeScript type definitions
│   ├── App.tsx
│   ├── routes.tsx
│   └── index.css                # Design system & animations
│
├── backend/                      # Backend server
│   ├── server.js                # Express & Socket.io setup
│   ├── roomManager.js           # Room state management
│   ├── gameLogic.js             # Cricket game rules
│   ├── socketHandlers.js        # Socket event handlers
│   └── package.json
│
├── DEPLOYMENT.md                 # Deployment guide
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

### Local Development

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd crickz
```

#### 2. Setup Backend

```bash
cd backend
npm install
npm start
```

The backend server will start on `http://localhost:3001`

#### 3. Setup Frontend

Open a new terminal:

```bash
cd ..  # Back to root directory
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

#### 4. Play the Game

1. Open `http://localhost:5173` in your browser
2. Click "Create Room" to start a new game
3. Share the room code with a friend
4. Open another browser window/tab (or have your friend open the link)
5. Enter the room code and click "Join Room"
6. Play the game!

## 🎯 How to Play

### Step 1: Create or Join a Room
- **Create Room**: Generate a unique 6-character room code
- **Join Room**: Enter an existing room code to join a game

### Step 2: Toss
- Player 1 selects Heads or Tails
- Server randomly determines the toss winner
- Winner chooses to Bat or Bowl first

### Step 3: First Innings
- Batsman and bowler select numbers (1-6) simultaneously
- If numbers match → Batsman is OUT (wicket lost)
- If numbers differ → Batsman scores runs equal to their number
- Innings ends when: 5 wickets fall OR 18 balls completed

### Step 4: Second Innings
- Players switch roles
- Target = First innings score + 1
- Same rules apply
- Innings ends when: Target achieved OR 5 wickets fall OR 18 balls completed

### Step 5: Match Result
- Winner is determined by comparing final scores
- Complete scorecard is displayed
- Option to play again

## 🎨 Design System

### Color Palette

- **Primary (Cricket Green)**: `hsl(100 45% 25%)` - Headers, buttons, primary elements
- **Secondary (Pitch Brown)**: `hsl(30 25% 50%)` - Secondary elements, bowling stats
- **Accent (Ball Red)**: `hsl(0 75% 50%)` - OUT/WICKET notifications, destructive actions
- **Background (Light Cream)**: `hsl(45 30% 96%)` - Main background
- **Foreground (Dark)**: `hsl(0 0% 20%)` - Text color

### Animations

- **bounce-in**: Wicket notifications and match results
- **fade-in**: Smooth page transitions
- **shake**: OUT/WICKET alerts
- **pulse-glow**: Selected number buttons

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Summary

1. **Backend**: Deploy to Render or Railway
   - Root directory: `backend`
   - Start command: `npm start`

2. **Frontend**: Deploy to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_SOCKET_URL=<your-backend-url>`

3. **Update CORS**: Add your frontend domain to backend's `allowedOrigins`

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_SOCKET_URL=http://localhost:3001  # Backend URL
```

#### Backend
```env
PORT=3001  # Server port (optional, defaults to 3001)
```

## 🐛 Troubleshooting

### Connection Issues
- Verify `VITE_SOCKET_URL` matches your backend URL
- Check CORS settings in backend
- Ensure backend server is running

### Room Join Errors
- Room codes are case-sensitive
- Rooms support maximum 2 players
- Check that both players are connected to the same backend

### Backend Not Responding
- Check backend logs for errors
- Visit `/health` endpoint to verify server is running
- Free tier services may sleep after inactivity

## 📝 Socket.io Events

### Client → Server
- `createRoom`: Create a new game room
- `joinRoom`: Join an existing room
- `tossChoice`: Submit toss choice (heads/tails)
- `batBowlChoice`: Submit bat/bowl choice
- `playBall`: Submit number selection (1-6)

### Server → Client
- `roomCreated`: Room creation confirmation
- `playerJoined`: Player joined notification
- `roomUpdate`: Room state update
- `startToss`: Toss phase start
- `tossResult`: Toss result
- `inningsStart`: Innings start
- `ballResult`: Ball result
- `inningsComplete`: Innings completion
- `matchComplete`: Match result
- `joinError`: Join error

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Inspired by the classic hand cricket game
- Built with modern web technologies
- Designed for cricket enthusiasts worldwide

---

**Enjoy playing Crickz! 🏏**
