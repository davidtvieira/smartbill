import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Button from "../Components/Buttons/Button-v1/Button";

export default function Index() {
  return (
    <SafeAreaProvider
      style={[
        {
          padding: 20,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#273C47",
        },
      ]}
    >
      <View style={{ width: "100%", gap: 10 }}>
        <View>
          <Button
            title="Smart Bill"
            onPress={() => console.log("Button clicked")}
            variant="primary"
          />
        </View>
        <View style={{ flex: 1, flexDirection: "row", gap: 10, width: "100%" }}>
          <Button
            title="Receitas"
            onPress={() => console.log("Button clicked")}
            variant="secondary"
          />
          <Button
            title="Dividir Despesas"
            onPress={() => console.log("Button clicked")}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}
