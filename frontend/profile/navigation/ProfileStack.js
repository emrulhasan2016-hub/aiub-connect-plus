import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../constants/routes";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.PROFILE} component={ProfileScreen} />
      <Stack.Screen name={routes.EDIT_PROFILE} component={EditProfileScreen} />
      <Stack.Screen name={routes.SETTINGS} component={SettingsScreen} />
      <Stack.Screen
        name={routes.NOTIFICATIONS}
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
}
