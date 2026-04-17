import { supabase } from "../supabaseClient";
import { getActiveSemester } from "./semesterService";
import { getSemesterHolidays } from "./holidayService";

export interface AttendanceRecord {
  [classId: string]: "taken" | "missed";
}

export const getTodayDateKey = () => {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
};

// Helper: fetch user's profile attendance
const fetchProfile = async (userId?: string) => {
  let finalUserId = userId;
  if (!finalUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    finalUserId = user.id;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, attendance_data, timetable_data")
    .eq("id", finalUserId)
    .single();
    
  return data;
};

// Helper: update profile attendance map
const updateProfileAttendance = async (attendanceData: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ attendance_data: attendanceData })
    .eq("id", user.id);
};

export const saveAttendance = async (classId: string, status: "taken" | "missed") => {
  const [semester, profile] = await Promise.all([
    getActiveSemester(),
    fetchProfile()
  ]);

  if (!semester) {
    console.warn("No active semester found. Attendance cannot be marked.");
    return;
  }

  const today = new Date();
  const start = new Date(semester.start_date);
  const end = new Date(semester.end_date);

  // Set times to 00:00:00 for accurate day comparison
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (today < start || today > end) {
    console.warn("Today's date is outside the active semester range.");
    return;
  }

  if (!profile) return;

  const dateKey = getTodayDateKey();
  const fullData = profile.attendance_data || {};
  if (!fullData[dateKey]) fullData[dateKey] = {};
  
  fullData[dateKey][classId] = status;
  await updateProfileAttendance(fullData);
};

export const removeAttendance = async (classId: string) => {
  const dateKey = getTodayDateKey();
  const profile = await fetchProfile();
  if (!profile) return;

  const fullData = profile.attendance_data || {};
  if (!fullData[dateKey]) return;
  
  delete fullData[dateKey][classId];
  await updateProfileAttendance(fullData);
};

export const loadAttendance = async (userId?: string, dateKey: string = getTodayDateKey()): Promise<AttendanceRecord> => {
  const profile = await fetchProfile(userId);
  if (!profile) return {};
  
  const fullData = profile.attendance_data || {};
  return fullData[dateKey] || {};
};

export const clearAllAttendance = async () => {
  await updateProfileAttendance({});
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

export const calculateOverallAttendanceRate = async (userId?: string) => {
  const [profile, semester] = await Promise.all([
    fetchProfile(userId),
    getActiveSemester()
  ]);

  if (!profile || !semester) return 0;

  const holidays = await getSemesterHolidays(semester.start_date, semester.end_date);
  const timetableData = profile.timetable_data || [];
  const attendanceData = profile.attendance_data || {};
  
  if (timetableData.length === 0) return 0;

  // 1. Get all scheduled classes from Supabase matching the profile
  const filterStr = timetableData
    .map((c: any) => `and(course_code.ilike.${c.course_code},batch_code.ilike.${c.batch_code})`)
    .join(",");

  const { data: allTimetables } = await supabase
    .from("timetables")
    .select("*")
    .or(filterStr);

  const start = new Date(semester.start_date);
  const end = new Date(); // Only calculate up to today
  const semesterEnd = new Date(semester.end_date);
  const limit = end < semesterEnd ? end : semesterEnd;

  let totalScheduled = 0;
  let totalAttended = 0;
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Iterate through every day from semester start to today
  for (let d = new Date(start); d <= limit; d.setDate(d.getDate() + 1)) {
    const dayName = DAYS[d.getDay()];
    const dateKey = d.toISOString().split("T")[0];

    if (dayName === "Sunday" || holidays.includes(dateKey)) continue; 

    // Scheduled classes for this day of the week
    const daySchedule = (allTimetables || []).filter(item => item.day === dayName);
    totalScheduled += daySchedule.length;

    // Attended classes for this specific date
    const dayAttendance = attendanceData[dateKey] || {};
    totalAttended += Object.values(dayAttendance).filter(v => v === "taken").length;
  }

  if (totalScheduled === 0) return 0;
  return totalAttended / totalScheduled;
};

export const calculateWeeklyAttendanceTrends = async (userId?: string) => {
  const profile = await fetchProfile(userId);
  if (!profile) return [];

  const timetableData = profile.timetable_data || [];
  const attendanceData = profile.attendance_data || {};
  
  if (timetableData.length === 0) return [];

  // 1. Get all scheduled classes from Supabase matching the profile
  const filterStr = timetableData
    .map((c: any) => `and(course_code.ilike.${c.course_code},batch_code.ilike.${c.batch_code})`)
    .join(",");

  const { data: allTimetables } = await supabase
    .from("timetables")
    .select("*")
    .or(filterStr);

  const now = new Date();
  const weekData = [];
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dayName = DAYS[d.getDay()];
    const dateKey = d.toISOString().split("T")[0];
    const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });

    // Count scheduled for this day name
    const scheduledCount = (allTimetables || []).filter(item => item.day === dayName).length;

    // Count attended (taken) for this date key
    const dayAttendance = attendanceData[dateKey] || {};
    const attendedCount = Object.values(dayAttendance).filter(v => v === "taken").length;

    weekData.push({ 
      day: shortDay, 
      scheduled: scheduledCount, 
      attended: attendedCount 
    });
  }

  return weekData;
};
