import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

function ProtectedRoute({ children }) {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        <p>세션 확인중...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
