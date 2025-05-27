import { initDB } from "@/services/database/db";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import AddSmartBill from "./screens/AddSmartBill/AddSmartBill";
import SettingUpSmartBill from "./screens/AddSmartBill/SettingUpSmartBill/SettingUpSmartBill";
import HomeScreen from "./screens/HomeScreen/HomeScreen";

const Stack = createNativeStackNavigator();
const backgroundColor = "#273C47";

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
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <NavigationIndependentTree>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: {
                padding: 10,
                backgroundColor: backgroundColor,
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
    </>
  );
}
