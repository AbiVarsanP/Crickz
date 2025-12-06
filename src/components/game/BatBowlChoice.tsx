import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { socketService } from '@/services/socket';
import { Room } from '@/types/game';
import { Target, Shield } from 'lucide-react';

interface BatBowlChoiceProps {
  roomId: string;
  room: Room;
  playerNumber: number;
}

export default function BatBowlChoice({ roomId, room, playerNumber }: BatBowlChoiceProps) {
  const [selected, setSelected] = useState(false);
  const socket = socketService.getSocket();
  const isTossWinner = socket?.id === room.tossWinner;

  const handleChoice = (choice: 'bat' | 'bowl') => {
    setSelected(true);
    socketService.emit('batBowlChoice', { roomId, choice });
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isTossWinner ? 'You Won the Toss!' : 'Opponent Won the Toss'}
          </CardTitle>
          <CardDescription>
            {isTossWinner ? 'Choose to Bat or Bowl first' : 'Waiting for opponent to choose...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTossWinner && !selected ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleChoice('bat')}
                size="lg"
                className="h-24 flex-col gap-2"
              >
                <Target className="h-8 w-8" />
                <span className="text-lg">Bat First</span>
              </Button>
              <Button
                onClick={() => handleChoice('bowl')}
                size="lg"
                variant="secondary"
                className="h-24 flex-col gap-2"
              >
                <Shield className="h-8 w-8" />
                <span className="text-lg">Bowl First</span>
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                {selected ? 'Starting innings...' : 'Waiting for choice...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
