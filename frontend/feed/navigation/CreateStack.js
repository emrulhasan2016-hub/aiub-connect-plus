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
