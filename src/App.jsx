import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "@/utils/constants/routes";

import AuthPage from "@/pages/auth/AuthPage";
import LandingPage from "@/pages/landing/LandingPage";
import ListPage from "@/pages/list/ListPage";
import ErrorPage from "@/pages/error/ErrorPage";
import AuthCallback from "@/pages/auth/AuthCallback";
import EditPage from "@/pages/edit/EditPage";
import EditListPage from "@/pages/edit/list/EditListPage";

import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/api/supabaseClient";

function App() {
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const setSession = useAuthStore((s) => s.setSession);
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[AuthStateChange]", event, session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);
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
      <Route path={routes.home} element={<LandingPage />} />
      <Route path={routes.auth} element={<AuthPage />} />
      <Route path={routes.list} element={<ListPage />} />
      <Route path={routes.editList} element={<EditListPage />} />
      <Route path={routes.edit} element={<EditPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
