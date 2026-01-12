import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../src/context/AuthContext";

export default function AuthRedirect({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/events" replace />;
  }
  return children;
}
