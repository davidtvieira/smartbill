import { Text, TouchableOpacity } from "react-native";
import styles from "./styleButton";

export default function Button({ title, onPress, variant = 'primary' }) {
  // Determine the style based on the variant
  const buttonStyle = variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary;
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.buttonText]}>{title}</Text>
    </TouchableOpacity>
  );
}
