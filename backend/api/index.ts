import express from 'express';
import cors from 'cors';
import aiRoutes from '../routes/ai';
import timetableRoutes from '../routes/timetable';
import lendBorrowRoutes from '../routes/lendBorrow';
import lostFoundRoutes from '../routes/lostFound';
import debugRoutes from '../routes/debug';
import notificationRoutes from '../routes/notifications';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.status(200).send('🚀 UniMate API is running perfectly!');
});

app.use('/api/ai', aiRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/lend-borrow', lendBorrowRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'UniMate Backend is running' });
});

export default app;
