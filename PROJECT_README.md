# 🏏 Cricktz
A real-time multiplayer web-based cricket hand-game platform where two players compete in number-matching cricket matches through room-based sessions.

## 🎮 Game Overview

Cricktz is a digital version of the classic hand cricket game. Two players compete by selecting numbers (1-6) simultaneously. If the numbers match, the batsman is OUT. Otherwise, the batsman scores runs equal to their selected number.

### Game Rules


## ✨ Features


## 🛠️ Technology Stack

### Frontend

### Backend

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

### Step 2: Toss

### Step 3: First Innings

### Step 4: Second Innings

### Step 5: Match Result

## 🎨 Design System

### Color Palette


### Animations


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

### Room Join Errors

### Backend Not Responding

## 📝 Socket.io Events

### Client → Server

### Server → Client

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments



**Enjoy playing Crickz! 🏏**
