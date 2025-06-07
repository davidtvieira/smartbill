import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styleTopText";

const MAX_TEXT_LENGTH = 18; // Maximum number of characters to show

interface TopTextProps {
  first?: string;
  second?: string;
  third?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export default function TopText({
  first,
  second,
  clickable = false,
  onClick,
}: TopTextProps) {
  const truncatedFirst =
    first && first.length > MAX_TEXT_LENGTH
      ? `${first.substring(0, MAX_TEXT_LENGTH)}...`
      : first;

  const firstTextStyle: StyleProp<TextStyle> = [
    styles.first,
    clickable && styles.underline,
  ];

  return (
    <View
      style={{
        flexDirection: "column",
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={onClick} disabled={!clickable}>
          {truncatedFirst && (
            <Text style={firstTextStyle}>{truncatedFirst}</Text>
          )}
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
