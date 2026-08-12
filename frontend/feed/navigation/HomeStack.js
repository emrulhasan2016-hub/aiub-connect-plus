import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../constants/routes";
import HomeFeedScreen from "../screens/HomeFeedScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import CommentsScreen from "../screens/CommentsScreen";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.HOME_FEED} component={HomeFeedScreen} />
      <Stack.Screen name={routes.POST_DETAILS} component={PostDetailsScreen} />
      <Stack.Screen name={routes.COMMENTS} component={CommentsScreen} />
    </Stack.Navigator>
  );
}
