import { io } from 'socket.io-client';

const SERVER = process.env.SOCKET_URL || 'http://localhost:3001';

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

async function run() {
  console.log('Connecting client A (creator) to', SERVER);
  const a = io(SERVER, { transports: ['websocket'], reconnection: false });

  a.on('connect', () => console.log('[A] connected', a.id));
  a.on('roomCreated', (payload) => {
    console.log('[A] roomCreated', payload);
  });
  a.on('roomUpdate', (p) => console.log('[A] roomUpdate', p));

  await new Promise((res) => a.once('connect', res));

  // Create room
  a.emit('createRoom', { name: 'Creator' });

  const roomId = await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('roomCreated timeout')), 5000);
    a.once('roomCreated', (payload) => { clearTimeout(t); resolve(payload.roomId); });
  });

  console.log('Room created:', roomId);

  // Now connect client B (simulating mobile join)
  console.log('Connecting client B (joiner) to', SERVER);
  const b = io(SERVER, { transports: ['websocket'], reconnection: false });

  b.on('connect', () => console.log('[B] connected', b.id));
  b.on('playerJoined', (payload) => console.log('[B] playerJoined', payload));
  b.on('joinError', (payload) => console.log('[B] joinError', payload));
  b.on('roomUpdate', (p) => console.log('[B] roomUpdate', p));
  b.on('readyForSetup', (p) => console.log('[B] readyForSetup', p));

  await new Promise((res) => b.once('connect', res));

  // Emit join
  b.emit('joinRoom', { roomId: roomId, name: 'MobileTester' });

  // Wait a bit for server responses
  await delay(3000);

  console.log('Disconnecting clients');
  try { a.disconnect(); } catch (e) {}
  try { b.disconnect(); } catch (e) {}
  process.exit(0);
}

run().catch((e) => {
  console.error('Simulation error', e);
  process.exit(1);
});
