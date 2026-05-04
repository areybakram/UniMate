import express from 'express';
import { broadcastNotification } from '../services/notificationService';

const Router = express.Router();

Router.post('/broadcast', async (req, res) => {
  const { title, body, data } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  // Broadcast in background
  broadcastNotification(title, body, data || {});

  res.json({ success: true, message: 'Broadcast initiated' });
});

export default Router;
