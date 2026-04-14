import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const Router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

Router.post('/mock-data', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    console.log(`Injecting mock data for user: ${userId}`);

    // 1. Mock Usage Logs
    const usageLogs = [
      { user_id: userId, event_type: 'app_open', metadata: { time: '10:00 AM' }, created_at: new Date(Date.now() - 86400000).toISOString() },
      { user_id: userId, event_type: 'app_open', metadata: { time: '02:15 AM' }, created_at: new Date(Date.now() - 43200000).toISOString() },
      { user_id: userId, event_type: 'app_open', metadata: { time: '03:45 AM' }, created_at: new Date(Date.now() - 36000000).toISOString() },
      { user_id: userId, event_type: 'app_open', metadata: { time: '11:00 PM' }, created_at: new Date().toISOString() },
    ];
    await supabase.from('usage_logs').insert(usageLogs);

    // 2. Mock Tasks
    const tasks = [
      { user_id: userId, title: 'DAA Assignment', description: 'Graph algorithms', status: 'done', start_date: new Date().toISOString(), end_date: new Date().toISOString() },
      { user_id: userId, title: 'OOP Project', description: 'Registry system', status: 'todo', start_date: new Date().toISOString(), end_date: new Date(Date.now() - 3600000).toISOString() }, // Missed
      { user_id: userId, title: 'DB Quiz', description: 'SQL queries', status: 'done', start_date: new Date().toISOString(), end_date: new Date().toISOString() },
    ];
    await supabase.from('tasks').insert(tasks);

    // 3. Mock Attendance (Simplified, usually in profiles json)
    const { data: profile } = await supabase.from('profiles').select('attendance_data').eq('id', userId).single();
    const attendance = profile?.attendance_data || {};
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    attendance[today] = { "mock-class-1": "taken", "mock-class-2": "missed" };
    attendance[yesterday] = { "mock-class-1": "missed", "mock-class-2": "missed" };

    await supabase.from('profiles').update({ attendance_data: attendance }).eq('id', userId);

    res.json({ success: true, message: "Mock data injected successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default Router;
