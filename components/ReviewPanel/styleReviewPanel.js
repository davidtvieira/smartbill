import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    gap: 20,
    flex:1,
  },
  title: {
    color: theme.button.text.color,
    fontSize: theme.button.text.large,
    fontWeight: "bold",
    marginBottom: 10,
  },
});