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
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
});