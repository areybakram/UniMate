import { supabase } from "../supabaseClient";

export interface SemesterConfig {
  id: string;
  name: string;
  year: number;
  start_date: string; // ISO Date string
  end_date: string; // ISO Date string
  is_active: boolean;
}

let cachedSemester: SemesterConfig | null = null;

export const getActiveSemester = async (): Promise<SemesterConfig | null> => {
  if (cachedSemester) return cachedSemester;

  try {
    const { data, error } = await supabase
      .from("semester_config")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        console.warn("semester_config table does not exist or is empty.");
        return null;
      }
      throw error;
    }

    if (data) {
      cachedSemester = data as SemesterConfig;
    }
    return data as SemesterConfig;
  } catch (error) {
    console.error("Error fetching active semester:", error);
    return null;
  }
};

export const clearSemesterCache = () => {
  cachedSemester = null;
};
