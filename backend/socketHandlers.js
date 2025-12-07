import {
  createRoom,
  getRoom,
  joinRoom,
  updateRoomState,
  removePlayerFromRoom,
  setupGameSettings
} from './roomManager.js';
import {
  calculateResult,
  isInningsComplete,
  determineMatchWinner,
  getOversFromBalls,
  getNextBatsmanIndex,
  BALLS_PER_OVER
} from './gameLogic.js';

function handleInningsComplete(io, roomId, room, battingEntity) {
  if (room.currentInnings === 1) {
    const score = room.gameMode === 'team' ? battingEntity.totalScore : battingEntity.score;
    const wickets = room.gameMode === 'team' ? battingEntity.wickets : battingEntity.wickets;
    const balls = room.gameMode === 'team' ? battingEntity.balls : battingEntity.balls;
    
    room.targetScore = score + 1;
    room.currentInnings = 2;
    room.state = 'innings2';

    if (room.gameMode === 'team') {
      room.teamA.isBatting = !room.teamA.isBatting;
      room.teamB.isBatting = !room.teamB.isBatting;
      room.teamA.currentBatsmanIndex = 0;
      room.teamB.currentBatsmanIndex = 0;
    } else {
      room.player1.isBatting = !room.player1.isBatting;
      room.player2.isBatting = !room.player2.isBatting;
    }

    // Immediately inform clients that innings is complete and provide updated room state
    io.to(roomId).emit('roomUpdate', { room });
    io.to(roomId).emit('inningsComplete', {
      innings: 1,
      score: score,
      wickets: wickets,
      balls: balls,
      overs: getOversFromBalls(balls),
      room: room
    });

    setTimeout(() => {
      io.to(roomId).emit('inningsStart', {
        innings: 2,
        targetScore: room.targetScore,
        room: room
      });
    }, 2000);
  } else {
    handleMatchComplete(io, roomId, room);
  }
}

function handleMatchComplete(io, roomId, room) {
  room.state = 'complete';
  const winner = determineMatchWinner(room);

  if (room.gameMode === 'team') {
    io.to(roomId).emit('matchComplete', {
      winner: winner,
      gameMode: 'team',
      teamA: {
        score: room.teamA.totalScore,
        wickets: room.teamA.wickets,
        balls: room.teamA.balls,
        overs: getOversFromBalls(room.teamA.balls),
        players: room.teamA.players
      },
      teamB: {
        score: room.teamB.totalScore,
        wickets: room.teamB.wickets,
        balls: room.teamB.balls,
        overs: getOversFromBalls(room.teamB.balls),
        players: room.teamB.players
      }
    });
  } else {
    io.to(roomId).emit('matchComplete', {
      winner: winner,
      gameMode: 'solo',
      player1: {
        name: room.player1.name,
        score: room.player1.score,
        wickets: room.player1.wickets,
        balls: room.player1.balls,
        overs: getOversFromBalls(room.player1.balls)
      },
      player2: {
        name: room.player2.name,
        score: room.player2.score,
        wickets: room.player2.wickets,
        balls: room.player2.balls,
        overs: getOversFromBalls(room.player2.balls)
      }
    });
  }
}

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createRoom', ({ name, totalOvers, maxWickets } = {}) => {
      const room = createRoom(totalOvers || 5, maxWickets || 5);
      socket.join(room.roomId);

      // Automatically add creator as player 1
      const result = joinRoom(room.roomId, socket.id);

      // Set player name if provided
      try {
        if (result && result.room) {
          const setName = name && name.trim() ? name.trim() : 'Player 1';
          result.room.player1.name = setName;
          console.log('[socketHandlers] set player1.name on createRoom to', setName);
        }
      } catch (e) {
        console.error('Failed to set player name on room creation', e);
      }

      // Ensure room object includes chosen overs and wickets before sending back
      if (result && result.room) {
        result.room.totalOvers = room.totalOvers;
        result.room.maxWickets = room.maxWickets;
      }

      socket.emit('roomCreated', {
        roomId: room.roomId,
        room: result.room,
        playerNumber: result.playerNumber
      });

      // Emit room update so creator sees they're in waiting state
      io.to(room.roomId).emit('roomUpdate', { room: result.room });

      console.log('Room created:', room.roomId, 'by player:', socket.id, 'name:', name);
    });

    socket.on('joinRoom', ({ roomId, name } = {}) => {
      const result = joinRoom(roomId, socket.id);
      
      if (!result.success) {
        socket.emit('joinError', { error: result.error });
        return;
      }

      // Set player name for the joining player
      try {
        if (result && result.room) {
          if (result.playerNumber === 1) {
            const setName = name && name.trim() ? name.trim() : 'Player 1';
            result.room.player1.name = setName;
            console.log('[socketHandlers] set player1.name on joinRoom to', setName);
          } else if (result.playerNumber === 2) {
            const setName = name && name.trim() ? name.trim() : 'Player 2';
            result.room.player2.name = setName;
            console.log('[socketHandlers] set player2.name on joinRoom to', setName);
          }
        }
      } catch (e) {
        console.error('Failed to set player name on join', e);
      }

      socket.join(roomId);
      socket.emit('playerJoined', {
        room: result.room,
        playerNumber: result.playerNumber
      });

      io.to(roomId).emit('roomUpdate', { room: result.room });

      if (result.room.players.length === 2) {
        io.to(roomId).emit('readyForSetup', {
          message: 'Both players joined! Configure game settings...'
        });
      }

      console.log(`Player ${socket.id} joined room ${roomId}`);
    });

    socket.on('setupGame', ({ roomId, settings }) => {
      const room = setupGameSettings(roomId, settings);
      if (!room) return;

      io.to(roomId).emit('gameConfigured', { room });
      io.to(roomId).emit('startToss', {
        message: 'Game configured! Starting toss...'
      });

      console.log(`Game configured in room ${roomId}:`, settings);
    });

    socket.on('tossChoice', ({ roomId, choice }) => {
      const room = getRoom(roomId);
      if (!room) return;

      const randomResult = Math.random() < 0.5 ? 'heads' : 'tails';
      const winner = randomResult === choice ? room.player1.id : room.player2.id;
      
      updateRoomState(roomId, {
        tossWinner: winner,
        tossChoice: choice,
        state: 'batBowlChoice'
      });

      io.to(roomId).emit('tossResult', {
        result: randomResult,
        winner: winner,
        winnerId: winner
      });

      console.log(`Toss in room ${roomId}: ${randomResult}, winner: ${winner}`);
    });

    socket.on('batBowlChoice', ({ roomId, choice }) => {
      const room = getRoom(roomId);
      if (!room) return;

      const isTossWinner = socket.id === room.tossWinner;
      if (!isTossWinner) return;

      if (room.gameMode === 'team') {
        if (choice === 'bat') {
          room.teamA.isBatting = socket.id === room.player1.id;
          room.teamB.isBatting = socket.id === room.player2.id;
        } else {
          room.teamA.isBatting = socket.id === room.player2.id;
          room.teamB.isBatting = socket.id === room.player1.id;
        }
        room.teamA.currentBatsmanIndex = 0;
        room.teamB.currentBatsmanIndex = 0;
      } else {
        if (choice === 'bat') {
          room.player1.isBatting = socket.id === room.player1.id;
          room.player2.isBatting = socket.id === room.player2.id;
        } else {
          room.player1.isBatting = socket.id === room.player2.id;
          room.player2.isBatting = socket.id === room.player1.id;
        }
      }

      updateRoomState(roomId, {
        batBowlChoice: choice,
        state: 'innings1',
        currentInnings: 1
      });

      io.to(roomId).emit('inningsStart', {
        innings: 1,
        room: room
      });

      console.log(`Room ${roomId} innings 1 started`);
    });

    socket.on('playBall', ({ roomId, number }) => {
      const room = getRoom(roomId);
      if (!room) return;

      const isPlayer1 = socket.id === room.player1.id;
      
      // Determine batting/bowling
      let isBatting;
      if (room.gameMode === 'team') {
        const isTeamA = isPlayer1;
        isBatting = isTeamA ? room.teamA.isBatting : room.teamB.isBatting;
      } else {
        isBatting = isPlayer1 ? room.player1.isBatting : room.player2.isBatting;
      }

      if (isBatting) {
        room.currentBall.batNumber = number;
      } else {
        room.currentBall.bowlNumber = number;
      }

      // Process ball when both players have played
      if (room.currentBall.batNumber !== null && room.currentBall.bowlNumber !== null) {
        const result = calculateResult(room.currentBall.batNumber, room.currentBall.bowlNumber);
        
        if (room.gameMode === 'team') {
          // Team mode logic
          const battingTeam = room.teamA.isBatting ? room.teamA : room.teamB;
          const bowlingTeam = room.teamA.isBatting ? room.teamB : room.teamA;
          
          const currentBatsman = battingTeam.players[battingTeam.currentBatsmanIndex];
          
          battingTeam.balls++;
          currentBatsman.balls++;
          
          if (result.isOut) {
            battingTeam.wickets++;
            currentBatsman.isOut = true;
            
            // Find next batsman
            const nextIndex = getNextBatsmanIndex(battingTeam);
            if (nextIndex !== -1) {
              battingTeam.currentBatsmanIndex = nextIndex;
            }
          } else {
            battingTeam.totalScore += result.runs;
            currentBatsman.runs += result.runs;
          }

          const inningsComplete = isInningsComplete(room);

          io.to(roomId).emit('ballResult', {
            batNumber: room.currentBall.batNumber,
            bowlNumber: room.currentBall.bowlNumber,
            isOut: result.isOut,
            runs: result.runs,
            room: room,
            currentBatsman: currentBatsman.name
          });

          room.currentBall.batNumber = null;
          room.currentBall.bowlNumber = null;

          if (inningsComplete) {
            handleInningsComplete(io, roomId, room, battingTeam);
          } else if (room.currentInnings === 2 && battingTeam.totalScore >= room.targetScore) {
            handleMatchComplete(io, roomId, room);
          }
          
        } else {
          // Solo mode logic
          const battingPlayer = room.player1.isBatting ? room.player1 : room.player2;
          const bowlingPlayer = room.player1.isBatting ? room.player2 : room.player1;

          battingPlayer.balls++;
          
          if (result.isOut) {
            battingPlayer.wickets++;
          } else {
            battingPlayer.score += result.runs;
          }

          const inningsComplete = isInningsComplete(room);

          io.to(roomId).emit('ballResult', {
            batNumber: room.currentBall.batNumber,
            bowlNumber: room.currentBall.bowlNumber,
            isOut: result.isOut,
            runs: result.runs,
            room: room
          });

          room.currentBall.batNumber = null;
          room.currentBall.bowlNumber = null;

          if (inningsComplete) {
            handleInningsComplete(io, roomId, room, battingPlayer);
          } else if (room.currentInnings === 2 && battingPlayer.score >= room.targetScore) {
            handleMatchComplete(io, roomId, room);
          }
        }
      }
    });

    // Allow client to explicitly set their display name on the server
    socket.on('setName', ({ roomId, name } = {}) => {
      try {
        const room = getRoom(roomId);
        if (!room) return;
        if (socket.id === room.player1.id) {
          room.player1.name = name && name.trim() ? name.trim() : room.player1.name;
          console.log('[socketHandlers] setName: updated player1.name to', room.player1.name);
        } else if (socket.id === room.player2.id) {
          room.player2.name = name && name.trim() ? name.trim() : room.player2.name;
          console.log('[socketHandlers] setName: updated player2.name to', room.player2.name);
        }
        io.to(roomId).emit('roomUpdate', { room });
      } catch (e) {
        console.error('Error in setName handler', e);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Find rooms that contain this socket as a player and remove them
      const allRooms = getAllRooms ? getAllRooms() : null;
      if (allRooms) {
        allRooms.forEach((room) => {
          if (room.players && room.players.includes(socket.id)) {
            removePlayerFromRoom(room.roomId, socket.id);
            // If room still exists after removal, emit updated room state to remaining clients
            const updated = getRoom(room.roomId);
            if (updated) {
              io.to(room.roomId).emit('roomUpdate', { room: updated });
            } else {
              // Room removed (no players left) - no update necessary
            }
          }
        });
      } else {
        // Fallback: iterate adapter rooms and attempt removal (less precise)
        const rooms = io.sockets.adapter.rooms;
        rooms.forEach((_, roomId) => {
          removePlayerFromRoom(roomId, socket.id);
        });
      }
    });
  });
}
