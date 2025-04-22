import TopText from "@/components/TopText/TopTex";
import Button from "@/components/buttons/Button";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

export default function HomeScreen() {
  const navigation = useNavigation() as any;

  return (
    <View style={{ gap: 20 }}>
      <TopText first="A minha" second="Smart Bill" />
      <View style={{ gap: 10 }}>
        <Button
          title="Smart Bill"
          onPress={() => navigation.navigate("AddSmartBill")}
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
