import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import SmartBill from "./screens/SmartBill";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              padding: 20,
              backgroundColor: "#273C47",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SmartBill" component={SmartBill} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
