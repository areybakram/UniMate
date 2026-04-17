import { supabase } from "../supabaseClient";

export interface BorrowRequest {
  id: string;
  user_id: string;
  item_name: string;
  reason: string;
  duration: string;
  end_date?: string;
  status: "open" | "active" | "completed";
  created_at: string;
  resolved_at?: string;
  profiles?: { name: string; Role: string; batch?: string; phone?: string; registration_number?: string };
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

  // Prevent duplicate open requests for the same item
  const { data: existing } = await supabase
    .from("borrow_requests")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_name", data.item_name)
    .in("status", ["open", "active"])
    .maybeSingle();
  
  if (existing) throw new Error("ALREADY_SUBMITTED");

  const { data: result, error } = await supabase.from("borrow_requests").insert([
    {
      user_id: user.id,
      item_name: data.item_name,
      reason: data.reason,
      duration: data.duration,
      end_date: data.end_date,
      status: "open",
    }
  ]).select().single();

  if (error) throw error;
  return result;
};

export type DateFilter = 'today' | 'yesterday' | 'week' | 'all';

export const getBorrowRequests = async (userIdFilter?: string, dateFilter: DateFilter = 'all'): Promise<BorrowRequest[]> => {
  let query = supabase
    .from("borrow_requests")
    .select("*, profiles!borrow_requests_user_id_fkey(name, Role, batch, phone, registration_number)")
    .order("created_at", { ascending: false });

  if (userIdFilter) {
    query = query.eq("user_id", userIdFilter);
  } else {
    query = query.eq("status", "open");
  }

  if (dateFilter !== 'all') {
    const now = new Date();
    let startDate = new Date();
    
    if (dateFilter === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (dateFilter === 'yesterday') {
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDate.toISOString());
    } else if (dateFilter === 'week') {
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    }
    
    query = query.gte('created_at', startDate.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as any;
};


export const getMyOffers = async (userId: string): Promise<BorrowOffer[]> => {
  const { data, error } = await supabase
    .from("borrow_offers")
    .select("*, borrow_requests(*, profiles!borrow_requests_user_id_fkey(name))")
    .eq("lender_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as any;
};

export const markAsHandedOver = async (requestId: string, recipientId: string) => {
  const { error } = await supabase
    .from("borrow_requests")
    .update({ 
      status: "completed",
      completed_with_id: recipientId,
      resolved_at: new Date().toISOString()
    })
    .eq("id", requestId);
  
  if (error) throw error;
};

export const getOffersByRequestId = async (requestId: string): Promise<BorrowOffer[]> => {
  const { data, error } = await supabase
    .from("borrow_offers")
    .select("*, profiles!borrow_offers_lender_id_fkey(name, Role, batch, phone, registration_number)")
    .eq("request_id", requestId)
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
