import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectRoute from "./utils/protectRoute";
import { AuthProvider } from "./context/AuthContext";
import AuthRedirect from "../redirect/AuthRedirect";
import EventDashboard from "./pages/EventDashboard";
import Login from "./pages/Login";
import Events from "./pages/Events";
import UnderDev from "./pages/UnderDev";
import LandingPage from "./pages/LandingPage";
// later you'll add Events, Dashboard, etc.

const router = createBrowserRouter([
  { path: "/", element: (
  <LandingPage />
) },
  { path: "/login", element: (
  <AuthRedirect>
  <Login />
  </AuthRedirect>
) },
  {
    path: "/events",
    element: (
      <ProtectRoute>
        <Events />
      </ProtectRoute>
    )
  },
  {
    path: "/event/:eventId",
    element: (
      <ProtectRoute>
        <EventDashboard />
      </ProtectRoute>
    )
  },
  {
    path: "/underdev",
    element: (
        <UnderDev />
    )
  }
  
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
