import { createContext, useState } from "react";

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
  });

  const login = (token, role, name, id, email, phone) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("id", id);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    setUser({ token, role, name, id , email, phone});
  };

  const logout = () => {
    localStorage.clear();
    setUser({ token: null, role: null, name: null, id: null, email: null, phone: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
