import { View } from "react-native";
import Button from "../components/Button"; // Importa o botão
import styles from "../styles"; // Importa os estilos

export default function Index() {
  return (
    <View style={styles.background}>
      <Button
        title="Click Me"
        onPress={() => console.log("Button clicked")}
        textStyle={undefined}
      />
    </View>
  );
}
