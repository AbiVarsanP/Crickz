import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private emitQueue: Array<{ event: string; data?: any }> = [];

  connect() {
    if (!this.socket) {
      // Before opening a socket, do a quick health probe. If backend is up
      // we allow socket to auto-connect immediately. If it's not reachable
      // we create the socket with `autoConnect: false` and poll the health
      // endpoint, connecting as soon as it becomes available. This avoids
      // long initial connection timeouts when the backend is cold-starting.
      const healthProbe = async (timeout = 1000) => {
        try {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          const res = await fetch(`${SOCKET_URL.replace(/\/$/, '')}/health`, { signal: controller.signal });
          clearTimeout(id);
          return res.ok;
        } catch (e) {
          return false;
        }
      };

      const openSocket = (autoConnect = true) => io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        // start with faster retries to recover quickly
        reconnectionAttempts: 10,
        reconnectionDelay: 500,
        randomizationFactor: 0.2,
        autoConnect
      });

      // immediate probe (short). If healthy, create socket normally.
      healthProbe(800).then((healthy) => {
        if (healthy) {
          this.socket = openSocket(true);
        } else {
          // backend not yet healthy — create socket but don't auto-connect,
          // then poll health and connect when ready.
          this.socket = openSocket(false);
          const poll = setInterval(async () => {
            const ok = await healthProbe(1000);
            if (ok && this.socket) {
              clearInterval(poll);
              try { this.socket.connect(); } catch (e) { /* ignore */ }
            }
          }, 1500);
        }
      }).catch(() => {
        // fallback: create socket with default autoConnect true
        this.socket = openSocket(true);
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        // flush queued emits
        while (this.emitQueue.length > 0) {
          const item = this.emitQueue.shift();
          if (item) this.socket?.emit(item.event, item.data);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }
    return this.socket;
  }

  async connectAsync(timeout = 10000): Promise<Socket> {
    const s = this.connect();
    if (!s) throw new Error('Failed to create socket');
    if (s.connected) return s;

    return new Promise<Socket>((resolve, reject) => {
      const onConnect = () => {
        cleanup();
        resolve(s);
      };
      const onError = (err: any) => {
        cleanup();
        reject(err || new Error('Socket connect error'));
      };
      const t = setTimeout(() => onError(new Error('Socket connect timeout')) , timeout);
      const cleanup = () => {
        clearTimeout(t);
        s.off('connect', onConnect);
        s.off('connect_error', onError);
      };
      s.on('connect', onConnect);
      s.on('connect_error', onError);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.emitQueue = [];
  }

  getSocket() {
    return this.socket;
  }

  emit(event: string, data?: any) {
    const s = this.socket;
    if (s && s.connected) {
      s.emit(event, data);
      return;
    }
    // queue the emit until connected
    this.emitQueue.push({ event, data });
    // ensure socket is created and will flush when connected
    this.connect();
  }

  on(event: string, callback: (...args: any[]) => void) {
    const s = this.connect();
    s.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    const s = this.socket;
    if (s) s.off(event, callback);
  }
}

export const socketService = new SocketService();
