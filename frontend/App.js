import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  const [ready, setReady] = useState(false);

  // ⚠️ TEMPORARY DEV-ONLY BLOCK — REMOVE once Member 1's real login writes
  // a real token into AsyncStorage on successful sign-in.
  useEffect(() => {
    const DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlN0dWRlbnQiLCJlbWFpbCI6ImRldi50ZXN0ZXJAYWl1Yi5lZHUiLCJpc1N1cGVyQWRtaW4iOmZhbHNlLCJpYXQiOjE3ODk3ODYyNzB9.eauJIwg08qCJinYEe8GtybEldQw2pheEVUgh_rOazUg";
    AsyncStorage.setItem("userToken", DEV_TOKEN).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </AppProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}