import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  first: {
    fontSize: 30,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },
  second: {
    fontSize: 30,
    color: theme.text.color,
    fontFamily: theme.fonts.bold,
  },
  third: {
    fontSize: 40,
    color: theme.text.color,
    fontFamily: theme.fonts.bold,
  },
  underline: {
    textDecorationLine: "underline",
  },
});
