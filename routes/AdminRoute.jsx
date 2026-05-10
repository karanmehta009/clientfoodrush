import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();

  // 1. Not logged in 
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Not admin 
  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // 3. Admin access 
  return children;
}

export default AdminRoute;