import { initDB } from "@/services/database/db";
import { theme } from "@/theme/theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AddSmartBill from "./screens/AddSmartBill/AddSmartBill";
import SeeAll from "./screens/Filter/SeeAll";
import HomeScreen from "./screens/Home/Home";
import Settings from "./screens/Settings/Settings";
import SettingUpSmartBill from "./screens/SettingUpSmartBill/SettingUpSmartBill";

const Stack = createNativeStackNavigator();
const backgroundColor = theme.colors.secondary;

export default function Index() {
  const [fontsLoaded] = useFonts({
    "Roboto_Condensed-Regular": require("../assets/fonts/Roboto_Condensed-Regular.ttf"),
    "Roboto_Condensed-Bold": require("../assets/fonts/Roboto_Condensed-Bold.ttf"),
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
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: backgroundColor,
              justifyContent: "center",
              paddingVertical: 20,
              paddingHorizontal: 10,
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddSmartBill" component={AddSmartBill} />
          <Stack.Screen
            name="SettingUpSmartBill"
            component={SettingUpSmartBill}
          />
          <Stack.Screen name="Filter" component={SeeAll} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
