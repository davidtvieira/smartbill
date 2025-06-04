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
    backgroundColor: '#2C4450',
    padding: 15,
    borderRadius: 8,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',

  },
  subtitle: {
    fontSize: 14,
    color: 'white',
  },    
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});