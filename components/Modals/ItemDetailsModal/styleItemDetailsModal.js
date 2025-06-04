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
    borderRadius: 10,
    maxHeight: "80%",
    width: "90%",
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  
});

export default styles;
