import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center",
  },
  listContainer: {
    flex:1,
    paddingTop: 10,
  },
  listContent: {
    gap: 4,
  },
  rowButtons: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  error: {
    color: theme.colors.text,
    textAlign: "center",
    fontSize: theme.text.medium,
    fontFamily: theme.fonts.primary,
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 16,
    
  },
  titleText: {
    fontSize: theme.button.text.large,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
    marginTop: 50,

  },
  loadingText: {
    color: theme.colors.text,
    textAlign: "center",
    fontSize: theme.text.medium,
    fontFamily: theme.fonts.primary,
  },
  noItemsContainer: {
    paddingTop: 16,
  },
  noItemsText: {
    color: theme.colors.text,
    fontSize: theme.text.medium,
    fontFamily: theme.fonts.primary,
    textAlign: "center",
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  apiKeyMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    color: "gray",
    textAlign: "center",
    fontSize: theme.text.medium,
    fontFamily: theme.fonts.primary
  },
  infoIcon: {
    marginRight: 4,
  },
});
