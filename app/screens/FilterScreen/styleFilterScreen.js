import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 250,
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingBottom: 20,
    
  },
  itemContainer: {
    marginBottom: 10,
  },
  loadingContainer: {
    paddingVertical: 20,
  },
  searchContainer: {
    marginBottom: 16,

  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: "relative",

    zIndex: 1000,
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownHeader: {
    zIndex: 1,
  },
  dropdown: {
    position: "absolute",
    top: 60, 
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});