# Multiplayer Cricktz Website Requirements Document

## 1. Application Overview

### 1.1 Application Name
Cricktz

### 1.2 Application Description
A real-time multiplayer web-based cricket hand-game platform where two players compete in number-matching cricket matches through room-based sessions.

### 1.3 Application Type
Web Application (Real-time Multiplayer Game)

## 2. Core Features
\n### 2.1 Home Page
- Display two primary action buttons: 'Create Room' and 'Join Room'
- Create Room: Generate unique room code via backend and display to user
- Join Room: Input field for entering existing room code
\n### 2.2 Room System
- Backend maintains in-memory room storage\n- Room data structure includes:
  - roomId: Unique identifier\n  - players: Array of connected players
  - tossWinner: Player who won the toss
  - choice: Bat or Bowl selection
  - innings: Current innings number
  - scores: Run counts for both players
  - wickets: Wicket counts\n  - balls: Ball counts
  - state: Current game state

### 2.3 Game Flow
\n#### 2.3.1 Toss Phase
- Triggered when both players join the room
- Player A selects Heads or Tails
- Server randomly determines toss winner
- Winner chooses to Bat or Bowl
\n#### 2.3.2 First Innings
- Batting player selects number (1-6)
- Bowling player selects number (1-6)
- Server validates:\n  - If numbers match → OUT (wicket lost)
  - If numbers differ → Runs added to score
- Track metrics:
  - Current runs
  - Wickets (maximum 5)
  - Balls bowled
  - Overs (3 overs = 18 balls)
- Innings ends when:5 wickets fall OR 18 balls completed

#### 2.3.3 Second Innings\n- Target score = First innings score + 1
- Roles switch (batsman becomes bowler)\n- Same gameplay logic applies
- Innings ends when: Target achieved OR 5 wickets fall OR 18 balls completed
\n#### 2.3.4 Match Result
- Compare final scores
- Declare Winner, Loser, or Tie\n- Display complete scorecard with:
  - Runs scored by each player
  - Wickets taken
  - Balls faced
  - Overs completed

### 2.4 Real-Time Communication
Socket.io event system:
- createRoom: Request new room creation
- roomCreated: Confirm room creation with code
- joinRoom: Request to join existing room
- playerJoined: Notify room of new player
- startToss: Initiate toss phase
- tossChoice: Submit Heads/Tails selection
- tossResult: Broadcast toss outcome
- batBowlChoice: Submit Bat/Bowl preference
- inningsStart: Signal innings beginning
- playBall: Submit number selection (1-6)
- scoreUpdate: Broadcast current score state
- inningsComplete: Signal innings end
- matchResult: Broadcast final match outcome

## 3. Technical Implementation

### 3.1 Frontend Stack
- HTML5 for structure
- CSS3 for styling
- Vanilla JavaScript for logic
- Socket.io client library for real-time communication
\n### 3.2 Backend Stack
- Node.js runtime environment
- Express.js web framework
- Socket.io server for WebSocket connections
- In-memory data store for room management\n
### 3.3 Deployment Architecture
- Frontend: Netlify hosting
- Backend: Render or Railway platform
- CORS configuration for cross-origin requests
- Proper Socket.io URL configuration for client-server connection

## 4. UI/UX Requirements

### 4.1 Scoreboard Display
- Card-based layout showing:
  - Current runs
  - Wickets remaining
  - Balls bowled
  - Overs completed
  - Target score (in second innings)

### 4.2 Visual Feedback
- Animation effects for:
  - OUT event (wicket fall)
  - WICKET notification
  - Score updates
  - Innings transitions

### 4.3 User Interface Elements
- Number selection buttons (1-6) for batting/bowling
- Room code display and input fields
- Toss selection interface (Heads/Tails)
- Bat/Bowl choice buttons
- Match result screen with full scorecard
\n## 5. Code Structure

### 5.1 Frontend Files
- index.html: Home page with room creation/joining
- game.html: Main game interface
- styles.css: Complete styling
- app.js: Client-side game logic and Socket.io handlers

### 5.2 Backend Files
- server.js: Express server setup and Socket.io initialization
- roomManager.js: Room creation, joining, and state management
- gameLogic.js: Cricket game rules and score calculation
- socketHandlers.js: Socket event listeners and emitters

## 6. Deployment Guide

### 6.1 Frontend Deployment (Netlify)
- Build frontend files\n- Configure build settings
- Set environment variables for backend URL
- Deploy to Netlify

### 6.2 Backend Deployment (Render/Railway)
- Push code to Git repository
- Connect repository to hosting platform
- Configure environment variables
- Set start command: node server.js
- Deploy backend service

### 6.3 CORS Configuration
- Whitelist frontend domain in backend CORS settings
- Configure Socket.io CORS options
\n## 7. Testing Instructions

### 7.1 Local Testing
- Run backend server locally
- Open two browser windows/tabs
- Test room creation and joining
- Verify toss mechanism\n- Test complete game flow
- Validate score calculations
- Check wicket and over limits

### 7.2 Production Testing
- Test with deployed URLs
- Verify real-time synchronization
- Test connection stability
- Validate cross-browser compatibility
- Test mobile responsiveness

## 8. Design Style\n
### 8.1 Color Scheme
- Primary color: Cricket green (#2d5016) for headers and primary buttons
- Secondary color: Pitch brown (#8b6f47) for secondary elements
- Accent color: Ball red (#c8102e) for OUT/WICKET notifications
- Background: Light cream (#f5f5dc) for main areas
- Text: Dark charcoal (#333333) for readability
\n### 8.2 Visual Details
- Border radius: 8px for cards and buttons for modern feel
- Box shadow: Subtle elevation (02px 8px rgba(0,0,0,0.1)) on interactive elements
- Button hover: Scale transform (1.05) with smooth transition
- Animation: Bounce effect on wicket fall, fade-in for score updates

### 8.3 Layout Style
- Card-based layout for scoreboard and game controls
- Centered content with max-width constraint for readability
- Flexbox for responsive button arrangements
- Grid layout for number selection (2x3grid for1-6 buttons)