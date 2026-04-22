import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai';
import timetableRoutes from './routes/timetable';
import lendBorrowRoutes from './routes/lendBorrow';
import lostFoundRoutes from './routes/lostFound';
import debugRoutes from './routes/debug';
import { createClient } from '@supabase/supabase-js';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Supabase Admin
const SUPABASE_URL = process.env.SUPABASE_URL || "https://stzbxkqqfjtpbfruqaag.supabase.co"; 
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""; 

if (!SUPABASE_KEY) {
  console.warn("⚠️ Warning: No Supabase Key found. Persistence will fail.");
}
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

  socket.on('send_message', async (data) => {
    console.log(`📩 Received message for room: ${data.roomId}`);
    
    // 1. Relay immediately for responsiveness
    io.to(data.roomId).emit('receive_message', data);
    console.log(`📤 Relayed to room ${data.roomId}`);

    // 2. Persist in background
    try {
      const { error } = await supabaseAdmin
        .from('chat_messages')
        .insert([{
          room_id: data.roomId,
          sender_id: data.senderId,
          text: data.text,
          created_at: data.timestamp
        }]);
      
      console.log(`💾 Attempting to save message to room: ${data.roomId} from sender: ${data.senderId}`);
      
      if (error) {
        console.error('❌ DB Save Error:', error.message);
      } else {
        console.log('✅ Persisted to DB');
      }
    } catch (e) {
      console.error('❌ DB Error:', e);
    }
  });

  socket.on('disconnect', () => {
    console.log('👤 User disconnected');
  });
});

// Routes
app.get('/', (req, res) => {
  res.status(200).send('🚀 UniMate API is running perfectly!');
});
app.use('/api/ai', aiRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/lend-borrow', lendBorrowRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/debug', debugRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'UniMate Backend is running' });
});

httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 UniMate Backend & Socket server running on port ${PORT}`);
});
