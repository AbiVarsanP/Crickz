const rooms = new Map();

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createRoom(totalOvers = 5, maxWickets = 5) {
  const roomId = generateRoomCode();
  const room = {
    roomId,
    players: [],
    state: 'waiting', // waiting -> setup -> toss -> batBowlChoice -> innings1 -> innings2 -> complete
    gameMode: 'solo', // solo or team
    totalOvers: totalOvers,
    ballsPerOver: 6,
    tossWinner: null,
    tossChoice: null,
    batBowlChoice: null,
    currentInnings: 1,
    
    // Solo mode fields
    player1: {
      id: null,
      name: 'Player 1',
      score: 0,
      wickets: 0,
      balls: 0,
      isBatting: false
    },
    player2: {
      id: null,
      name: 'Player 2',
      score: 0,
      wickets: 0,
      balls: 0,
      isBatting: false
    },
    
    // Team mode fields
    teamA: {
      players: [], // [{name, runs, balls, isOut}]
      totalScore: 0,
      wickets: 0,
      balls: 0,
      currentBatsmanIndex: 0,
      isBatting: false
    },
    teamB: {
      players: [], // [{name, runs, balls, isOut}]
      totalScore: 0,
      wickets: 0,
      balls: 0,
      currentBatsmanIndex: 0,
      isBatting: false
    },
    
    currentBall: {
      batNumber: null,
      bowlNumber: null
    },
    targetScore: null,
    maxWickets: maxWickets // Updated based on game mode or creator choice
  };
  rooms.set(roomId, room);
  return room;
}

export function getRoom(roomId) {
  return rooms.get(roomId);
}

export function joinRoom(roomId, playerId) {
  const room = rooms.get(roomId);
  if (!room) {
    console.log(`Join failed: Room ${roomId} not found`);
    return { success: false, error: 'Room not found' };
  }
  
  // Check if player is already in the room first
  if (room.players.includes(playerId)) {
    console.log(`Player ${playerId} already in room ${roomId}`);
    return { success: true, room, playerNumber: room.players.indexOf(playerId) + 1 };
  }
  
  // Then check if room is full
  if (room.players.length >= 2) {
    console.log(`Join failed: Room ${roomId} is full. Players:`, room.players);
    return { success: false, error: 'Room is full' };
  }
  
  room.players.push(playerId);
  const playerNumber = room.players.length;
  
  console.log(`Player ${playerId} joined room ${roomId} as player ${playerNumber}`);
  
  if (playerNumber === 1) {
    room.player1.id = playerId;
  } else {
    room.player2.id = playerId;
  }
  
  if (room.players.length === 2) {
    room.state = 'toss';
  }
  
  return { success: true, room, playerNumber };
}

export function updateRoomState(roomId, updates) {
  const room = rooms.get(roomId);
  if (!room) return null;
  
  Object.assign(room, updates);
  return room;
}

export function removePlayerFromRoom(roomId, playerId) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  const playerIndex = room.players.indexOf(playerId);
  if (playerIndex !== -1) {
    room.players.splice(playerIndex, 1);
  }
  
  if (room.players.length === 0) {
    rooms.delete(roomId);
  }
}

export function getAllRooms() {
  return Array.from(rooms.values());
}

export function setupGameSettings(roomId, settings) {
  const room = rooms.get(roomId);
  if (!room) return null;
  
  const { gameMode, totalOvers, teamAPlayers, teamBPlayers } = settings;
  
  room.gameMode = gameMode;
  room.totalOvers = totalOvers;
  room.ballsPerOver = 6;
  
  if (gameMode === 'team' && teamAPlayers && teamBPlayers) {
    room.teamA.players = teamAPlayers.map(name => ({
      name,
      runs: 0,
      balls: 0,
      isOut: false
    }));
    room.teamB.players = teamBPlayers.map(name => ({
      name,
      runs: 0,
      balls: 0,
      isOut: false
    }));
    room.maxWickets = teamAPlayers.length - 1;
  } else {
    room.maxWickets = 5; // Solo mode default
  }
  
  room.state = 'toss';
  
  return room;
}
