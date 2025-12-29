import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    name: localStorage.getItem("name") || null,
    id: localStorage.getItem("id") || null,
  });

  const login = (token, role, name, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("id", id);

    setUser({ token, role, name, id });
  };

  const logout = () => {
    localStorage.clear();
    setUser({ token: null, role: null, name: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
