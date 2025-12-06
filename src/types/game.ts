export interface Player {
  id: string | null;
  name: string;
  score: number;
  wickets: number;
  balls: number;
  isBatting: boolean;
}

export interface Room {
  roomId: string;
  players: string[];
  state: 'waiting' | 'toss' | 'batBowlChoice' | 'innings1' | 'innings2' | 'complete';
  tossWinner: string | null;
  tossChoice: string | null;
  batBowlChoice: string | null;
  currentInnings: number;
  player1: Player;
  player2: Player;
  currentBall: {
    batNumber: number | null;
    bowlNumber: number | null;
  };
  targetScore: number | null;
}

export interface BallResult {
  batNumber: number;
  bowlNumber: number;
  isOut: boolean;
  runs: number;
  room: Room;
}

export interface MatchResult {
  winner: 'player1' | 'player2' | 'tie';
  player1: {
    score: number;
    wickets: number;
    balls: number;
    overs: string;
  };
  player2: {
    score: number;
    wickets: number;
    balls: number;
    overs: string;
  };
}
