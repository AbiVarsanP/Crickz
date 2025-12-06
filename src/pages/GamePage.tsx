import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socketService } from '@/services/socket';
import { Room, BallResult, MatchResult } from '@/types/game';
import { useToast } from '@/hooks/use-toast';
import WaitingRoom from '@/components/game/WaitingRoom';
import TossPhase from '@/components/game/TossPhase';
import BatBowlChoice from '@/components/game/BatBowlChoice';
import GamePlay from '@/components/game/GamePlay';
import MatchResultDisplay from '@/components/game/MatchResultDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [playerNumber, setPlayerNumber] = useState<number>(0);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [lastBallResult, setLastBallResult] = useState<BallResult | null>(null);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('playerJoined', ({ room: updatedRoom, playerNumber: pNum }) => {
      setRoom(updatedRoom);
      setPlayerNumber(pNum);
    });

    socket.on('roomUpdate', ({ room: updatedRoom }) => {
      setRoom(updatedRoom);
    });

    socket.on('startToss', ({ message }) => {
      toast({
        title: 'Game Starting',
        description: message,
      });
    });

    socket.on('tossResult', ({ result, winnerId }) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, tossWinner: winnerId, state: 'batBowlChoice' };
      });
      
      const isWinner = socket.id === winnerId;
      toast({
        title: 'Toss Result',
        description: `${result.toUpperCase()}! ${isWinner ? 'You won!' : 'Opponent won!'}`,
      });
    });

    socket.on('inningsStart', ({ innings, targetScore, room: updatedRoom }) => {
      setRoom(updatedRoom);
      setLastBallResult(null);
      
      if (innings === 2) {
        toast({
          title: 'Second Innings',
          description: `Target: ${targetScore} runs`,
        });
      }
    });

    socket.on('ballResult', (result: BallResult) => {
      setLastBallResult(result);
      setRoom(result.room);
      
      if (result.isOut) {
        toast({
          title: 'WICKET!',
          description: 'Numbers matched!',
          variant: 'destructive',
        });
      }
    });

    socket.on('inningsComplete', ({ innings, score, wickets, overs }) => {
      toast({
        title: `Innings ${innings} Complete`,
        description: `Score: ${score}/${wickets} in ${overs} overs`,
      });
    });

    socket.on('matchComplete', (result: MatchResult) => {
      setMatchResult(result);
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, state: 'complete' };
      });
    });

    socket.on('joinError', ({ error }) => {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      navigate('/');
    });

    if (roomId) {
      socketService.emit('joinRoom', { roomId });
    }

    return () => {
      socket.off('playerJoined');
      socket.off('roomUpdate');
      socket.off('startToss');
      socket.off('tossResult');
      socket.off('inningsStart');
      socket.off('ballResult');
      socket.off('inningsComplete');
      socket.off('matchComplete');
      socket.off('joinError');
    };
  }, [roomId, navigate, toast]);

  const handleBackToHome = () => {
    socketService.disconnect();
    navigate('/');
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBackToHome}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-sm text-muted-foreground">
            Room Code: <span className="font-mono font-bold text-primary">{roomId}</span>
          </div>
        </div>

        {room.state === 'waiting' && (
          <WaitingRoom roomId={roomId || ''} playersCount={room.players.length} />
        )}

        {room.state === 'toss' && (
          <TossPhase
            roomId={roomId || ''}
            playerNumber={playerNumber}
            room={room}
          />
        )}

        {room.state === 'batBowlChoice' && (
          <BatBowlChoice
            roomId={roomId || ''}
            room={room}
            playerNumber={playerNumber}
          />
        )}

        {(room.state === 'innings1' || room.state === 'innings2') && (
          <GamePlay
            room={room}
            playerNumber={playerNumber}
            roomId={roomId || ''}
            lastBallResult={lastBallResult}
          />
        )}

        {room.state === 'complete' && matchResult && (
          <MatchResultDisplay
            result={matchResult}
            playerNumber={playerNumber}
            onPlayAgain={handleBackToHome}
          />
        )}
      </div>
    </div>
  );
}
