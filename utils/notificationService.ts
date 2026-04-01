import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const SCHEDULED_IDS_KEY = 'unimate_scheduled_notifications';

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for push notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return finalStatus;
};

const DAY_MAP: { [key: string]: number } = {
  'Sunday': 1,
  'Monday': 2,
  'Tuesday': 3,
  'Wednesday': 4,
  'Thursday': 5,
  'Friday': 6,
  'Saturday': 7,
};

interface TimetableItem {
  id: string;
  subject: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
}

export const scheduleClassReminders = async (timetable: TimetableItem[]) => {
  try {
    // 1. Cancel previous schedules
    await cancelAllScheduledNotifications();

    const scheduledIds: string[] = [];

    for (const item of timetable) {
      const weekday = DAY_MAP[item.day];
      if (!weekday) continue;

      // --- 1. Upcoming Class Reminder (1 hour before) ---
      const [startH, startM] = item.start_time.split(':').map(Number);
      let triggerH = startH - 1;
      let triggerM = startM;

      if (triggerH >= 0) {
        const id1 = await Notifications.scheduleNotificationAsync({
          content: {
            title: `Upcoming Class: ${item.subject}`,
            body: `Your class starts in 1 hour in ${item.room}.`,
            data: { type: 'class_reminder', classId: item.id },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: weekday,
            hour: triggerH,
            minute: triggerM,
          } as any,
        });
        scheduledIds.push(id1);
      }

      // --- 2. Attendance Reminder (2 mins after end) ---
      const [endH, endM] = item.end_time.split(':').map(Number);
      let reminderH = endH;
      let reminderM = endM + 2;

      if (reminderM >= 60) {
        reminderH += 1;
        reminderM -= 60;
      }

      if (reminderH < 24) {
        const id2 = await Notifications.scheduleNotificationAsync({
          content: {
            title: `Mark Attendance: ${item.subject}`,
            body: `Class has ended. Don't forget to mark it as taken!`,
            data: { type: 'attendance_reminder', classId: item.id },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: weekday,
            hour: reminderH,
            minute: reminderM,
          } as any,
        });
        scheduledIds.push(id2);
      }
    }

    // Store IDs to cleanup later if needed
    await AsyncStorage.setItem(SCHEDULED_IDS_KEY, JSON.stringify(scheduledIds));
    console.log(`Scheduled ${scheduledIds.length} notifications`);
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

export const cancelAllScheduledNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem(SCHEDULED_IDS_KEY);
};
