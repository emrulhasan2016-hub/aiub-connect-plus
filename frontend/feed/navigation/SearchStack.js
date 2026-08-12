import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../constants/routes";
import SearchScreen from "../screens/SearchScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";

const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.SEARCH} component={SearchScreen} />
      <Stack.Screen name={routes.POST_DETAILS} component={PostDetailsScreen} />
    </Stack.Navigator>
  );
}
