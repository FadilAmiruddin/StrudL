// styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get the width and height of the device screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // Center elements vertically
  },
  listContainer: {
    alignItems: 'center', // Center elements horizontally
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Fill the entire container
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent background
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  showMapButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent background
    padding: 10,
    borderRadius: 5,
  },
  showMapButtonText: {
    color: 'white',
    fontSize: 16,
  },
  clearListButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent background
    padding: 10,
    borderRadius: 5,
  },
  clearListButtonText: {
    color: 'white',
    fontSize: 16,
  },
  headerText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%', // Make the input field take 80% of the container width
  },
  item: {
    padding: 10,
    fontSize: 18,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default styles;
