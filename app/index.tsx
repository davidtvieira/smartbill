import { initDB } from "@/services/database/db";
import { theme } from "@/theme/theme";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import AddSmartBill from "./screens/AddSmartBill/AddSmartBill/AddSmartBill";
import SettingUpSmartBill from "./screens/AddSmartBill/SettingUpSmartBill/SettingUpSmartBill";
import FilterScreen from "./screens/FilterScreen/FilterScreen";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen/SettingsScreen";

const Stack = createNativeStackNavigator();
const backgroundColor = theme.colors.primary;

export default function Index() {
  const [fontsLoaded] = useFonts({
    "Roboto_Condensed-Regular": require("../assets/Fonts/Roboto_Condensed-Regular.ttf"),
    "Roboto_Condensed-Bold": require("../assets/Fonts/Roboto_Condensed-Bold.ttf"),
  });

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

  if (!fontsLoaded) {
    return (
      <ActivityIndicator
        size="large"
        color="#fff"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <NavigationIndependentTree>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              navigationBarColor: backgroundColor,
              contentStyle: {
                padding: 10,
                backgroundColor: backgroundColor,
                flex: 1,
                justifyContent: "center",
              },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddSmartBill" component={AddSmartBill} />
            <Stack.Screen
              name="SettingUpSmartBill"
              component={SettingUpSmartBill}
            />
            <Stack.Screen name="FilterScreen" component={FilterScreen} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </>
  );
}
