import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "@/utils/constants/routes";

import AuthPage from "@/pages/auth/AuthPage";
import LandingPage from "@/pages/landing/LandingPage";
import ListPage from "@/pages/list/ListPage";
import ErrorPage from "@/pages/error/ErrorPage";
import BookPage from "@/pages/book/BookPage";
import AuthCallback from "@/pages/auth/AuthCallback";
import EditPage from "@/pages/edit/EditPage";
import EditListPage from "@/pages/edit/list/EditListPage";
import ProtectedRoute from "@/components/commons/routes/ProtectedRoutes";

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
      <Route path={routes.auth} element={<AuthPage />} />
      <Route path={routes.list} element={<ListPage />} />
      <Route path="/book/:id" element={<BookPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route
        path={routes.home}
        element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.list}
        element={
          <ProtectedRoute>
            <ListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.editList}
        element={
          <ProtectedRoute>
            <EditListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.edit}
        element={
          <ProtectedRoute>
            <EditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <ErrorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={routes.book}
        element={
          <ProtectedRoute>
            <BookPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
