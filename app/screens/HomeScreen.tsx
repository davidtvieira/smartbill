import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import Button from "../../components/buttons/Button";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#273C47",
        gap: 20,
      }}
    >
      <View style={{ width: "100%" }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            color: "#F47A64",
            fontWeight: "bold",
          }}
        >
          A minha
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 50,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Smart Bill
        </Text>
      </View>

      <View style={{ width: "100%", gap: 10 }}>
        <Button
          title="Smart Bill"
          onPress={() => navigation.navigate("SmartBill")}
          variant="primary"
        />
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <Button
            title="Receitas"
            onPress={() => console.log("Button clicked")}
            variant="disabled"
          />
          <Button
            title="Dividir Despesas"
            onPress={() => console.log("Button clicked")}
            variant="disabled"
          />
        </View>
      </View>
    </View>
  );
}
