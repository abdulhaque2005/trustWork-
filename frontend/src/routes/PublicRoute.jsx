import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
