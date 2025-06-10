import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.button.border.radius,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: theme.button.text.large,
    fontWeight: "bold",
    color: theme.button.text.color,
  },
  closeButton: {
    padding: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  resetButton: {
    flex:1
  },
  applyButton: {
    backgroundColor: theme.button.color.primary,
  },
  resetButtonText: {
    color: theme.button.text.color,
    fontWeight: "bold",
  },
  applyButtonText: {
    color: theme.button.text.color,
    fontWeight: "bold",
  },
});