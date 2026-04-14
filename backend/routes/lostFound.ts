import express from 'express';
export const Router = express.Router();

Router.get('/test', (req, res) => {
  res.json({ message: 'Lost/Found route is working' });
});

export default Router;
