import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { socketService } from '@/services/socket';
import { Room } from '@/types/game';
import { Coins } from 'lucide-react';

interface TossPhaseProps {
  roomId: string;
  playerNumber: number;
  room: Room;
}

export default function TossPhase({ roomId, playerNumber, room }: TossPhaseProps) {
  const [selected, setSelected] = useState(false);

  const handleTossChoice = (choice: 'heads' | 'tails') => {
    setSelected(true);
    socketService.emit('tossChoice', { roomId, choice });
  };

  const isPlayer1 = playerNumber === 1;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Coins className="h-16 w-16 text-secondary animate-bounce-in" />
          </div>
          <CardTitle className="text-2xl">Toss Time!</CardTitle>
          <CardDescription>
            {isPlayer1 ? 'Choose Heads or Tails' : 'Waiting for Player 1 to choose...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPlayer1 && !selected ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleTossChoice('heads')}
                size="lg"
                className="h-20 text-lg"
              >
                Heads
              </Button>
              <Button
                onClick={() => handleTossChoice('tails')}
                size="lg"
                className="h-20 text-lg"
              >
                Tails
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {selected ? 'Flipping coin...' : 'Waiting for toss...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
