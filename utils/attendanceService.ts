import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AttendanceRecord {
  [classId: string]: "taken" | "missed";
}

export const getTodayDateKey = () => {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const saveAttendance = async (classId: string, status: "taken" | "missed") => {
  const dateKey = getTodayDateKey();
  const storageKey = `attendance_${dateKey}`;
  
  const existing = await AsyncStorage.getItem(storageKey);
  const attendance: AttendanceRecord = existing ? JSON.parse(existing) : {};
  
  attendance[classId] = status;
  await AsyncStorage.setItem(storageKey, JSON.stringify(attendance));
};

export const removeAttendance = async (classId: string) => {
  const dateKey = getTodayDateKey();
  const storageKey = `attendance_${dateKey}`;
  
  const existing = await AsyncStorage.getItem(storageKey);
  const attendance: AttendanceRecord = existing ? JSON.parse(existing) : {};
  
  delete attendance[classId];
  await AsyncStorage.setItem(storageKey, JSON.stringify(attendance));
};

export const loadAttendance = async (dateKey: string = getTodayDateKey()): Promise<AttendanceRecord> => {
  const storageKey = `attendance_${dateKey}`;
  const existing = await AsyncStorage.getItem(storageKey);
  return existing ? JSON.parse(existing) : {};
};

export const clearAllAttendance = async () => {
  const dateKey = getTodayDateKey();
  const storageKey = `attendance_${dateKey}`;
  await AsyncStorage.removeItem(storageKey);
};

export const calculateStats = (classes: any[], attendance: AttendanceRecord) => {
  const now = new Date();
  const currentTime = now.getHours() * 3600 + now.getMinutes() * 60;
  
  let taken = 0;
  let missed = 0;
  
  classes.forEach((c) => {
    const status = attendance[c.id];
    if (status === "taken") {
      taken++;
    } else {
      // Auto-missed logic: 30 mins after class ends
      const [endH, endM] = c.end_time.split(":").map(Number);
      const endTimePlus30 = endH * 3600 + endM * 60 + 1800; // 30 minutes = 1800s
      
      if (currentTime > endTimePlus30) {
        missed++;
      }
    }
  });
  
  return {
    total: classes.length,
    taken,
    missed,
  };
};
