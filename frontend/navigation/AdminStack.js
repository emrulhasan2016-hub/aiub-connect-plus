import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import routes from "../constants/routes";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import UserManagementScreen from "../screens/UserManagementScreen";
import SystemLogsScreen from "../screens/SystemLogsScreen";
import AppSettingsScreen from "../screens/AppSettingsScreen";
import AddAdminScreen from "../screens/AddAdminScreen";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator
      initialRouteName={routes.ADMIN_DASHBOARD}
      screenOptions={{
        headerStyle: { backgroundColor: "#003366" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name={routes.ADMIN_DASHBOARD}
        component={AdminDashboardScreen}
        options={{ title: "Admin Dashboard" }}
      />
      <Stack.Screen
        name={routes.USER_MANAGEMENT}
        component={UserManagementScreen}
        options={{ title: "User Management" }}
      />
      <Stack.Screen
        name={routes.SYSTEM_LOGS}
        component={SystemLogsScreen}
        options={{ title: "System Logs" }}
      />
      <Stack.Screen
        name={routes.APP_SETTINGS}
        component={AppSettingsScreen}
        options={{ title: "App Settings" }}
      />
      <Stack.Screen
        name={routes.ADD_ADMIN}
        component={AddAdminScreen}
        options={{ title: "Add New Admin" }}
      />
    </Stack.Navigator>
  );
}
