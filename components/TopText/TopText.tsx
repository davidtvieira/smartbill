import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styleTopText";

interface TopTextProps {
  first?: string;
  second?: string;
  third?: string;
  clickable?: boolean;
  onFirstPress?: () => void;
}

export default function TopText({
  first,
  second,
  clickable = false,
  onFirstPress,
}: TopTextProps) {
  const firstTextStyle: StyleProp<TextStyle> = [
    styles.first,
    clickable && styles.underline,
  ];

  return (
    <View
      style={{
        flexDirection: "column",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={onFirstPress} disabled={!clickable}>
          {first && <Text style={firstTextStyle}>{first}</Text>}
        </TouchableOpacity>
        {second && <Text style={styles.second}>{second}</Text>}
      </View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 40,
          color: "#FFFFFF",
          fontWeight: "bold",
        }}
      >
        Smart Bill
      </Text>
    </View>
  );
}
