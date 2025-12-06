import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { socketService } from '@/services/socket';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateRoom = () => {
    setIsCreating(true);
    const socket = socketService.connect();

    socket.once('roomCreated', ({ roomId }: { roomId: string }) => {
      setIsCreating(false);
      toast({
        title: 'Room Created',
        description: `Room code: ${roomId}`,
      });
      navigate(`/game/${roomId}`);
    });

    socketService.emit('createRoom');
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a room code',
        variant: 'destructive',
      });
      return;
    }

    setIsJoining(true);
    const socket = socketService.connect();

    socket.once('playerJoined', () => {
      setIsJoining(false);
      navigate(`/game/${roomCode.toUpperCase()}`);
    });

    socket.once('joinError', ({ error }: { error: string }) => {
      setIsJoining(false);
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    });

    socketService.emit('joinRoom', { roomId: roomCode.toUpperCase() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl xl:text-6xl font-bold text-primary">
            🏏 Cricket Hand-Game Arena
          </h1>
          <p className="text-lg xl:text-xl text-muted-foreground">
            Challenge your friends in a thrilling cricket hand-game match!
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="animate-fade-in hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Create Room</CardTitle>
              <CardDescription>
                Start a new game and invite your friend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="w-full h-14 text-lg"
                size="lg"
              >
                {isCreating ? 'Creating...' : 'Create New Room'}
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-fade-in hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Join Room</CardTitle>
              <CardDescription>
                Enter the room code to join an existing game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="h-12 text-lg"
                maxLength={6}
              />
              <Button
                onClick={handleJoinRoom}
                disabled={isJoining || !roomCode.trim()}
                className="w-full h-14 text-lg"
                size="lg"
              >
                {isJoining ? 'Joining...' : 'Join Room'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 animate-fade-in">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">1.</span>
              <p>Create or join a room with your friend</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">2.</span>
              <p>Win the toss and choose to bat or bowl first</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">3.</span>
              <p>Select numbers 1-6 each ball. If numbers match, you're OUT!</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg">4.</span>
              <p>Score runs and defend your total. 5 wickets or 3 overs per innings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
