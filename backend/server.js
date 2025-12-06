import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socketHandlers.js';

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-frontend-domain.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('netlify.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.includes('netlify.app')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Cricket Hand-Game Arena Server' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
