export interface Player {
  id: string | null;
  name: string;
  score: number;
  wickets: number;
  balls: number;
  isBatting: boolean;
}

export interface TeamPlayer {
  name: string;
  runs: number;
  balls: number;
  isOut: boolean;
}

export interface Team {
  players: TeamPlayer[];
  totalScore: number;
  wickets: number;
  balls: number;
  currentBatsmanIndex: number;
  isBatting: boolean;
}

export interface Room {
  roomId: string;
  players: string[];
  state: 'waiting' | 'setup' | 'toss' | 'batBowlChoice' | 'innings1' | 'innings2' | 'complete';
  gameMode: 'solo' | 'team';
  totalOvers: number;
  ballsPerOver: number;
  tossWinner: string | null;
  tossChoice: string | null;
  batBowlChoice: string | null;
  currentInnings: number;
  player1: Player;
  player2: Player;
  teamA: Team;
  teamB: Team;
  currentBall: {
    batNumber: number | null;
    bowlNumber: number | null;
  };
  targetScore: number | null;
  maxWickets: number;
}

export interface GameSettings {
  gameMode: 'solo' | 'team';
  totalOvers: number;
  teamAPlayers?: string[];
  teamBPlayers?: string[];
}

export interface BallResult {
  batNumber: number;
  bowlNumber: number;
  isOut: boolean;
  runs: number;
  room: Room;
  currentBatsman?: string;
}

export interface MatchResult {
  winner: 'player1' | 'player2' | 'teamA' | 'teamB' | 'tie';
  gameMode: 'solo' | 'team';
  player1?: {
    score: number;
    wickets: number;
    balls: number;
    overs: string;
  };
  player2?: {
    score: number;
    wickets: number;
    balls: number;
    overs: string;
  };
  teamA?: {
    score: number;
    wickets: number;
    balls: number;
    overs: string;
    players: TeamPlayer[];
  };
  teamB?: {
    score: number;
    wickets: number;
    balls: number;
    overs: string;
    players: TeamPlayer[];
  };
}
