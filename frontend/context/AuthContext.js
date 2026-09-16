import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/axios";
import { fetchProfileApi, updateProfileApi } from "../api/profile.api";

export const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "userToken"; // must match frontend/api/axios.js's interceptor key

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (savedToken) {
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
      throw new Error(
        err.response?.data?.message || err.message || "Login failed.",
      );
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
      throw new Error(
        err.response?.data?.message || err.message || "Registration failed.",
      );
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
      throw new Error(
        err.response?.data?.message || err.message || "Request failed.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  };

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
        authLoading,
        bootstrapping,
        login,
        register,
        forgotPassword,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
