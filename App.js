import React, { useState } from 'react';
import { TextInput, FlatList, StyleSheet, Text, View, Button, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [showMap, setShowMap] = useState(false); // State variable to toggle map visibility
  const { width, height } = Dimensions.get('window'); // Get the width and height of the device screen
  const [items, setItems] = useState([]); // State variable to store the list items
  const [input, setInput] = useState(''); // State variable to store the input value

  // Function to add item to the list
  const addItem = () => {
    if (input.trim()) {
      setItems([...items, input.trim()]); // Add the trimmed input value to the items array
      setInput(''); // Clear the input field
    }
  };

  // Function to clear the list
  const clearList = () => {
    setItems([]); // Clear the items array
  };

  return (
    <View style={styles.container}>
      {showMap ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 48.2082,
              longitude: 16.3738,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: 48.2082, longitude: 16.3738 }}
              title="Vienna"
              description="Vienna, Austria"
            />
          </MapView>
          <View style={[styles.circle, { top: height / 2 - 50, left: width / 2 - 50 }]} />
          <TouchableOpacity style={styles.backButton} onPress={() => setShowMap(false)}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Clear List Button in the top left corner */}
          <TouchableOpacity style={styles.clearListButton} onPress={clearList}>
            <Text style={styles.clearListButtonText}>Clear List</Text>
          </TouchableOpacity>
          <View style={styles.listContainer}>
            <Text style={styles.headerText}>
              Type user to add them to leaderboard. Press Show Map to see the map of Vienna.
            </Text>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Enter item"
            />
            <Button
              onPress={addItem}
              title="Add Item"
            />
            <FlatList
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
            />
          </View>
          {/* Show Map Button in the top right corner */}
          <TouchableOpacity style={styles.showMapButton} onPress={() => setShowMap(true)}>
            <Text style={styles.showMapButtonText}>Show Map</Text>
          </TouchableOpacity>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

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
