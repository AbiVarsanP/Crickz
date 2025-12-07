import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GameSettings } from '@/types/game';

interface GameSetupProps {
  roomId: string;
  onSetupComplete: (settings: GameSettings) => void;
  isPlayer1: boolean;
  room?: any;
}

export default function GameSetup({ roomId, onSetupComplete, isPlayer1 }: GameSetupProps) {
  const [totalOvers, setTotalOvers] = useState(5);

  const handleSubmit = () => {
    const settings: GameSettings = {
      gameMode: 'solo',
      totalOvers
    };
    onSetupComplete(settings);
  };

  if (!isPlayer1) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Waiting for Game Setup</CardTitle>
            <CardDescription>{room?.player1?.name ? `${room.player1.name} is configuring the game...` : 'Player 1 is configuring the game...'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Game Setup</CardTitle>
          <CardDescription>Room Code: {roomId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg">Select Number of Overs</Label>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">{totalOvers} Overs</span>
              <span className="text-sm text-muted-foreground">({totalOvers * 6} balls)</span>
            </div>
            <Slider
              value={[totalOvers]}
              onValueChange={(v) => setTotalOvers(v[0])}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onSetupComplete({ gameMode: 'solo', totalOvers })} className="w-full">Start Game</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
