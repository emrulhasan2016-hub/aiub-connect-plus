// context/AuthContext.js
// Handles "who is logged in" using local state only (no backend).
// Member 1 (Auth) mainly writes into this. Everyone else just reads `user` from useAuth().

import React, { createContext, useState } from "react";
import usersData from "../data/users";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // In a real app this would come from a server. Here we just search the mock array.
  const [users, setUsers] = useState(usersData);
  const [user, setUser] = useState(null); // currently logged-in user object, or null
  const [authLoading, setAuthLoading] = useState(false);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setAuthLoading(true);
      // fake network delay so loading states are visible/testable
      setTimeout(() => {
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        setAuthLoading(false);
        if (found) {
          if (found.status === "banned") {
            reject(new Error("This account has been suspended by an administrator."));
            return;
          }
          setUser(found);
          resolve(found);
        } else {
          reject(new Error("Invalid email or password."));
        }
      }, 700);
    });
  };

  const register = (newUser) => {
    return new Promise((resolve, reject) => {
      setAuthLoading(true);
      setTimeout(() => {
        setAuthLoading(false);
        const exists = users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
        if (exists) {
          reject(new Error("An account with this AIUB email already exists."));
          return;
        }
        const created = {
          id: "u" + (users.length + 1),
          followers: [],
          following: [],
          status: "active",
          bio: "",
          ...newUser,
        };
        setUsers((prev) => [...prev, created]);
        resolve(created);
      }, 700);
    });
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...updates } : u)));
  };

  return (
    <AuthContext.Provider
      value={{ user, users, authLoading, login, register, logout, updateProfile, setUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
}
