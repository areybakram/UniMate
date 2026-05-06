import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

export const cleanupOldNotifications = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .lt('created_at', sevenDaysAgo.toISOString());

    if (error) throw error;
    console.log('🧹 Cleanup: Removed notifications older than 7 days');
  } catch (err) {
    console.error('❌ Failed to cleanup old notifications:', err);
  }
};

export const broadcastNotification = async (title: string, body: string, data: any = {}) => {
  try {
    // Run cleanup lazily on each broadcast
    cleanupOldNotifications();

    // 1. Fetch all push tokens from profiles
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('push_token')
      .not('push_token', 'is', null);

    if (error) {
      console.error('Error fetching tokens:', error);
      return;
    }

    const tokens = profiles.map(p => p.push_token).filter(t => t && t.startsWith('ExponentPushToken'));
    
    // 2. Save to DB for persistence (Global notification if no specific userId in data)
    try {
      await supabaseAdmin.from('notifications').insert([{
        title,
        body,
        type: data?.type || 'system',
        data: data || {},
      }]);
      console.log('✅ Notification persisted to DB');
    } catch (dbErr) {
      console.error('❌ Failed to persist notification to DB:', dbErr);
    }

    // 3. Chunk tokens (Expo allows 100 per request)
    const chunks = [];
    for (let i = 0; i < tokens.length; i += 100) {
      chunks.push(tokens.slice(i, i + 100));
    }

    // 3. Send notifications
    for (const chunk of chunks) {
      const messages = chunk.map(token => ({
        to: token,
        sound: 'default',
        title,
        body,
        data,
      }));

      try {
        const response = await axios.post(EXPO_PUSH_URL, messages, {
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
        });
        console.log('Expo response:', response.data);
      } catch (err) {
        console.error('Error sending chunk to Expo:', err);
      }
    }
  } catch (err) {
    console.error('Broadcast failed:', err);
  }
};
