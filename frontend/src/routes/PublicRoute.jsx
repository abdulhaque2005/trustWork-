import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem("token");

  if (isLoggedIn || token) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
