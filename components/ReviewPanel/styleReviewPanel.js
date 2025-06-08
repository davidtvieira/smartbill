import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.primary,
  },
  title: {
    color: theme.button.text.color,
    fontSize: theme.button.text.Primarysize,
    fontWeight: "bold",
    marginBottom: 5,
  },
});