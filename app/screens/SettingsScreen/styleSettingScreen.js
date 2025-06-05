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
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: "white",
  },
  input: {
    maxHeight: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
paddingLeft: 10,
    fontSize: 16,
    color: "white",
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
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
    fontSize: 14,
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
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
