import dotenv from 'dotenv';
dotenv.config();

import app from './api/index';
import http from 'http';
import { Server } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

const PORT = process.env.PORT || 5001;

const SUPABASE_URL = process.env.SUPABASE_URL || "https://stzbxkqqfjtpbfruqaag.supabase.co"; 
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""; 

if (!SUPABASE_KEY) {
  console.warn("⚠️ Warning: No Supabase Key found. Persistence will fail.");
}
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

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

httpServer.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 UniMate Backend & Socket server running on port ${PORT}`);
});
