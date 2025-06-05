import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#273C47",
    padding: 20,
    width: "90%",
    maxHeight:"80%",
    borderRadius: 10,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "white",
  },
  closeButton: {
    backgroundColor: "#F47A64",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 15,
  },
  confirmationOverlay: {
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
    backgroundColor: '#273C47',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  confirmationButtons: {
    flexDirection: 'row',

    gap: 10,
  },
  confirmationButton: {
    flex: 1,
  },
});

export default styles;
