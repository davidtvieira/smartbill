import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: theme.button.text.large,
    marginBottom: 8,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  input: {
    maxHeight: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingLeft: 10,
    fontSize: theme.button.text.medium,
    fontFamily: theme.fonts.primary,
    color: theme.colors.text,
    marginBottom: 16,
  },
  helperText: {
    fontSize: theme.button.text.medium,
    fontFamily: theme.fonts.primary,
    color: "gray",
    marginTop: 4,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  messageText: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: theme.button.text.medium,
    fontFamily: theme.fonts.primary,
    textAlign: "center",
  },
  successText: {
    color: "#34C759",
  },
  errorText: {
    color: "#FF3B30",
  },   
  dropdownButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownButtonText: {
    fontSize: theme.button.text.medium,
    fontFamily: theme.fonts.primary,
    color: theme.colors.textAltern,
  },
  dropdown: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 4,
    zIndex: 1000,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontFamily: theme.fonts.primary,
  },
  optionText: {
    fontSize: theme.button.text.medium,
    fontFamily: theme.fonts.primary,
    color: theme.colors.textAltern,
    textAlign: "center",
  },
  apiKeyContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    gap: 8,
    marginBottom: 8,
  },
});
