import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../context/AuthContext";
import routes from "../constants/routes";
import HomeStack from "../feed/navigation/HomeStack";
import SearchStack from "../feed/navigation/SearchStack";
import CreateStack from "../feed/navigation/CreateStack";
import GroupsStack from "../groups/navigation/GroupsStack";
import ProfileStack from "../profile/navigation/ProfileStack";
import AdminStack from "./AdminStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "Admin";

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={routes.TAB_HOME} component={HomeStack} />
      <Tab.Screen name={routes.TAB_SEARCH} component={SearchStack} />
      <Tab.Screen name={routes.TAB_CREATE} component={CreateStack} />
      <Tab.Screen name={routes.TAB_GROUPS} component={GroupsStack} />
      <Tab.Screen name={routes.TAB_PROFILE} component={ProfileStack} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminStack} />}
    </Tab.Navigator>
  );
}
