import { createContext, useState } from "react";

export const AuthContext = createContext();
export const isLoggedIn = () =>
  Boolean(localStorage.getItem("token"));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    name: localStorage.getItem("name") || null,
    email: localStorage.getItem("email") || null,
    phone: localStorage.getItem("phone") || null,
    id: localStorage.getItem("id") || null,
  });

  const login = (token, role, name, user, email, phone, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    localStorage.setItem("id", id);

    setUser({ token, role, name, email, phone, id });
  };

  const logout = () => {
    localStorage.clear();
    setUser({ token: null, role: null, name: null, email: null, phone: null, id: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
