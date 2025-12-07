import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { socketService } from '@/services/socket';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');

  const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL as string) || 'http://localhost:3001';

  useEffect(() => {
    let mounted = true;
    let interval: any = null;

    const checkHealth = async () => {
      try {
        // prefer health endpoint if reachable
        const url = `${SOCKET_URL.replace(/\/$/, '')}/health`;
        const res = await fetch(url, { method: 'GET' });
        if (!mounted) return;
        if (res.ok) {
          setStatus('online');
          return;
        }
      } catch (e) {
        // ignore, fallback to socket state
      }

      const sock = socketService.getSocket();
      if (sock && sock.connected) {
        setStatus('online');
      } else if (sock && !sock.connected) {
        setStatus('connecting');
      } else {
        setStatus('offline');
      }
    };

    // initial check
    checkHealth();

    // poll every 5s
    interval = setInterval(checkHealth, 5000);

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, []);

  if (status === 'online') {
    return <Badge variant="default" className="text-xs">ONLINE</Badge>;
  }

  if (status === 'connecting') {
    return <Badge variant="secondary" className="text-xs">CONNECTING</Badge>;
  }

  return <Badge variant="destructive" className="text-xs">OFFLINE</Badge>;
}
