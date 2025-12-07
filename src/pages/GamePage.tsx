import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { socketService } from '@/services/socket';
import { Room, BallResult, MatchResult, GameSettings } from '@/types/game';
import { useToast } from '@/hooks/use-toast';
import WaitingRoom from '@/components/game/WaitingRoom';
import GameSetup from '@/components/game/GameSetup';
import TossPhase from '@/components/game/TossPhase';
import BatBowlChoice from '@/components/game/BatBowlChoice';
import GamePlay from '@/components/game/GamePlay';
import MatchResultDisplay from '@/components/game/MatchResultDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import FuturisticLayout from '@/components/layout/FuturisticLayout';

export default function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(location.state?.room || null);
  const [playerNumber, setPlayerNumber] = useState<number>(location.state?.playerNumber || 0);
  const incomingUserName = location.state?.userName as string | undefined;
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [lastBallResult, setLastBallResult] = useState<BallResult | null>(null);
  const [inningsPopup, setInningsPopup] = useState<{ open: boolean; innings?: number; score?: number; wickets?: number; overs?: string }>(() => ({ open: false }));

  useEffect(() => {
    const socket = socketService.connect();

    const localName = typeof window !== 'undefined' ? localStorage.getItem('hc_username') : null;
    console.log('[GamePage] incomingUserName=', incomingUserName, 'localName=', localName, 'initial room prop=', location.state?.room);

    // If we already have a room from navigation state and a stored name, apply it immediately
    if (localName && room) {
      setRoom((prev) => {
        if (!prev) return prev;
        const updated = { ...prev } as Room;
        if (playerNumber === 1) {
          updated.player1 = { ...updated.player1, name: localName };
        } else if (playerNumber === 2) {
          updated.player2 = { ...updated.player2, name: localName };
        }
        return updated;
      });
    }

    socket.on('playerJoined', ({ room: updatedRoom, playerNumber: pNum }) => {
      console.log('[GamePage] playerJoined event received, pNum=', pNum, 'player1.name=', updatedRoom?.player1?.name, 'player2.name=', updatedRoom?.player2?.name, 'room=', updatedRoom);
      // apply local name if available for immediate display
      if (localName) {
        try {
          if (pNum === 1) updatedRoom.player1 = { ...updatedRoom.player1, name: localName };
          else if (pNum === 2) updatedRoom.player2 = { ...updatedRoom.player2, name: localName };
          console.log('[GamePage] applied localName to joined player:', localName);
        } catch (e) { console.error(e); }
      }
      setRoom(updatedRoom);
      setPlayerNumber(pNum);
    });

    socket.on('roomUpdate', ({ room: updatedRoom }) => {
      console.log('[GamePage] roomUpdate event received, socket.id=', socket.id, 'player1.name=', updatedRoom?.player1?.name, 'player2.name=', updatedRoom?.player2?.name, 'room=', updatedRoom);
      // prefer local name for the current socket player to avoid flashes
      if (localName) {
        try {
          if (socket.id === updatedRoom.player1.id) {
            updatedRoom.player1 = { ...updatedRoom.player1, name: localName };
            console.log('[GamePage] applied localName to player1');
          } else if (socket.id === updatedRoom.player2.id) {
            updatedRoom.player2 = { ...updatedRoom.player2, name: localName };
            console.log('[GamePage] applied localName to player2');
          }
        } catch (e) { console.error(e); }
      }
      setRoom(updatedRoom);
    });

    socket.on('readyForSetup', ({ message }) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, state: 'setup' };
      });
      toast({
        title: 'Ready',
        description: message,
      });
    });

    socket.on('gameConfigured', ({ room: updatedRoom }) => {
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

    socket.on('inningsComplete', ({ innings, score, wickets, overs, room: updatedRoom }: any) => {
      if (updatedRoom) setRoom(updatedRoom);
      // show a large centered popup
      setInningsPopup({ open: true, innings, score, wickets, overs });
      toast({
        title: `Innings ${innings} Complete`,
        description: `Score: ${score}/${wickets} in ${overs} overs`,
      });
      // auto-close popup after 3s
      setTimeout(() => setInningsPopup((s) => ({ ...s, open: false })), 3000);
    });

    socket.on('roleSwitch', ({ room: updatedRoom, message } = {}) => {
      if (updatedRoom) setRoom(updatedRoom);
      if (message) {
        toast({ title: 'Role Switch', description: message });
      }
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

    // Only join if not already in room (i.e., coming from direct URL, not after creating)
    if (roomId && !location.state?.room) {
      socketService.emit('joinRoom', { roomId });
    }

    // If we navigated here with a userName (just created or joined), apply it locally
    if (incomingUserName && room) {
      setRoom((prev) => {
        if (!prev) return prev;
        const updated = { ...prev } as Room;
        if (playerNumber === 1) {
          updated.player1 = { ...updated.player1, name: incomingUserName };
        } else if (playerNumber === 2) {
          updated.player2 = { ...updated.player2, name: incomingUserName };
        }
        return updated;
      });
    }

    // If we have a stored local name, explicitly tell server to set it (helps ensure server state)
    if (roomId) {
      const localName = typeof window !== 'undefined' ? localStorage.getItem('hc_username') : null;
      if (localName) {
        console.log('[GamePage] emitting setName to server with', localName);
        socketService.emit('setName', { roomId, name: localName });
      }
    }

    return () => {
      socket.off('playerJoined');
      socket.off('roomUpdate');
      socket.off('readyForSetup');
      socket.off('gameConfigured');
      socket.off('startToss');
      socket.off('tossResult');
      socket.off('inningsStart');
      socket.off('ballResult');
      socket.off('inningsComplete');
      socket.off('matchComplete');
      socket.off('joinError');
    };
  }, [roomId, navigate, toast, location.state]);

  const handleGameSetup = (settings: GameSettings) => {
    socketService.emit('setupGame', { roomId, settings });
  };

  const handleBackToHome = () => {
    socketService.disconnect();
    navigate('/');
  };

  if (!room) {
    return (
      <FuturisticLayout connected>
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Connecting to room...</p>
          </div>
        </div>
      </FuturisticLayout>
    );
  }

  return (
    <FuturisticLayout connected>
      <div className="p-4">
        <div className="max-w-6xl mx-auto space-y-6 pb-6">
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
          <WaitingRoom roomId={roomId || ''} playersCount={room.players.length} room={room} />
        )}

        {room.state === 'setup' && (
          <GameSetup 
            roomId={roomId || ''} 
            onSetupComplete={handleGameSetup}
            isPlayer1={playerNumber === 1}
            room={room}
          />
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

        {/* Innings complete popup */}
        <Dialog open={inningsPopup.open}>
          <DialogContent className="max-w-md text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl">Innings {inningsPopup.innings} Complete</DialogTitle>
              <DialogDescription className="mt-2 text-lg">
                Score: <strong>{inningsPopup.score}/{inningsPopup.wickets}</strong>
                <br />
                Overs: <strong>{inningsPopup.overs}</strong>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="mx-auto">
                <Button onClick={() => setInningsPopup({ open: false })} className="mt-4">Continue</Button>
              </div>
            </DialogFooter>
            <DialogClose />
          </DialogContent>
        </Dialog>

        {room.state === 'complete' && matchResult && (
          <MatchResultDisplay
            result={matchResult}
            playerNumber={playerNumber}
            onPlayAgain={handleBackToHome}
          />
        )}
        </div>
      </div>
    </FuturisticLayout>
  );
}
