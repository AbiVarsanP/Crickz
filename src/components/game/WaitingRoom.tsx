import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface WaitingRoomProps {
  roomId: string;
  playersCount: number;
}

export default function WaitingRoom({ roomId, playersCount }: WaitingRoomProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Waiting for Players</CardTitle>
          <CardDescription>Share the room code with your friend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Room Code</p>
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
              <p className="text-3xl font-mono font-bold text-primary tracking-wider">
                {roomId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${playersCount >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <span className="text-sm">Player 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${playersCount >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <span className="text-sm">Player 2</span>
            </div>
          </div>

          <div className="text-center">
            <div className="animate-pulse">
              <p className="text-sm text-muted-foreground">
                {playersCount === 1 ? 'Waiting for opponent...' : 'Starting game...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
