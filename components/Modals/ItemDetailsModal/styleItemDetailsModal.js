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
    backgroundColor: theme.colors.secondary,
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
  confirmationDialog: {
    backgroundColor: theme.colors.secondary,
    padding: 20,
    borderRadius: theme.button.border.radius, 
    alignItems: "center",
    justifyContent: "center",
   
  },
  confirmationTitle: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    fontFamily: theme.fonts.bold,
    fontSize: theme.text.large,
    color: theme.colors.text,
    
  },
  buttonContainer: {
    gap: 16,
    paddingTop: 16,
    flexDirection: "column",
  },
  title: {
    fontSize: theme.colors.text.large,
    fontFamily: theme.fonts.bold,
    marginBottom: 10,
    textAlign: 'center',
    color: theme.colors.text.color,
    
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
  confirmationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmationDialogNew: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  confirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
    
  },
  confirmationTitleNew: {
    fontSize: theme.text.large,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  confirmationMessage: {
    fontSize: theme.text.medium,
    color: theme.colors.text,
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: theme.fonts.primary,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  confirmationButtonWrapper: {
    marginLeft: 10,
    flex: 1,
  },

});

export default styles;
