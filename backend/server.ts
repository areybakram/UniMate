import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai';
import timetableRoutes from './routes/timetable';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('🚀 UniMate API is running perfectly! Check /health for status.');
});
app.use('/api/ai', aiRoutes);
app.use('/api/timetable', timetableRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'UniMate Backend is running' });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 UniMate Backend running on http://172.16.7.33:${PORT}`);
});

