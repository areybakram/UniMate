import { supabase } from "../supabaseClient";

export type EventType = "app_open" | "feature_use" | "study_session";

export const logUsageEvent = async (userId: string, eventType: EventType, metadata: any = {}) => {
  try {
    const { error } = await supabase.from("usage_logs").insert([
      {
        user_id: userId,
        event_type: eventType,
        metadata,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
  } catch (error) {
    console.error("Error logging usage event:", error);
  }
};

export const getUsageLogs = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("usage_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching usage logs:", error);
    return [];
  }
};
