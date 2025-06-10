import { theme } from '@/theme/theme';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flex:1,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: { 
    fontSize: theme.button.text.medium,
    color: theme.colors.textAltern,
    fontFamily: theme.fonts.primary,
  },

  searchInput: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    height: 40,
    fontFamily: theme.fonts.primary,
    fontSize: theme.button.text.medium,
    backgroundColor:"white"
  },
  
  scrollView: {
    flex: 1,
  },
  listContent: {
    gap: 4,
  },
  loadingText: {
    fontSize: theme.button.text.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noItemsText: {
    fontSize: theme.text.regular,
    fontFamily: theme.fonts.primary,
    color: theme.colors.text,  
    textAlign: 'center',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
