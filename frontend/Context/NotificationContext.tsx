import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { supabase } from '../supabaseClient';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'class' | 'reminder' | 'system' | 'lend_borrow' | 'lost_found';
  timestamp: string;
  isRead: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isNotificationsEnabled: boolean;
  isLoading: boolean;
  hasMore: boolean;
  fetchNotifications: (refresh?: boolean) => Promise<void>;
  addNotification: (title: string, body: string, type: Notification['type'], data?: any) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  setNotificationsEnabled: (value: boolean) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE_INITIAL = 10;
  const PAGE_SIZE_MORE = 5;

  // Load initial notifications on mount
  useEffect(() => {
    // Clear any "ghost" notifications from the OS tray/queue on start
    const clearGhostNotifications = async () => {
      try {
        await Notifications.dismissAllNotificationsAsync();
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch (e) {
        console.log('Error clearing notifications:', e);
      }
    };
    
    clearGhostNotifications();
    fetchNotifications(true);

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      if (!isNotificationsEnabled) return;
      const { title, body, data } = notification.request.content;
      
      // ONLY add to history if it's a server-side notification (has a screen or specific type)
      // Local reminders (class_reminder, task_reminder) should only be popups
      const isLocalReminder = data?.type === 'class_reminder' || data?.type === 'attendance_reminder' || data?.type === 'task_reminder';
      
      if (isLocalReminder) return;

      const type = data?.type === 'lend_borrow' ? 'lend_borrow' : 
                   data?.type === 'lost_found' ? 'lost_found' : 'system';
                   
      addNotification(title || 'New Notification', body || '', type, data);
    });

    return () => subscription.remove();
  }, []);

  const fetchNotifications = async (refresh: boolean = false) => {
    if (isLoading || (!hasMore && !refresh)) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentPage = refresh ? 0 : page;
      const currentSize = refresh ? PAGE_SIZE_INITIAL : PAGE_SIZE_MORE;
      const from = refresh ? 0 : (PAGE_SIZE_INITIAL + (currentPage - 1) * PAGE_SIZE_MORE);
      const to = from + currentSize - 1;

      // 1. Get notifications from 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: notificationsData, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .range(from, to);

      if (notifError) throw notifError;
      if (!notificationsData || notificationsData.length === 0) {
        if (refresh) setNotifications([]);
        setHasMore(false);
        return;
      }

      // 2. Get statuses for these notifications for this user
      const notifIds = notificationsData.map(n => n.id);
      const { data: statusData, error: statusError } = await supabase
        .from('notification_statuses')
        .select('*')
        .eq('user_id', user.id)
        .in('notification_id', notifIds);

      if (statusError) throw statusError;

      // 3. Map and Filter
      const statusesMap = new Map(statusData?.map(s => [s.notification_id, s]));
      
      const filteredAndMapped = notificationsData
        .filter(n => {
          const status = statusesMap.get(n.id);
          return !status?.is_cleared;
        })
        .map(n => {
          const status = statusesMap.get(n.id);
          return {
            id: n.id,
            title: n.title,
            body: n.body,
            type: n.type as any,
            timestamp: n.created_at,
            isRead: status?.is_read || false,
            data: n.data
          };
        });

      if (refresh) {
        setNotifications(filteredAndMapped);
        setPage(1);
        setHasMore(notificationsData.length === PAGE_SIZE_INITIAL);
      } else {
        setNotifications(prev => [...prev, ...filteredAndMapped]);
        setPage(prev => prev + 1);
        setHasMore(notificationsData.length === PAGE_SIZE_MORE);
      }
    } catch (error) {
      console.error('Failed to fetch notifications from DB:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const setNotificationsEnabled = async (value: boolean) => {
    setIsNotificationsEnabled(value);
  };


  const addNotification = async (title: string, body: string, type: Notification['type'], data?: any) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      body,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
      data,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updated = notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      
      await supabase.from('notification_statuses').upsert({
        notification_id: id,
        user_id: user.id,
        is_read: true
      }, { onConflict: 'notification_id,user_id' });
    } catch (err) {
      console.error('Failed to mark as read in DB:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      setNotifications(updated);
      
      const upserts = notifications.map(n => ({
        notification_id: n.id,
        user_id: user.id,
        is_read: true
      }));

      await supabase.from('notification_statuses').upsert(upserts, { onConflict: 'notification_id,user_id' });
    } catch (err) {
      console.error('Failed to mark all as read in DB:', err);
    }
  };

  const clearAll = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentIds = notifications.map(n => n.id);
      
      const upserts = currentIds.map(id => ({
        notification_id: id,
        user_id: user.id,
        is_read: true,
        is_cleared: true
      }));

      await supabase.from('notification_statuses').upsert(upserts, { onConflict: 'notification_id,user_id' });
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear notifications in DB:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isNotificationsEnabled,
        isLoading,
        hasMore,
        fetchNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        setNotificationsEnabled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
