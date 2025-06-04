import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styleItemButton";

export default function ItemButton({
  title,
  subtitle,
  value,
  onPress,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={{ alignItems: "flex-end" }}>
          {value && <Text style={styles.value}>{value}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
}
