// context/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface User {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  role?: string | null;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: any; user?: User | null }>;
  signUp: (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    role: string
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
        try {
          if (session?.user) {
            const { id, email } = session.user;
            // fetch profile from profiles table (if exists)
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("full_name, phone")
              .eq("id", id)
              .single();

            const usr: User = {
              id,
              email: email ?? "",
              full_name: profile?.full_name ?? null,
              phone: profile?.phone ?? null,
            };
            setUser(usr);
            await AsyncStorage.setItem("user", JSON.stringify(usr));
          } else {
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

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
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
          .select("full_name, phone")
          .eq("id", id)
          .single();
        const usr: User = {
          id,
          email: userEmail ?? "",
          full_name: profile?.full_name ?? null,
          phone: profile?.phone ?? null,
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
    role: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        { data: { full_name: fullName, phone } } // auth metadata
      );
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
          Role: role || "student", // <- store role in profiles table
          email, // store email for convenience
        });
        const usr: User = {
          id,
          email: data.user.email ?? "",
          full_name: fullName,
          phone,
          role,
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
      value={{ user, isLoading, login, logout, updateUser, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
