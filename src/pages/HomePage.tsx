import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { socketService } from '@/services/socket';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const socket = socketService.connect();

    if (socket) {
      const handleConnect = () => {
        setIsConnected(true);
        console.log('Connected to server');
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        console.log('Disconnected from server');
      };

      const handleConnectError = (error: Error) => {
        setIsConnected(false);
        console.error('Connection error:', error);
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);

      if (socket.connected) {
        setIsConnected(true);
      }

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
      };
    }
  }, []);

  const handleCreateRoom = () => {
    setIsCreating(true);
    const socket = socketService.connect();

    if (!socket) {
      setIsCreating(false);
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to server. Please make sure the backend is running.',
        variant: 'destructive',
      });
      return;
    }

    const timeout = setTimeout(() => {
      setIsCreating(false);
      toast({
        title: 'Connection Timeout',
        description: 'Server is not responding. Please check if backend is running on port 3001.',
        variant: 'destructive',
      });
    }, 5000);

    socket.once('roomCreated', ({ roomId }: { roomId: string }) => {
      clearTimeout(timeout);
      setIsCreating(false);
      toast({
        title: 'Room Created',
        description: `Room code: ${roomId}`,
      });
      navigate(`/game/${roomId}`);
    });

    socket.on('connect_error', () => {
      clearTimeout(timeout);
      setIsCreating(false);
      toast({
        title: 'Connection Error',
        description: 'Cannot connect to server. Please start the backend server.',
        variant: 'destructive',
      });
    });

    if (socket.connected) {
      socketService.emit('createRoom');
    } else {
      socket.once('connect', () => {
        socketService.emit('createRoom');
      });
    }
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

    if (!socket) {
      setIsJoining(false);
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to server. Please make sure the backend is running.',
        variant: 'destructive',
      });
      return;
    }

    const timeout = setTimeout(() => {
      setIsJoining(false);
      toast({
        title: 'Connection Timeout',
        description: 'Server is not responding. Please check if backend is running on port 3001.',
        variant: 'destructive',
      });
    }, 5000);

    socket.once('playerJoined', () => {
      clearTimeout(timeout);
      setIsJoining(false);
      navigate(`/game/${roomCode.toUpperCase()}`);
    });

    socket.once('joinError', ({ error }: { error: string }) => {
      clearTimeout(timeout);
      setIsJoining(false);
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    });

    socket.on('connect_error', () => {
      clearTimeout(timeout);
      setIsJoining(false);
      toast({
        title: 'Connection Error',
        description: 'Cannot connect to server. Please start the backend server.',
        variant: 'destructive',
      });
    });

    if (socket.connected) {
      socketService.emit('joinRoom', { roomId: roomCode.toUpperCase() });
    } else {
      socket.once('connect', () => {
        socketService.emit('joinRoom', { roomId: roomCode.toUpperCase() });
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-5xl xl:text-6xl font-bold text-primary">
              🏏 Cricket Hand-Game Arena
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-sm">
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </Badge>
          </div>
          {!isConnected && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Backend server is not running. Please start the backend server first.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Run: <code className="bg-muted px-2 py-1 rounded">cd backend && npm install && npm start</code>
              </p>
            </div>
          )}
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
                disabled={isCreating || !isConnected}
                className="w-full h-14 text-lg"
                size="lg"
              >
                {isCreating ? 'Creating...' : 'Create New Room'}
              </Button>
              {!isConnected && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Start backend server to enable
                </p>
              )}
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
                disabled={isJoining || !roomCode.trim() || !isConnected}
                className="w-full h-14 text-lg"
                size="lg"
              >
                {isJoining ? 'Joining...' : 'Join Room'}
              </Button>
              {!isConnected && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Start backend server to enable
                </p>
              )}
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
