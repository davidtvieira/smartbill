import { theme } from '@/theme/theme';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    
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
    gap: 8,
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
  loadingText: {
    fontSize: theme.button.text.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  noItemsText: {
    fontSize: theme.button.text.medium,
    color: '#333',
    textAlign: 'center',
  },
});
