import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [showMap, setShowMap] = useState(false);

  return (
    <View style={styles.container}>
      {showMap ? (
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
      ) : (
        <>
          <Text>Open up App.js to start working on your app!</Text>
          <Button title="Show Map" onPress={() => setShowMap(true)} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
