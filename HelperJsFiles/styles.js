// styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get the width and height of the device screen

export const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 16,
},
text: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
},
districtContainer: {
    marginBottom: 24,
},
districtName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
},
questContainer: {
    marginBottom: 8,
},
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  cameraButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  // Add these to your existing styles
customCallout: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 15,
  width: 200,
},
calloutTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 5,
},
calloutDescription: {
  fontSize: 14,
  marginBottom: 5,
},
calloutInstructions: {
  fontSize: 12,
  color: '#666',
  marginBottom: 10,
},
calloutButton: {
  backgroundColor: '#007AFF',
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
},
calloutButtonText: {
  color: 'white',
  fontSize: 14,
},
});

export default styles;
