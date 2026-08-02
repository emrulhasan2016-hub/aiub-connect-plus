// navigation/HomeStack.js
// Member 2 owns this file + Home/Post/Comments screens.
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import routes from "../constants/routes";
import HomeFeedScreen from "../screens/home/HomeFeedScreen";
import PostDetailsScreen from "../screens/home/PostDetailsScreen";
import CommentsScreen from "../screens/home/CommentsScreen";

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
