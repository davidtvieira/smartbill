import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import SmartBill from "./screens/SmartBill";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    // ...
    <SafeAreaProvider>
      <NavigationIndependentTree>
        <NavigationContainer>
          <Stack.Navigator
          //  screenOptions={{
          //    headerShown: false,
          // }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SmartBill" component={SmartBill} />
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </SafeAreaProvider>
  );
}
