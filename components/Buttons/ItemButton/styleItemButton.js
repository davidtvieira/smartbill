import { theme } from '@/theme/theme';
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.button.color.secondary,
    padding: 15,
    borderRadius: theme.button.border.radius,
  },

  title: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.button.text.medium,
    color: theme.button.text.color,

  },
  subtitle: {
    fontSize: theme.button.text.medium,
    fontFamily: theme.fonts.primary,
    color: theme.button.text.color,
  },    
  value: {
    fontSize: theme.button.text.large,  
    fontFamily: theme.fonts.bold,
    color: theme.button.text.color,
  },
});