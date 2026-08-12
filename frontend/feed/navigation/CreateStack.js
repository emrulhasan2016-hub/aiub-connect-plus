// navigation/CreateStack.js
// Member 2 owns this file + Create Post screen (reached from the middle tab).
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../constants/routes";
import CreatePostScreen from "../screens/CreatePostScreen";

const Stack = createStackNavigator();

export default function CreateStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.CREATE_POST} component={CreatePostScreen} />
    </Stack.Navigator>
  );
}
