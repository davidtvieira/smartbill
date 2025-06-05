import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  apiKeyMessage: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    borderRadius: 4,
  },
  apiKeyText: {
    color: '#856404',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonWrapper: {
    flex: 1,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
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
  productItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  error: {
    color: "#dc3545",
    textAlign: "center",
    marginTop: 20,
  },
});
