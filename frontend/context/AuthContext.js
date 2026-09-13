// context/AuthContext.js
// Handles "who is logged in". login/register/logout/forgotPassword now call
// the real backend and persist the JWT in AsyncStorage under "userToken" —
// the exact key frontend/api/axios.js's interceptor already reads on every
// request, so no extra token-attachment code is needed here.
// (Member 1 - Zihadul, Document 2)
//
// updateProfile/refreshProfile are UNCHANGED from the existing repo state
// (Member 4 - Emrul's profile/admin work, already wired to the backend).

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usersData from "../data/users";
import API from "../api/axios";
import { fetchProfileApi, updateProfileApi } from "../api/profile.api";

export const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "userToken"; // must match frontend/api/axios.js's interceptor key

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(usersData);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  // On app start, restore a saved session (if any) so the user doesn't have
  // to log in again every time the app is reopened.
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (savedToken) {
          // axios.js's interceptor reads the token from AsyncStorage itself
          // on every request, so nothing extra needs to be attached here.
          const response = await API.get("/auth/me");
          setUser(response.data.data.user);
        }
      } catch (err) {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user: loggedInUser } = response.data.data;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Login failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (newUser) => {
    setAuthLoading(true);
    try {
      const response = await API.post("/auth/register", newUser);
      return response.data.data.user;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Registration failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setAuthLoading(true);
    try {
      const response = await API.post("/auth/forgot-password", { email });
      return response.data.message;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || "Request failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  // ---- UNCHANGED from the existing repo (Emrul - Document 5) ----
  const updateProfile = async (updates) => {
    const updated = await updateProfileApi(updates);
    setUser(updated);
    return updated;
  };

  const refreshProfile = async () => {
    const profile = await fetchProfileApi();
    setUser(profile);
    return profile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        authLoading,
        bootstrapping,
        login,
        register,
        forgotPassword,
        logout,
        updateProfile,
        refreshProfile,
        setUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
