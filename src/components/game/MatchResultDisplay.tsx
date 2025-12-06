import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MatchResult } from '@/types/game';
import { Trophy, Target } from 'lucide-react';

interface MatchResultDisplayProps {
  result: MatchResult;
  playerNumber: number;
  onPlayAgain: () => void;
}

export default function MatchResultDisplay({ result, playerNumber, onPlayAgain }: MatchResultDisplayProps) {
  const getWinnerText = () => {
    if (result.winner === 'tie') {
      return "It's a Tie!";
    }
    const wonAsPlayer1 = result.winner === 'player1' && playerNumber === 1;
    const wonAsPlayer2 = result.winner === 'player2' && playerNumber === 2;
    return wonAsPlayer1 || wonAsPlayer2 ? 'You Won!' : 'You Lost!';
  };

  const isWinner = () => {
    if (result.winner === 'tie') return null;
    return (result.winner === 'player1' && playerNumber === 1) || 
           (result.winner === 'player2' && playerNumber === 2);
  };

  const winner = isWinner();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl animate-bounce-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className={`h-20 w-20 ${winner === true ? 'text-primary' : winner === false ? 'text-muted' : 'text-secondary'}`} />
          </div>
          <CardTitle className="text-4xl mb-2">{getWinnerText()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className={playerNumber === 1 ? 'border-primary border-2' : ''}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Player 1 {playerNumber === 1 && '(You)'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-bold text-xl">{result.player1.score}/{result.player1.wickets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overs:</span>
                  <span>{result.player1.overs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Balls:</span>
                  <span>{result.player1.balls}</span>
                </div>
              </CardContent>
            </Card>

            <Card className={playerNumber === 2 ? 'border-primary border-2' : ''}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Player 2 {playerNumber === 2 && '(You)'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-bold text-xl">{result.player2.score}/{result.player2.wickets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overs:</span>
                  <span>{result.player2.overs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Balls:</span>
                  <span>{result.player2.balls}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onPlayAgain}
              size="lg"
              className="w-full xl:w-auto px-8"
            >
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
