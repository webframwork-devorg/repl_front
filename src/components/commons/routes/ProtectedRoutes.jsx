import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

function ProtectedRoute({ children }) {
  const session = useAuthStore((s) => s.session);

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
