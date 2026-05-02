import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoggedIn } = useAuth();
  const token = localStorage.getItem("token");
  
  // Not logged in — no token and no Redux state
  if (!isLoggedIn && !token) return <Navigate to="/login" />;
  
  // Role check: get role from Redux user first, fallback to localStorage
  if (allowedRoles) {
    const userRole = (user?.role || localStorage.getItem("role") || "client").toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
