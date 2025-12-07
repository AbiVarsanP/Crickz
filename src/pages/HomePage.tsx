import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { socketService } from '@/services/socket';
import { useToast } from '@/hooks/use-toast';
// Badge not used in this page
import FuturisticLayout from '@/components/layout/FuturisticLayout';

export default function HomePage() {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [totalOvers, setTotalOvers] = useState<number>(5);
  const [maxWickets, setMaxWickets] = useState<number>(5);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const existing = localStorage.getItem('hc_username');
    if (existing) setUserName(existing);

    const socket = socketService.connect();
    if (!socket) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // clean up
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const handleCreateRoom = () => {
    setIsCreating(true);
    const socket = socketService.connect();
    if (!socket) {
      toast({ title: 'Connection Error', description: 'Unable to connect to server', variant: 'destructive' });
      setIsCreating(false);
      return;
    }

    const timeout = setTimeout(() => {
      setIsCreating(false);
      toast({ title: 'Timeout', description: 'Server did not respond. Try again.', variant: 'destructive' });
    }, 5000);

    socket.once('roomCreated', (payload: any) => {
      clearTimeout(timeout);
      setIsCreating(false);
      if (userName && userName.trim()) localStorage.setItem('hc_username', userName.trim());
      navigate(`/game/${payload.roomId}`, { state: { room: payload.room, playerNumber: payload.playerNumber, userName } });
    });

    socket.once('createError', (payload: any) => {
      clearTimeout(timeout);
      setIsCreating(false);
      toast({ title: 'Error', description: payload?.error || 'Failed to create room', variant: 'destructive' });
    });

    if (socket.connected) {
      socketService.emit('createRoom', { name: userName || 'Player 1', totalOvers, maxWickets });
    } else {
      socket.once('connect', () => {
        socketService.emit('createRoom', { name: userName || 'Player 1', totalOvers, maxWickets });
      });
    }
  };

  const handleJoinRoom = () => {
    if (!roomCode || !roomCode.trim()) return;
    setIsJoining(true);
    const socket = socketService.connect();
    if (!socket) {
      toast({ title: 'Connection Error', description: 'Unable to connect to server', variant: 'destructive' });
      setIsJoining(false);
      return;
    }

    const timeout = setTimeout(() => {
      setIsJoining(false);
      toast({ title: 'Timeout', description: 'Server did not respond. Try again.', variant: 'destructive' });
    }, 5000);

    socket.once('playerJoined', (payload: any) => {
      clearTimeout(timeout);
      setIsJoining(false);
      if (userName && userName.trim()) localStorage.setItem('hc_username', userName.trim());
      navigate(`/game/${roomCode.toUpperCase()}`, { state: { room: payload.room, playerNumber: payload.playerNumber, userName } });
    });

    socket.once('joinError', (payload: any) => {
      clearTimeout(timeout);
      setIsJoining(false);
      toast({ title: 'Error', description: payload?.error || 'Failed to join room', variant: 'destructive' });
    });

    if (socket.connected) {
      socketService.emit('joinRoom', { roomId: roomCode.toUpperCase(), name: userName || 'Player 2' });
    } else {
      socket.once('connect', () => {
        socketService.emit('joinRoom', { roomId: roomCode.toUpperCase(), name: userName || 'Player 2' });
      });
    }
  };

  return (
    <FuturisticLayout connected={isConnected}>
      <div className="flex items-center justify-center py-10 sm:py-16">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div className="space-y-4 flex flex-col justify-center">
          <Card className="p-3 sm:p-4 rounded-xl shadow-lg neon-hud flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">Create a Quick Match</CardTitle>
              <CardDescription className="text-sm text-slate-300">Choose overs and wickets, then invite a friend with the room code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 mt-2 flex-1">
              <Input placeholder="Your name (optional)" value={userName} onChange={(e) => setUserName(e.target.value)} className="h-12 w-full" />
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-300">Overs</label>
                  <div className="flex items-center space-x-1">
                    <button
                      aria-label="Decrease overs"
                      onClick={() => setTotalOvers((v) => Math.max(1, Number(v) - 1))}
                      className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <Input aria-label="Overs" type="text" value={String(totalOvers)} onChange={(e) => setTotalOvers(Number(e.target.value) || 1)} className="w-16 sm:w-20 text-center py-1 text-sm" />
                    <button
                      aria-label="Increase overs"
                      onClick={() => setTotalOvers((v) => Math.min(20, Number(v) + 1))}
                      className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-300">Wickets</label>
                  <div className="flex items-center space-x-1">
                    <button
                      aria-label="Decrease wickets"
                      onClick={() => setMaxWickets((v) => Math.max(1, Number(v) - 1))}
                      className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <Input aria-label="Wickets" type="text" value={String(maxWickets)} onChange={(e) => setMaxWickets(Number(e.target.value) || 1)} className="w-16 sm:w-20 text-center py-1 text-sm" />
                    <button
                      aria-label="Increase wickets"
                      onClick={() => setMaxWickets((v) => Math.min(10, Number(v) + 1))}
                      className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={handleCreateRoom} disabled={isCreating || !isConnected} className="w-full h-12 text-base sm:text-lg bg-white text-black hover:bg-gray-100 rounded-lg">
                  {isCreating ? 'Creating...' : 'Create New Room'}
                </Button>
              </div>
              {!isConnected && <p className="text-xs text-muted-foreground mt-2">Start backend server to enable play</p>}
            </CardContent>
          </Card>

        </div>

        <div className="space-y-4 flex flex-col justify-center">
          <Card className="p-3 sm:p-4 rounded-xl shadow-lg neon-hud flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">Join an Existing Match</CardTitle>
              <CardDescription className="text-sm text-slate-300">Enter the room code your friend shared to jump into the match.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 mt-2 flex-1">
              <Input placeholder="Your name (optional)" value={userName} onChange={(e) => setUserName(e.target.value)} className="h-12 w-full" />
              <Input placeholder="Enter room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} className="h-12 text-lg w-full" maxLength={6} />
              <div className="pt-4">
                <Button onClick={handleJoinRoom} disabled={isJoining || !roomCode.trim() || !isConnected} className="w-full h-12 text-base sm:text-lg bg-white text-black hover:bg-gray-100 rounded-lg">
                  {isJoining ? 'Joining...' : 'Join Room'}
                </Button>
              </div>
              {!isConnected && <p className="text-xs text-muted-foreground mt-2">Start backend server to enable</p>}
            </CardContent>
          </Card>

          
        </div>
      </div>
    </div>
    </FuturisticLayout>
  );
}
