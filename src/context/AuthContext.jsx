import { createContext, useState } from "react";
import { connectSocket, disconnectSocket } from "../socket";

export const AuthContext = createContext();
export const isLoggedIn = () =>
  Boolean(localStorage.getItem("token"));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    name: localStorage.getItem("name") || null,
    id: localStorage.getItem("id") || null,
    email: localStorage.getItem("email") || null,
    phone: localStorage.getItem("phone") || null,
    eventRegistered: localStorage.getItem("eventRegistered") !== "undefined" ? localStorage.getItem("eventRegistered") : null
  });

  const login = (token, role, name, id, email, phone, eventRegistered) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("id", id);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("eventRegistered", eventRegistered ? eventRegistered : "");
    setUser({ token, role, name, id, email, phone, eventRegistered });
    connectSocket();
  };

  const logout = () => {
    localStorage.clear();
    disconnectSocket();
    setUser({ token: null, role: null, name: null, id: null, email: null, phone: null, eventRegistered: null });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
