import { initDB } from "@/services/database/db";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import AddSmartBill from "./screens/AddSmartBill";
import HomeScreen from "./screens/HomeScreen";
import SettingUpSmartBill from "./screens/SettingUpSmartBill";
const Stack = createNativeStackNavigator();

export default function Index() {
  useEffect(() => {
    const startDB = async () => {
      try {
        await initDB();
      } catch (err) {
        console.error("Error during db startup: ", err);
      }
    };
    startDB();
  }, []);

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
              justifyContent: "center",
              width: "100%",
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddSmartBill" component={AddSmartBill} />
          <Stack.Screen
            name="SettingUpSmartBill"
            component={SettingUpSmartBill}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
