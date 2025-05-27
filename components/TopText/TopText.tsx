import { Text, View } from "react-native";
import styles from "./styleTopText";

interface TopTextProps {
  first: string;
  second: string;
}

export default function TopText({ first, second }: TopTextProps) {
  return (
    <View>
      <Text style={styles.first}>{first}</Text>
      <Text style={styles.second}>{second}</Text>
    </View>
  );
}
