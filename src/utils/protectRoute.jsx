import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectRoute = ({ children }) => {
  const { user } = useAuth();
  return user.token ? children : <Navigate to="/login" />;
};

export default ProtectRoute;
