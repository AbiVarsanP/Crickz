# Cricket Hand-Game Arena - Backend Server

This is the backend server for the Cricket Hand-Game Arena multiplayer game.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on port 3001 by default (or the PORT environment variable if set).

## Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your Git repository
3. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `PORT` if needed (Render provides this automatically)

### Deploy to Railway

1. Create a new project on Railway
2. Connect your Git repository
3. Set the following:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - Railway will automatically detect the package.json and install dependencies

## Environment Variables

- `PORT`: Server port (default: 3001)

## CORS Configuration

Update the `allowedOrigins` array in `server.js` with your frontend domain after deployment.

## API Endpoints

- `GET /`: Server status
- `GET /health`: Health check

## Socket.io Events

### Client to Server
- `createRoom`: Create a new game room
- `joinRoom`: Join an existing room
- `tossChoice`: Submit toss choice (heads/tails)
- `batBowlChoice`: Submit bat/bowl choice
- `playBall`: Submit number selection (1-6)

### Server to Client
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
