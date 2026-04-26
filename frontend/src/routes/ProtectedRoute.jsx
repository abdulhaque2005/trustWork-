import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoggedIn } = useAuth();
  
  if (!isLoggedIn) return <Navigate to="/login" />;
  
  const rawRole = localStorage.getItem("role") || user?.role || "Client";
  const userRole = rawRole === "Freelancer" ? "Freelancer" : "Client";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default ProtectedRoute;
