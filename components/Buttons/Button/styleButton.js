import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  button: {
    borderRadius: theme.button.border.radius,
    padding: 10,
    
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: theme.button.text.medium,
    color: theme.button.text.color,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
  },
  primary: {
    backgroundColor: theme.button.color.primary,
  },
  secondary: {
    backgroundColor: theme.button.color.secondary,
  },
  third: {
    backgroundColor: theme.button.color.third,
  },
  disabled : {
    opacity: theme.button.color.disabled
  },
  onlyText: {
    backgroundColor: theme.button.color.onlytext,
  },
  danger: {
    backgroundColor: theme.button.color.danger,
  },
});
