const rooms = new Map();

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createRoom() {
  const roomId = generateRoomCode();
  const room = {
    roomId,
    players: [],
    state: 'waiting',
    tossWinner: null,
    tossChoice: null,
    batBowlChoice: null,
    currentInnings: 1,
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
    currentBall: {
      batNumber: null,
      bowlNumber: null
    },
    targetScore: null
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
    return { success: false, error: 'Room not found' };
  }
  if (room.players.length >= 2) {
    return { success: false, error: 'Room is full' };
  }
  if (room.players.includes(playerId)) {
    return { success: true, room, playerNumber: room.players.indexOf(playerId) + 1 };
  }
  
  room.players.push(playerId);
  const playerNumber = room.players.length;
  
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
