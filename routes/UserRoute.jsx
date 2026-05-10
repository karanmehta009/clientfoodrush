import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const UserRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  // 1. Not logged in 
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserRoute;