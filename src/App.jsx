import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "@/utils/constants/routes";

import AuthPage from "@/pages/auth/AuthPage";
import LandingPage from "@/pages/landing/LandingPage";
import ListPage from "@/pages/list/ListPage";
import ErrorPage from "@/pages/error/ErrorPage";
import AuthCallback from "@/pages/auth/AuthCallback";

import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabaseClient";

function App() {
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    fetchSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[AuthStateChange]", _event, session);
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession, setSession]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path={routes.auth} element={<AuthPage />} />
      <Route path={routes.list} element={<ListPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
