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
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import Signup from "./pages/SignUp";
import LandingPage from "./pages/LandingPage";
import OrgReqs from "./pages/OrgReqs";
import EmergencyMap from "./pages/EmergencyMap";
import FAQs from "./pages/FAQs";
import Otp from "./pages/Otp";
import "./leafletConfig";
// later you'll add Events, Dashboard, etc.

const router = createBrowserRouter([
  { path: "/", element: (
  <AuthRedirect>
  <LandingPage />
  </AuthRedirect>
) },

{
  path: "/signup",
  element: (
    <AuthRedirect>
      <Signup />
    </AuthRedirect>
  )
},

{
  path: "/enter-otp",
  element: (
    <AuthRedirect>
      <Otp />
    </AuthRedirect>
  )
},

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
    path: "/create-event",
    element: (
      <ProtectRoute>
        <CreateEvent />
      </ProtectRoute>
    )
  },

  {
    path: "/faqs",
    element: (
        <FAQs />
    )
  },

  {
    path: "/profile",
    element: (
      <ProtectRoute>
        <Profile />
      </ProtectRoute>
    )
  },

  {
    path: "/org-reqs",
    element: (
      <ProtectRoute>
        <OrgReqs />
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
    path: "/map/:id",
    element: (
      <ProtectRoute>
        <EmergencyMap />
      </ProtectRoute>
    )
  },

]);

createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
);
