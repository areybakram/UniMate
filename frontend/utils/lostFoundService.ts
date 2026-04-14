import { supabase } from "../supabaseClient";

export interface LostFoundPost {
  id: string;
  user_id: string;
  item_name: string;
  description: string;
  image_url?: string;
  type: "lost" | "found";
  status: "open" | "resolved";
  created_at: string;
  profiles?: { name: string; Role: string };
}

export interface LostFoundClaim {
  id: string;
  post_id: string;
  claimer_id: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  profiles?: { name: string; Role: string };
}

export const createLostFoundPost = async (data: Omit<LostFoundPost, "id" | "user_id" | "status" | "created_at">) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Prevent duplicate reports for the same item that are not yet resolved
  const { data: existing } = await supabase
    .from("lost_found_posts")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_name", data.item_name)
    .eq("status", "open")
    .maybeSingle();
  
  if (existing) throw new Error("ALREADY_SUBMITTED");

  const { data: result, error } = await supabase.from("lost_found_posts").insert([
    {
      user_id: user.id,
      item_name: data.item_name,
      description: data.description,
      image_url: data.image_url,
      type: data.type,
      status: "open",
    }
  ]).select().single();

  if (error) throw error;
  return result;
};

export const getLostFoundPosts = async (userIdFilter?: string): Promise<LostFoundPost[]> => {
  let query = supabase
    .from("lost_found_posts")
    .select("*, profiles!lost_found_posts_user_id_fkey(name, Role)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (userIdFilter) {
    query = query.eq("user_id", userIdFilter);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as any;
};

export const getMyClaims = async (userId: string): Promise<LostFoundClaim[]> => {
  const { data, error } = await supabase
    .from("lost_found_claims")
    .select("*, lost_found_posts(*, profiles!lost_found_posts_user_id_fkey(name))")
    .eq("claimer_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as any;
};

export const markAsResolved = async (postId: string, recipientId: string) => {
  const { error } = await supabase
    .from("lost_found_posts")
    .update({ 
      status: "resolved",
      resolved_with_id: recipientId // User needs to add this column to lost_found_posts
    })
    .eq("id", postId);
  
  if (error) throw error;
};

export const getClaimsByPostId = async (postId: string): Promise<LostFoundClaim[]> => {
  const { data, error } = await supabase
    .from("lost_found_claims")
    .select("*, profiles!lost_found_claims_claimer_id_fkey(name, Role)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as any;
};

export const createClaim = async (postId: string, message: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase.from("lost_found_claims").insert([
    {
      post_id: postId,
      claimer_id: user.id,
      message,
      status: "pending",
    }
  ]).select().single();

  if (error) throw error;
  return data;
};

export const resolvePost = async (postId: string, claimerId: string) => {
  // Mark post as resolved
  const { error } = await supabase
    .from("lost_found_posts")
    .update({ status: "resolved" })
    .eq("id", postId);
  
  if (error) throw error;
};
