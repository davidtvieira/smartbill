import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    gap: 10,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    gap: 1,
  },
  itemContainer: {
    padding: 16,
    backgroundColor: "#F4F4F4F4",
    borderRadius: 15,
    marginBottom: 16,
  },
  itemButton: {
    width: "100%",
  },    
});