import { theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    width: "90%",
    maxHeight:"80%",
    borderRadius: theme.button.border.radius,
    alignSelf: "center",
  },
  modalTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.text.large,
    marginBottom: 10,
    color: theme.colors.text,
  },
  modalText: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.text.medium,
    marginBottom: 10,
    color: theme.colors.text,
  },
  modalTextInfo: {
    fontFamily: theme.fonts.primary,
    fontSize: theme.text.medium,
    marginBottom: 10,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 15,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: theme.button.border.radius,
    width: '80%',
    maxWidth: 400,
    
  },
  dialogTitle: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  buttonContainer: {
    gap: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: theme.colors.text.large,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: theme.colors.text.color,
    fontFamily: theme.fonts.bold,
  },
  text: {
    fontSize: theme.colors.text.medium,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.text.color,
    fontFamily: theme.fonts.primary,
  },
  container: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default styles;
