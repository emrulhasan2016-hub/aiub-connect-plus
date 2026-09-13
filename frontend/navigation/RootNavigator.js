import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

export default function RootNavigator() {
  const { user, bootstrapping } = useContext(AuthContext);

  if (bootstrapping) {
    return <Loading text="Restoring your session..." />;
  }

  return (
    <NavigationContainer>
      {/* ইউজার লগইন করা থাকলে Main Tabs দেখাবে, না থাকলে Auth Stack */}
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
