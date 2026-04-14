import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai';
import timetableRoutes from './routes/timetable';
import lendBorrowRoutes from './routes/lendBorrow';
import lostFoundRoutes from './routes/lostFound';
import debugRoutes from './routes/debug';

import { Server } from 'socket.io';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 5000;
const SOCKET_PORT = 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Http Server and Socket.io integrated
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('👤 New client connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`🏠 user ${socket.id} joined room: ${roomId}`);
  });

  socket.on('send_message', (data) => {
    // data: { roomId, senderId, text, timestamp }
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('👤 User disconnected');
  });
});

// Routes
app.get('/', (req, res) => {
  res.status(200).send('🚀 UniMate API is running perfectly! Check /health for status.');
});
app.use('/api/ai', aiRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/lend-borrow', lendBorrowRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/debug', debugRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'UniMate Backend is running' });
});

// Start the integrated server
httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 UniMate Backend & Socket server running on port ${PORT}`);
});

