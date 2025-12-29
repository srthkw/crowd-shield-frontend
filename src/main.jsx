import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectRoute from "./utils/protectRoute";
import { AuthProvider } from "./context/AuthContext";
import EventDashboard from "./pages/EventDashboard";

// pages
import Login from "./pages/Login";
import Events from "./pages/Events";
// later you'll add Events, Dashboard, etc.

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
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
  }
  
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
