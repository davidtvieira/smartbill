import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      paddingVertical: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    chartContainer: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    numberContainer: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    number: {
      fontFamily: theme.fonts.bold,
      color: theme.colors.text,
    },
  });
  