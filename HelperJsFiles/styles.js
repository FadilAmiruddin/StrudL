// styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  listContainer: {
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    width: '80%',
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
  // New styles for the updated UI
  header: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  landmarkDialog: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  landmarkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  landmarkImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  objectivesContainer: {
    marginVertical: 10,
  },
  objectivesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  landmarkButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  landmarkButtonText: {
    color: 'white',
    fontSize: 16,
  },
  landmarkIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  landmarkIndicatorText: {
    color: 'white',
    fontSize: 14,
  },
  calloutImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  calloutContainer: {
    width: 200,
    alignItems: 'center',
  },
});

export default styles;