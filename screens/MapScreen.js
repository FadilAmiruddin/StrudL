import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Button, SafeAreaView, Linking, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StatusBar } from 'expo-status-bar';

import styles from '../HelperJsFiles/styles';
import useLocation from '../HelperJsFiles/locationPerms';
import ShroudContainer from '../HelperJsFiles/shroud';

import viennaStorage from '../HelperJsFiles/viennaStorage';
import { vienna } from '../HelperJsFiles/city';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAlZW0NrFKmUOazzCx8RUfJqReZ-GB_7xg';

export function MapScreen() {
  const [directions, setDirectionsState] = useState(null);
  const myLocation = useLocation();
  const shroudContainerRef = useRef(null);
  const mapViewRef = useRef(null);

  const updateDirections = (origin, destination) => {
    if (origin.latitude && origin.longitude) {
      setDirectionsState({
        origin: { latitude: origin.latitude, longitude: origin.longitude },
        destination: { latitude: destination.latitude, longitude: destination.longitude },
      });
    }
  };

  useEffect(() => {
    if (myLocation.latitude && myLocation.longitude) {
      updateDirections(myLocation, { latitude: 48.2081743, longitude: 16.3738189 }); // Default to St. Stephen's Cathedral, Vienna
    }
  }, [myLocation]);

  const handleMarkerPress = (location) => {
    if (myLocation.latitude && myLocation.longitude) {
      updateDirections(myLocation, { latitude: location.latitude, longitude: location.longitude });
    } else {
      console.error('Current location is not available');
    }
  };

  const openDirections = (destination) => {
    if (Platform.OS === 'ios') {
      const url = `http://maps.apple.com/?saddr=${myLocation.latitude},${myLocation.longitude}&daddr=${destination.latitude},${destination.longitude}`;
      Linking.openURL(url);
    } else {
      Linking.openURL(`google.navigation:q=${destination.latitude},${destination.longitude}`);
    }
  };

  const handleRegionChangeComplete = (newRegion) => {
    if (!isViennaInView(newRegion)) {
      resetToVienna();
    }
  };

  const isViennaInView = (region) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    const viennaLatitude = 48.2081743;
    const viennaLongitude = 16.3738189;

    return (
      latitude - latitudeDelta / 2 <= viennaLatitude &&
      latitude + latitudeDelta / 2 >= viennaLatitude &&
      longitude - longitudeDelta / 2 <= viennaLongitude &&
      longitude + longitudeDelta / 2 >= viennaLongitude
    );
  };

  const resetToVienna = () => {
    const initialViennaRegion = {
      latitude: myLocation.latitude || 48.2081743,
      longitude: myLocation.longitude || 16.3738189,
      latitudeDelta: 0.2922,
      longitudeDelta: 0.2921,
    };
    mapViewRef.current.animateToRegion(initialViennaRegion, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: myLocation.latitude || 48.2081743,
          longitude: myLocation.longitude || 16.3738189,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
        ref={mapViewRef}
      >
        {myLocation.latitude && myLocation.longitude && (
          <Marker
            coordinate={{ latitude: myLocation.latitude, longitude: myLocation.longitude }}
            title="My Location"
            description="Current Location"
            pinColor="blue"
          >
            <Callout>
              <View>
                <Text>My Location</Text>
                <Text>Current Location</Text>
              </View>
            </Callout>
          </Marker>
        )}
        {viennaStorage.json.landmarkLocations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.title}
            description={location.description}
            pinColor="red"
            onPress={() => handleMarkerPress(location)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{location.title}</Text>
                <Text style={styles.calloutDescription}>{location.description}</Text>
                <Button 
                  title="Directions" 
                  onPress={() => openDirections(location)}
                  style={styles.calloutButton}
                />
              </View>
            </Callout>
          </Marker>
        ))}
        {directions && (
          <MapViewDirections
            origin={directions.origin}
            destination={directions.destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            onError={(errorMessage) => console.error('MapViewDirections Error:', errorMessage)}
          />
        )}
        <ShroudContainer ref={shroudContainerRef} />
      </MapView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default MapScreen