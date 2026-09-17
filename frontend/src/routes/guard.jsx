import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ isAnonymous = false }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAnonymous) {
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
