import { Text, TouchableOpacity } from "react-native";
import styles from "../styles";

export default function Button({ title, onPress,  textStyle }) {
  return (
    <TouchableOpacity style={[styles.button]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
