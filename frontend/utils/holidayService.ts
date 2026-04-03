import { supabase } from "../supabaseClient";

export interface Holiday {
  id: string;
  name: string;
  date: string; // ISO string (YYYY-MM-DD)
  type?: string;
}

export const getUpcomingHolidays = async (): Promise<Holiday[]> => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
    
    const { data, error } = await supabase
      .from("holidays")
      .select("*")
      .gte("date", firstDay)
      .lte("date", lastDay)
      .order("date", { ascending: true })
      .limit(10);

    if (error) {
      if (error.code === "PGRST116" || error.message.includes("does not exist")) {
        console.warn("Holidays table does not exist yet. Returning empty list.");
        return [];
      }
      throw error;
    }

    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      date: d.date,
      type: d.type
    }));
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
};
