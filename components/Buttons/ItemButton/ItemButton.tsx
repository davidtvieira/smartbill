import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styleItemButton";

export default function ItemButton({
  title,
  subtitle,
  value,
  onPress,
  disabled,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        disabled={disabled}
      >
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
