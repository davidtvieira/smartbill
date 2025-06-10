import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  input: {
    color: theme.button.text.color,
    backgroundColor: theme.colors.third,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: theme.button.border.radius,
        marginBottom: 10,
    },
    label: {
      color: theme.button.text.color,
      fontSize: theme.button.text.Primarysize,
      marginBottom: 5,
      fontWeight: "bold",
    },
    modal: {
      minWidth: 300,
      padding: 20,
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.button.border.radius,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  });
