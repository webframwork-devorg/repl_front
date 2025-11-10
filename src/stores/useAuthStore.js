import { create } from "zustand";
import { supabase } from "@/api/supabaseClient";

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  fetchSession: async () => {
    set({ loading: true });
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("세션 로드 실패:", error);
      set({ user: null, session: null, loading: false });
      return;
    }
    set({
      user: data.session?.user || null,
      session: data.session || null,
      loading: false,
    });
  },

  setSession: (session) =>
    set({
      user: session?.user || null,
      session: session || null,
      loading: false,
    }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
