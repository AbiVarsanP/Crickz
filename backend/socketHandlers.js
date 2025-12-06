import {
  createRoom,
  getRoom,
  joinRoom,
  updateRoomState,
  removePlayerFromRoom
} from './roomManager.js';
import {
  calculateResult,
  isInningsComplete,
  determineMatchWinner,
  getOversFromBalls,
  MAX_WICKETS,
  MAX_BALLS
} from './gameLogic.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createRoom', () => {
      const room = createRoom();
      socket.join(room.roomId);
      socket.emit('roomCreated', { roomId: room.roomId });
      console.log('Room created:', room.roomId);
    });

    socket.on('joinRoom', ({ roomId }) => {
      const result = joinRoom(roomId, socket.id);
      
      if (!result.success) {
        socket.emit('joinError', { error: result.error });
        return;
      }

      socket.join(roomId);
      socket.emit('playerJoined', {
        room: result.room,
        playerNumber: result.playerNumber
      });

      io.to(roomId).emit('roomUpdate', { room: result.room });

      if (result.room.players.length === 2) {
        io.to(roomId).emit('startToss', {
          message: 'Both players joined! Starting toss...'
        });
      }

      console.log(`Player ${socket.id} joined room ${roomId}`);
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

      if (choice === 'bat') {
        room.player1.isBatting = socket.id === room.player1.id;
        room.player2.isBatting = socket.id === room.player2.id;
      } else {
        room.player1.isBatting = socket.id === room.player2.id;
        room.player2.isBatting = socket.id === room.player1.id;
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
      const player = isPlayer1 ? room.player1 : room.player2;
      const opponent = isPlayer1 ? room.player2 : room.player1;

      if (player.isBatting) {
        room.currentBall.batNumber = number;
      } else {
        room.currentBall.bowlNumber = number;
      }

      if (room.currentBall.batNumber !== null && room.currentBall.bowlNumber !== null) {
        const result = calculateResult(room.currentBall.batNumber, room.currentBall.bowlNumber);
        
        const battingPlayer = player.isBatting ? player : opponent;
        const bowlingPlayer = player.isBatting ? opponent : player;

        battingPlayer.balls++;
        
        if (result.isOut) {
          battingPlayer.wickets++;
        } else {
          battingPlayer.score += result.runs;
        }

        const inningsComplete = isInningsComplete(battingPlayer.wickets, battingPlayer.balls);

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
          if (room.currentInnings === 1) {
            room.targetScore = battingPlayer.score + 1;
            room.currentInnings = 2;
            room.player1.isBatting = !room.player1.isBatting;
            room.player2.isBatting = !room.player2.isBatting;
            room.state = 'innings2';

            io.to(roomId).emit('inningsComplete', {
              innings: 1,
              score: battingPlayer.score,
              wickets: battingPlayer.wickets,
              balls: battingPlayer.balls,
              overs: getOversFromBalls(battingPlayer.balls)
            });

            setTimeout(() => {
              io.to(roomId).emit('inningsStart', {
                innings: 2,
                targetScore: room.targetScore,
                room: room
              });
            }, 2000);
          } else {
            room.state = 'complete';
            const player1Batted = room.player1.isBatting ? false : true;
            const winner = determineMatchWinner(room.player1.score, room.player2.score, player1Batted);

            io.to(roomId).emit('matchComplete', {
              winner: winner,
              player1: {
                score: room.player1.score,
                wickets: room.player1.wickets,
                balls: room.player1.balls,
                overs: getOversFromBalls(room.player1.balls)
              },
              player2: {
                score: room.player2.score,
                wickets: room.player2.wickets,
                balls: room.player2.balls,
                overs: getOversFromBalls(room.player2.balls)
              }
            });
          }
        } else {
          if (room.currentInnings === 2 && battingPlayer.score >= room.targetScore) {
            room.state = 'complete';
            const player1Batted = room.player1.isBatting ? false : true;
            const winner = determineMatchWinner(room.player1.score, room.player2.score, player1Batted);

            io.to(roomId).emit('matchComplete', {
              winner: winner,
              player1: {
                score: room.player1.score,
                wickets: room.player1.wickets,
                balls: room.player1.balls,
                overs: getOversFromBalls(room.player1.balls)
              },
              player2: {
                score: room.player2.score,
                wickets: room.player2.wickets,
                balls: room.player2.balls,
                overs: getOversFromBalls(room.player2.balls)
              }
            });
          }
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      const rooms = io.sockets.adapter.rooms;
      rooms.forEach((_, roomId) => {
        removePlayerFromRoom(roomId, socket.id);
      });
    });
  });
}
