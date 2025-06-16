import { theme } from "@/theme/theme";
import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  input: {
    color: theme.button.text.color,
    backgroundColor: theme.colors.third,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.button.border.radius,
    marginBottom: 10,
  },
  label: {
    color: theme.button.text.color,
    fontSize: theme.button.text.Primarysize,
    marginBottom: 5,
    fontWeight: "bold",
  },
  modal: {
    minWidth: 300,
    padding: 20,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.button.border.radius,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dateTimeInput: {
    backgroundColor: theme.colors.third,
    padding: 12,
    borderRadius: theme.button.border.radius,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  dateTimeText: {
    color: theme.button.text.color,
    fontSize: 16,
    textAlign: 'center',
  },
  dateTimePicker: {
    marginVertical: 10,
    alignSelf: 'center',
    width: Platform.OS === 'ios' ? '100%' : 'auto',
  },
});
