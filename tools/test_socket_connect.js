// Quick test script to verify socket.io connectivity to your deployed backend.
// Usage: node tools/test_socket_connect.js https://crickz.onrender.com

import { io } from 'socket.io-client';
import https from 'https';

const url = process.argv[2] || 'https://crickz.onrender.com';

console.log('Testing socket connection to', url);

const socket = io(url, {
  transports: ['websocket', 'polling'],
  reconnection: false,
  timeout: 5000
});

socket.on('connect', () => {
  console.log('Connected, id=', socket.id);
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('connect_error:', err && err.message ? err.message : err);
  process.exit(2);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

// Also do a simple HTTP health check
try {
  const healthUrl = new URL('/health', url);
  const req = https.request(healthUrl, (res) => {
    console.log('/health status:', res.statusCode);
    res.on('data', () => {});
  });
  req.on('error', (e) => console.error('health check error:', e.message));
  req.end();
} catch (e) {
  console.error('health check setup error:', e && e.message ? e.message : e);
}
