import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    maxHeight: 300, 
    paddingBottom:20
  },
  listContent: {
    gap: 10,
    paddingBottom: 20, 
  },
  rowButtons: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  error: {
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
  },
  titleText: {
    fontSize: theme.button.text.large,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  loadingText: {
    color: theme.colors.text,
    textAlign: "center",
  },
  noItemsContainer: {
    paddingTop: 16,
  },
  noItemsText: {
    color: theme.colors.text,
    textAlign: "center",
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  }
});
