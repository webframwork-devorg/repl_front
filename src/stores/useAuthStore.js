import { create } from "zustand";
import { supabase } from "@/api/supabaseClient";

export const useAuthStore = create((set) => ({
  session: null,
  loading: true, 

  fetchSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, loading: false }); 
  },

  setSession: (session) => set({ session }),
}));
