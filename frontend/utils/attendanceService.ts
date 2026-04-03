import { supabase } from "../supabaseClient";

export interface AttendanceRecord {
  [classId: string]: "taken" | "missed";
}

export const getTodayDateKey = () => {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
};

// Helper: fetch user's profile attendance
const fetchProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, attendance_data")
    .eq("id", user.id)
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
  const dateKey = getTodayDateKey();
  const profile = await fetchProfile();
  if (!profile) return;

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

export const loadAttendance = async (dateKey: string = getTodayDateKey()): Promise<AttendanceRecord> => {
  const profile = await fetchProfile();
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
