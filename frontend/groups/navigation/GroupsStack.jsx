import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import routes from "../constants/routes";
import colors from "../constants/colors";
import GroupsScreen from "../screens/GroupsScreen";
import GroupDetailsScreen from "../screens/GroupDetailsScreen";
import GroupChatScreen from "../screens/GroupChatScreen";
import NoticeBoardScreen from "../screens/NoticeBoardScreen";
import NoticeDetailsScreen from "../screens/NoticeDetailsScreen";
import JobPortalScreen from "../screens/JobPortalScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";

const Stack = createStackNavigator();
export default function GroupsStack() {
return (
<Stack.Navigator
 screenOptions={{
headerStyle: { backgroundColor: colors.navyDark },
headerTintColor: colors.white,
headerTitleStyle: { fontWeight: "bold" },
 headerBackTitleVisible: false,
 }}
>
<Stack.Screen
name={routes.GROUPS}
 component={GroupsScreen}
options={{ title: "Groups & Hub" }}
/>
<Stack.Screen
name={routes.GROUP_DETAILS}
component={GroupDetailsScreen}
options={{ title: "Group Information" }}
/>
<Stack.Screen
name={routes.GROUP_CHAT}
component={GroupChatScreen}
options={{ title: "Group Discussion" }}
/>
<Stack.Screen
name={routes.NOTICE_BOARD}
component={NoticeBoardScreen}
options={{ title: "Campus Notice Board" }}
/>
<Stack.Screen
name={routes.NOTICE_DETAILS}
component={NoticeDetailsScreen}
options={{ title: "Notice Details" }}
/>
<Stack.Screen
name={routes.JOB_PORTAL}
 component={JobPortalScreen}
 options={{ title: "Job & Alumni Portal" }}
/>
<Stack.Screen
name={routes.JOB_DETAILS}
component={JobDetailsScreen}
options={{ title: "Opportunity Details" }}
/>
</Stack.Navigator>
);
}