import { supabase } from "../supabaseClient";

export interface BorrowRequest {
  id: string;
  user_id: string;
  item_name: string;
  reason: string;
  duration: string;
  status: "open" | "active" | "completed";
  created_at: string;
  profiles?: { name: string; Role: string };
}

export interface BorrowOffer {
  id: string;
  request_id: string;
  lender_id: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  profiles?: { name: string; Role: string };
}

export const createBorrowRequest = async (data: Omit<BorrowRequest, "id" | "user_id" | "status" | "created_at">) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: result, error } = await supabase.from("borrow_requests").insert([
    {
      user_id: user.id,
      item_name: data.item_name,
      reason: data.reason,
      duration: data.duration,
      status: "open",
    }
  ]).select().single();

  if (error) throw error;
  return result;
};

export const getBorrowRequests = async (): Promise<BorrowRequest[]> => {
  const { data, error } = await supabase
    .from("borrow_requests")
    .select("*, profiles(name, Role)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as any;
};

export const createOffer = async (requestId: string, message: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase.from("borrow_offers").insert([
    {
      request_id: requestId,
      lender_id: user.id,
      message,
      status: "pending",
    }
  ]).select().single();

  if (error) throw error;
  return data;
};

export const acceptOffer = async (offerId: string, requestId: string) => {
  // 1. Mark offer as accepted
  const { error: offerErr } = await supabase
    .from("borrow_offers")
    .update({ status: "accepted" })
    .eq("id", offerId);
  
  if (offerErr) throw offerErr;

  // 2. Mark request as active
  const { error: reqErr } = await supabase
    .from("borrow_requests")
    .update({ status: "active" })
    .eq("id", requestId);
  
  if (reqErr) throw reqErr;
};
