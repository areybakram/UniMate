import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'class' | 'reminder' | 'system';
  timestamp: string;
  isRead: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isNotificationsEnabled: boolean;
  addNotification: (title: string, body: string, type: Notification['type'], data?: any) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  setNotificationsEnabled: (value: boolean) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'unimate_notifications_history';
const PREFERENCE_KEY = 'unimate_notifications_preference';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  // Load notifications and preference from storage on mount
  useEffect(() => {
    loadNotifications();
    loadPreference();

    // Listen for incoming notifications while the app is open
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      // Check if notifications are enabled before processing
      if (!isNotificationsEnabled) return;
      
      const { title, body, data } = notification.request.content;
      
      // Determine type from data or default to system
      const type = data?.type === 'class_reminder' ? 'class' : 
                   data?.type === 'attendance_reminder' ? 'reminder' : 'system';
                   
      addNotification(title || 'New Notification', body || '', type, data);
    });

    return () => subscription.remove();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadPreference = async () => {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCE_KEY);
      if (stored !== null) {
        setIsNotificationsEnabled(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load notification preference:', error);
    }
  };

  const setNotificationsEnabled = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(PREFERENCE_KEY, JSON.stringify(value));
      setIsNotificationsEnabled(value);
    } catch (error) {
      console.error('Failed to save notification preference:', error);
    }
  };

  const saveNotifications = async (newNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
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
    const updated = [newNotification, ...notifications].slice(0, 50); // Keep last 50
    await saveNotifications(updated);
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    await saveNotifications(updated);
  };

  const markAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    await saveNotifications(updated);
  };

  const clearAll = async () => {
    await saveNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isNotificationsEnabled,
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
