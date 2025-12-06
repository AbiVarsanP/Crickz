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

  const getOvers = (balls: number) => {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return `${overs}.${remainingBalls}`;
  };

  const battingPlayer = room.player1.isBatting ? room.player1 : room.player2;
  const bowlingPlayer = room.player1.isBatting ? room.player2 : room.player1;

  return (
    <div className="space-y-6 animate-fade-in">
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
              Batting: {battingPlayer.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-2xl font-bold">
                <span>Score:</span>
                <span className="text-primary">{battingPlayer.score}/{battingPlayer.wickets}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Overs:</span>
                <span>{getOvers(battingPlayer.balls)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Balls:</span>
                <span>{battingPlayer.balls}/18</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Wickets Left:</span>
                <span>{5 - battingPlayer.wickets}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Bowling: {bowlingPlayer.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Wickets Taken:</span>
                <span className="font-bold text-secondary">{battingPlayer.wickets}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Runs Conceded:</span>
                <span>{battingPlayer.score}</span>
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
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Button
                key={num}
                onClick={() => handleNumberSelect(num)}
                disabled={selectedNumber !== null}
                size="lg"
                className={`h-20 text-2xl font-bold ${
                  selectedNumber === num ? 'animate-pulse-glow' : ''
                }`}
                variant={selectedNumber === num ? 'default' : 'outline'}
              >
                {num}
              </Button>
            ))}
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
