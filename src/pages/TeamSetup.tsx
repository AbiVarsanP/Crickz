import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FuturisticLayout from '@/components/layout/FuturisticLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { socketService } from '@/services/socket';
import { useToast } from '@/hooks/use-toast';

export default function TeamSetup() {
  const [userName, setUserName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [totalOvers, setTotalOvers] = useState<number>(5);
  const [maxWickets, setMaxWickets] = useState<number>(5);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const socket = socketService.connect();
    if (!socket) return;

    socket.on('roomCreated', (payload: any) => {
      const teamAPlayers = teamA.split(',').map(s => s.trim()).filter(Boolean);
      const teamBPlayers = teamB.split(',').map(s => s.trim()).filter(Boolean);
      const settings = {
        gameMode: 'team',
        totalOvers,
        teamAPlayers,
        teamBPlayers
      };
      socketService.emit('setupGame', { roomId: payload.roomId, settings });
    });

    socket.on('gameConfigured', ({ room }: any) => {
      toast({ title: 'Team Game Configured', description: 'Redirecting to game...' });
      navigate(`/game/${room.roomId}`, { state: { room, playerNumber: 1, userName } });
    });

    socket.on('joinError', ({ error }: any) => {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      setIsJoining(false);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('gameConfigured');
      socket.off('joinError');
    };
  }, [teamA, teamB, totalOvers, maxWickets, navigate, toast, userName]);

  const handleCreateTeamRoom = () => {
    setIsCreating(true);
    const socket = socketService.connect();
    if (!socket) {
      setIsCreating(false);
      toast({ title: 'Connection Error', description: 'Unable to connect to server.', variant: 'destructive' });
      return;
    }

    const timeout = setTimeout(() => {
      setIsCreating(false);
      toast({ title: 'Timeout', description: 'Server did not respond.', variant: 'destructive' });
    }, 5000);

    socket.once('roomCreated', (payload: any) => {
      clearTimeout(timeout);
      setIsCreating(false);
      toast({ title: 'Room Created', description: `Room code: ${payload.roomId}` });
    });

    if (socket.connected) {
      if (userName && userName.trim()) localStorage.setItem('hc_username', userName.trim());
      socketService.emit('createRoom', { name: userName || 'You', totalOvers, maxWickets });
    } else {
      socket.once('connect', () => {
        if (userName && userName.trim()) localStorage.setItem('hc_username', userName.trim());
        socketService.emit('createRoom', { name: userName || 'You', totalOvers, maxWickets });
      });
    }
  };

  const handleJoinTeamRoom = () => {
    if (!roomCode.trim()) {
      toast({ title: 'Error', description: 'Please enter a room code', variant: 'destructive' });
      return;
    }

    setIsJoining(true);
    const socket = socketService.connect();
    if (!socket) {
      setIsJoining(false);
      toast({ title: 'Connection Error', description: 'Unable to connect to server.', variant: 'destructive' });
      return;
    }

    const timeout = setTimeout(() => {
      setIsJoining(false);
      toast({ title: 'Timeout', description: 'Server did not respond.', variant: 'destructive' });
    }, 5000);

    socket.once('playerJoined', (payload: any) => {
      clearTimeout(timeout);
      setIsJoining(false);
      // persist last room so navigation or reload on mobile can recover state
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hc_last_room', JSON.stringify({ room: payload.room, playerNumber: payload.playerNumber, userName }));
        }
      } catch (e) { console.warn('Failed to persist room to localStorage', e); }
      navigate(`/game/${roomCode.toUpperCase()}`, { state: { room: payload.room, playerNumber: payload.playerNumber, userName } });
    });

    if (socket.connected) {
      if (userName && userName.trim()) localStorage.setItem('hc_username', userName.trim());
      socketService.emit('joinRoom', { roomId: roomCode.toUpperCase(), name: userName || 'You' });
    } else {
      socket.once('connect', () => {
        if (userName && userName.trim()) localStorage.setItem('hc_username', userName.trim());
        socketService.emit('joinRoom', { roomId: roomCode.toUpperCase(), name: userName || 'You' });
      });
    }
  };

  return (
    <FuturisticLayout connected>
      <div className="h-full bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Mode - Setup</CardTitle>
              <CardDescription>Create teams and start a team match</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Your name (optional)" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <label className="text-sm">Overs:</label>
                  <div className="flex items-center space-x-1">
                    <button
                      aria-label="Decrease overs"
                      onClick={() => setTotalOvers((v) => Math.max(1, Number(v) - 1))}
                      className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <Input
                      type="text"
                      value={String(totalOvers)}
                      onChange={(e: any) => setTotalOvers(Number(e.target.value) || 1)}
                      className="w-12 sm:w-16 p-1 text-sm text-center"
                    />
                    <button
                      aria-label="Increase overs"
                      onClick={() => setTotalOvers((v) => Math.min(20, Number(v) + 1))}
                      className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>

                  <label className="text-sm">Wickets:</label>
                  <div className="flex items-center space-x-1">
                    <button
                      aria-label="Decrease wickets"
                      onClick={() => setMaxWickets((v) => Math.max(1, Number(v) - 1))}
                      className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <Input
                      type="text"
                      value={String(maxWickets)}
                      onChange={(e: any) => setMaxWickets(Number(e.target.value) || 1)}
                      className="w-12 sm:w-16 p-1 text-sm text-center"
                    />
                    <button
                      aria-label="Increase wickets"
                      onClick={() => setMaxWickets((v) => Math.min(10, Number(v) + 1))}
                      className="h-7 w-7 rounded-md bg-white text-black flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Team A players (comma separated)</label>
                  <textarea value={teamA} onChange={(e) => setTeamA(e.target.value)} className="w-full p-2 border rounded" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Team B players (comma separated)</label>
                  <textarea value={teamB} onChange={(e) => setTeamB(e.target.value)} className="w-full p-2 border rounded" rows={3} />
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateTeamRoom} disabled={isCreating}>Create Team Room</Button>
                    <Button onClick={() => navigate('/')} className="bg-transparent hover:bg-[hsl(var(--accent)/0.06)]">Back</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Join Team Room</CardTitle>
              <CardDescription>Enter code to join existing team room</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Your name (optional)" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <Input placeholder="Room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} />
                <Button onClick={handleJoinTeamRoom} disabled={isJoining || !roomCode.trim()}>Join</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </FuturisticLayout>
  );
}
