// context/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { logUsageEvent } from "../utils/usageService";

interface User {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role?: string | null;
  custom_profile_photo?: string | null;
  timetable_data?: any;
  attendance_data?: any;
  chatbot_history?: any;
  batch?: string | null;
  registration_number?: string | null;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: { 
    name?: string; 
    phone?: string; 
    custom_profile_photo?: string | null;
    timetable_data?: any;
    attendance_data?: any;
    chatbot_history?: any;
  }) => Promise<{ error?: any }>;
  changePassword: (newPassword: string) => Promise<{ error?: any }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: any; user?: User | null }>;
  signUp: (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    batch: string,
    registrationNumber: string
  ) => Promise<{ error?: any; user?: User | null }>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    })();

    // listen to auth changes and update context
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth State Change Event:", event);
        try {
          if (session?.user) {
            const { id, email } = session.user;
            // fetch profile from profiles table (if exists)
            const { data: profile } = await supabase
              .from("profiles")
              .select("name, phone, Role, custom_profile_photo, timetable_data, attendance_data, chatbot_history, batch, registration_number")
              .eq("id", id)
              .single();
            
            const usr: User = {
              id,
              email: email ?? "",
              name: profile?.name ?? null,
              phone: profile?.phone ?? null,
              role: profile?.Role?.toLowerCase() ?? "student",
              custom_profile_photo: profile?.custom_profile_photo ?? null,
              timetable_data: profile?.timetable_data ?? [],
              attendance_data: profile?.attendance_data ?? {},
              chatbot_history: profile?.chatbot_history ?? [],
              batch: profile?.batch ?? null,
              registration_number: profile?.registration_number ?? null,
            };
            setUser(usr);
            console.log("✅ Authenticated User ID:", id);
            await AsyncStorage.setItem("user", JSON.stringify(usr));
            
            // Log app open event
            logUsageEvent(id, "app_open", { time: new Date().toLocaleTimeString() });
          } else if (event === 'SIGNED_OUT') {
            // ONLY wipe cache if user explicitly signs out
            setUser(null);
            await AsyncStorage.removeItem("user");
          }
        } catch (e) {
          console.error("auth state handler error", e);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!user) return { error: "No user logged in" };
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", user.id);

      if (error) return { error };

      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (err) {
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error };
      if (data?.user) {
        const { id, email: userEmail } = data.user;
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, phone, Role, custom_profile_photo, timetable_data, attendance_data, chatbot_history, batch, registration_number")
          .eq("id", id)
          .single();
        
        console.log("SignIn Profile:", profile);

        const usr: User = {
          id,
          email: userEmail ?? "",
          name: profile?.name ?? null,
          phone: profile?.phone ?? null,
          role: profile?.Role?.toLowerCase() ?? "student",
          custom_profile_photo: profile?.custom_profile_photo ?? null,
          timetable_data: profile?.timetable_data ?? [],
          attendance_data: profile?.attendance_data ?? {},
          chatbot_history: profile?.chatbot_history ?? [],
          batch: profile?.batch ?? null,
          registration_number: profile?.registration_number ?? null,
        };
        await AsyncStorage.setItem("user", JSON.stringify(usr));
        setUser(usr);
        return { user: usr };
      }
      return { user: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signUp = async (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    batch: string,
    registrationNumber: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: fullName, phone },
        },
      });
      if (error) return { error };

      if (data?.user) {
        const id = data.user.id;
        console.log(
          "Storing role:",
          JSON.stringify({
            id,
            name: fullName,
            phone,
            Role: role || "student", // <- store role in profiles table
            email, // store email for convenience
          })
        );
        await supabase.from("profiles").upsert({
          id,
          name: fullName, 
          phone,
          Role: role || "student", 
          email, 
          batch,
          registration_number: registrationNumber,
        });
        const usr: User = {
          id,
          email: data.user.email ?? "",
          name: fullName,
          phone,
          role: (role || "student").toLowerCase(),
          batch,
          registration_number: registrationNumber,
        };
        await AsyncStorage.setItem("user", JSON.stringify(usr));
        setUser(usr);
        return { user: usr };
      }

      return { user: null };
    } catch (err) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, updateProfile, changePassword, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
