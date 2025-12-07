export const BALLS_PER_OVER = 6;

export function calculateResult(batNumber, bowlNumber) {
  if (batNumber === bowlNumber) {
    return {
      isOut: true,
      runs: 0
    };
  }
  return {
    isOut: false,
    runs: batNumber
  };
}

export function isInningsComplete(room) {
  const maxBalls = room.totalOvers * room.ballsPerOver;
  
  if (room.gameMode === 'team') {
    const currentTeam = room.currentInnings === 1 ? room.teamA : room.teamB;
    const battingTeam = currentTeam.isBatting ? currentTeam : 
                        (room.currentInnings === 1 ? room.teamB : room.teamA);
    
    return battingTeam.wickets >= room.maxWickets || battingTeam.balls >= maxBalls;
  } else {
    const battingPlayer = room.player1.isBatting ? room.player1 : room.player2;
    return battingPlayer.wickets >= room.maxWickets || battingPlayer.balls >= maxBalls;
  }
}

export function determineMatchWinner(room) {
  if (room.gameMode === 'team') {
    if (room.teamA.totalScore > room.teamB.totalScore) {
      return 'teamA';
    }
    if (room.teamB.totalScore > room.teamA.totalScore) {
      return 'teamB';
    }
    return 'tie';
  } else {
    if (room.player1.score > room.player2.score) {
      return 'player1';
    }
    if (room.player2.score > room.player1.score) {
      return 'player2';
    }
    return 'tie';
  }
}

export function getOversFromBalls(balls) {
  const completedOvers = Math.floor(balls / BALLS_PER_OVER);
  const remainingBalls = balls % BALLS_PER_OVER;
  return `${completedOvers}.${remainingBalls}`;
}

export function getNextBatsmanIndex(team) {
  for (let i = 0; i < team.players.length; i++) {
    if (!team.players[i].isOut) {
      return i;
    }
  }
  return -1; // All out
}
