import { supabase } from "../supabaseClient";

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  status: "todo" | "done";
  createdAt: string; // ISO string
}

export const getTasks = async (userId?: string): Promise<Task[]> => {
  try {
    let finalUserId = userId;
    if (!finalUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      finalUserId = user.id;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", finalUserId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return data.map((d: any) => ({
      id: d.id,
      user_id: d.user_id,
      title: d.title,
      description: d.description,
      startDate: d.start_date,
      endDate: d.end_date,
      status: d.status,
      createdAt: d.created_at,
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const addTask = async (task: Omit<Task, "id" | "createdAt" | "status" | "user_id">): Promise<Task | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.from("tasks").insert([{
      user_id: user.id,
      title: task.title,
      description: task.description,
      start_date: task.startDate,
      end_date: task.endDate,
      status: "todo",
    }]).select().single();

    if (error) throw error;

    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      description: data.description,
      startDate: data.start_date,
      endDate: data.end_date,
      status: data.status,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
  try {
    const dbUpdates: any = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.startDate) dbUpdates.start_date = updates.startDate;
    if (updates.endDate) dbUpdates.end_date = updates.endDate;
    if (updates.status) dbUpdates.status = updates.status;

    const { error } = await supabase.from("tasks").update(dbUpdates).eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const toggleTaskStatus = async (id: string, currentStatus: "todo" | "done"): Promise<void> => {
  const newStatus = currentStatus === "todo" ? "done" : "todo";
  await updateTask(id, { status: newStatus });
};

export const getTodayTasks = async (userId?: string): Promise<Task[]> => {
  const tasks = await getTasks(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return tasks.filter((t) => {
    const taskEnd = new Date(t.endDate);
    taskEnd.setHours(0, 0, 0, 0);
    return taskEnd.getTime() === today.getTime();
  });
};

export const calculateWeeklyTaskStats = async (userId?: string) => {
  const tasks = await getTasks(userId);
  const now = new Date();
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const createdCount = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === d.getTime();
    }).length;

    const completedCount = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === d.getTime() && t.status === "done";
    }).length;
    
    weekData.push({ day: dayName, created: createdCount, completed: completedCount });
  }
  
  return weekData;
};
