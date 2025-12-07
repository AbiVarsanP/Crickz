import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private emitQueue: Array<{ event: string; data?: any }> = [];

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        // tolerate slower backend startups with more attempts and longer delays
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
        // exponential backoff factor
        randomizationFactor: 0.2
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
