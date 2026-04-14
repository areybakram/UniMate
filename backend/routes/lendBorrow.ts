import express from 'express';
export const Router = express.Router();

// Mock endpoints for Lend/Borrow since we use Supabase for persistent data
// But we might need backend logic for specific coordination or scoring

Router.get('/test', (req, res) => {
  res.json({ message: 'Lend/Borrow route is working' });
});

export default Router;
