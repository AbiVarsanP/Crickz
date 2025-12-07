import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { socketService } from '@/services/socket';
import { Room, BallResult } from '@/types/game';
import { Badge } from '@/components/ui/badge';
import { Target, Shield } from 'lucide-react';

interface GamePlayProps {
  room: Room;
  playerNumber: number;
  roomId: string;
  lastBallResult: BallResult | null;
}

export default function GamePlay({ room, playerNumber, roomId, lastBallResult }: GamePlayProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const socket = socketService.getSocket();
  const myPlayer = playerNumber === 1 ? room.player1 : room.player2;
  const opponentPlayer = playerNumber === 1 ? room.player2 : room.player1;
  const isBatting = myPlayer.isBatting;
  console.log('[GamePlay] socket.id=', socket?.id, 'player1.id=', room.player1?.id, 'player2.id=', room.player2?.id, 'player1.name=', room.player1?.name, 'player2.name=', room.player2?.name);

  // defensive: if players are missing (partial payload), avoid throwing
  if (!room.player1 || !room.player2) {
    console.warn('[GamePlay] incomplete room payload, waiting for full room data', room);
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">Waiting for players...</div>
      </div>
    );
  }

  useEffect(() => {
    if (lastBallResult) {
      setShowResult(true);
      setSelectedNumber(null);
      const timer = setTimeout(() => {
        setShowResult(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastBallResult]);

  const handleNumberSelect = (number: number) => {
    if (selectedNumber !== null) return;
    setSelectedNumber(number);
    socketService.emit('playBall', { roomId, number });
  };

  const getOvers = (balls: number, ballsPerOver: number) => {
    const overs = Math.floor(balls / ballsPerOver);
    const remainingBalls = balls % ballsPerOver;
    return `${overs}.${remainingBalls}`;
  };

  // Support both solo and team modes
  const battingEntity = room.gameMode === 'team'
    ? (room.teamA.isBatting ? room.teamA : room.teamB)
    : (room.player1.isBatting ? room.player1 : room.player2);

  const bowlingEntity = room.gameMode === 'team'
    ? (room.teamA.isBatting ? room.teamB : room.teamA)
    : (room.player1.isBatting ? room.player2 : room.player1);

  // For clarity in solo mode, expose battingPlayer/bowlingPlayer variables referencing player objects
  const battingPlayer = room.player1.isBatting ? room.player1 : room.player2;
  const bowlingPlayer = room.player1.isBatting ? room.player2 : room.player1;

  return (
    <div className="flex flex-col space-y-4 animate-fade-in min-h-0">
      {/* Player names removed — streamlined UI */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Innings {room.currentInnings}
              {room.currentInnings === 2 && room.targetScore && (
                <span className="text-muted-foreground text-base ml-2">
                  (Target: {room.targetScore})
                </span>
              )}
            </CardTitle>
            <Badge variant={isBatting ? 'default' : 'secondary'} className="text-sm">
              {isBatting ? (
                <><Target className="h-3 w-3 mr-1" /> Batting</>
              ) : (
                <><Shield className="h-3 w-3 mr-1" /> Bowling</>
              )}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              {room.gameMode === 'team' ? (
                <>Batting: {room.teamA.isBatting ? 'Team A' : 'Team B'}</>
              ) : (
                <>Batting: {(battingPlayer as any).name || (battingEntity as any).name || 'Player'}</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                  <div className="flex justify-between text-xl font-semibold">
                    <span>Score:</span>
                    <span className="text-primary">{room.gameMode === 'team' ? (battingEntity as any).totalScore : (battingEntity as any).score}/{(battingEntity as any).wickets}</span>
                  </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Overs:</span>
                <span>{getOvers((battingEntity as any).balls, room.ballsPerOver || 6)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Balls:</span>
                <span>{(battingEntity as any).balls}/{room.totalOvers * (room.ballsPerOver || 6)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Wickets Left:</span>
                <span>{room.maxWickets - (battingEntity as any).wickets}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {room.gameMode === 'team' ? (
                <>Bowling: {room.teamA.isBatting ? 'Team B' : 'Team A'}</>
              ) : (
                <>Bowling: {(bowlingPlayer as any).name || (bowlingEntity as any).name || 'Player'}</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-base">
                <span>Wickets Taken:</span>
                <span className="font-semibold text-secondary">{(battingEntity as any).wickets}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Runs Conceded:</span>
                <span>{room.gameMode === 'team' ? (battingEntity as any).totalScore : (battingEntity as any).score}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showResult && lastBallResult && (
        <Card className={`${lastBallResult.isOut ? 'bg-destructive/10 border-destructive animate-shake' : 'bg-primary/10 border-primary animate-bounce-in'}`}>
          <CardContent className="py-6">
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">
                {lastBallResult.isOut ? '🔴 WICKET!' : `✅ ${lastBallResult.runs} Run${lastBallResult.runs !== 1 ? 's' : ''}!`}
              </p>
              <p className="text-muted-foreground">
                Bat: {lastBallResult.batNumber} | Bowl: {lastBallResult.bowlNumber}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {isBatting ? 'Select Your Batting Number' : 'Select Your Bowling Number'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const isSelected = selectedNumber === num;
              const base = 'h-12 sm:h-16 md:h-20 text-xl sm:text-2xl font-bold rounded-lg flex items-center justify-center border';
              const selectedClasses = 'bg-white/30 text-black border-white/40';
              const unselectedClasses = 'bg-white/8 text-white border-white/20 hover:bg-white/12';
              return (
                <Button
                  key={num}
                  onClick={() => handleNumberSelect(num)}
                  disabled={selectedNumber !== null}
                  className={`${base} ${isSelected ? selectedClasses : unselectedClasses} ${isSelected ? 'animate-pulse-glow' : ''}`}
                >
                  {num}
                </Button>
              );
            })}
          </div>
          {selectedNumber !== null && (
            <p className="text-center mt-4 text-sm text-muted-foreground animate-pulse">
              Waiting for opponent...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
