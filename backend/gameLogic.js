export const MAX_WICKETS = 5;
export const MAX_OVERS = 3;
export const BALLS_PER_OVER = 6;
export const MAX_BALLS = MAX_OVERS * BALLS_PER_OVER;

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

export function isInningsComplete(wickets, balls) {
  return wickets >= MAX_WICKETS || balls >= MAX_BALLS;
}

export function determineMatchWinner(player1Score, player2Score, player1Batted) {
  if (player1Score > player2Score) {
    return player1Batted ? 'player1' : 'player2';
  }
  if (player2Score > player1Score) {
    return player1Batted ? 'player2' : 'player1';
  }
  return 'tie';
}

export function getOversFromBalls(balls) {
  const completedOvers = Math.floor(balls / BALLS_PER_OVER);
  const remainingBalls = balls % BALLS_PER_OVER;
  return `${completedOvers}.${remainingBalls}`;
}
