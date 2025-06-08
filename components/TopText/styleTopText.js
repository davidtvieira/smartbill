import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  first: {
    textAlign: "center",
    fontSize: 25,
    color: theme.colors.third,
    fontFamily: theme.fonts.bold,
  },
  second: {
    textAlign: "center",
    fontSize: 25,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  third: {
    textAlign: "center",
    fontSize: 40,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  underline: {
    textDecorationLine: "underline",
  },
});
