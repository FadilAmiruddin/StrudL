
/**
 * This file is the MapScreen compnent. it is used in Nav-Bar to display the map of Vienna and the locations of the quests. 
 */

import React, { useRef, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Button, SafeAreaView, Linking, Platform, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StatusBar } from 'expo-status-bar';
import CameraScreen from './CameraScreen';
import styles from '../HelperJsFiles/styles';
import useLocation from '../HelperJsFiles/locationPerms';
import ShroudContainer from '../HelperJsFiles/shroud';

import viennaStorage from '../HelperJsFiles/viennaStorage';
import { vienna } from '../HelperJsFiles/city';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import refreshIfFocused from '../HelperJsFiles/screenRerender';
import { getCompletedLandmarks } from '../HelperJsFiles/completedLandmarks';
import locations from '../HelperJsonFiles/quests.json';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAlZW0NrFKmUOazzCx8RUfJqReZ-GB_7xg'; // API Key

export const MAP_SCREEN_ID = "MapScreen"

/**
 * Represents the MapScreen component.
 * This component displays a map with markers for various locations.
 * Users can view their current location, get directions to a specific location, and interact with landmarks on the map.
 */
export function MapScreen() {
  /**
   * Making react hooks for the map screen.
   * 
   */
  const isFocused = useIsFocused()  // checks if the screen is focused
  const [forceRenderValue, forceRenderFunction] = useState(0); // force render value
  const [directions, setDirectionsState] = useState(null);// directions for the map
  const myLocation = useLocation();// location of the user. it is set by locationPerms.js
  const shroudContainerRef = useRef(null); // shroud container for the map
  const mapViewRef = useRef(null); // map view reference
  // states for the landmark locations and its pop-up menu
  const [landmark, setLandmark] = useState(null);// landmark location
  const [showLandmarkDialog, setShowLandmarkDialog] = useState(false);// landmark pop-up menu
  const [completedLandmarks, setCompletedLandmarks] = useState({}); // completed landmarks

  const navigation = useNavigation();// navigation for the map screen

  const forceRender = () => {
    if (forceRenderValue + 1 == Number.MAX_VALUE) {
        forceRenderValue = 0
    }
    forceRenderFunction(forceRenderValue + 1)
  }

  refreshIfFocused(isFocused, MAP_SCREEN_ID, forceRender)

  /**
   * Updates the directions state with the given origin and destination coordinates.
   *
   * @param {Object} origin - The origin coordinates.
   * @param {number} origin.latitude - The latitude of the origin.
   * @param {number} origin.longitude - The longitude of the origin.
   * @param {Object} destination - The destination coordinates.
   * @param {number} destination.latitude - The latitude of the destination.
   * @param {number} destination.longitude - The longitude of the destination.
   * @returns {void}
   */
  const updateDirections = (origin, destination) => {
    if (origin.latitude && origin.longitude) {
      setDirectionsState({
        origin: { latitude: origin.latitude, longitude: origin.longitude },
        destination: { latitude: destination.latitude, longitude: destination.longitude },
      });
    }
  };

  // effect to update the completed landmarks list. it uses react hooks to update the list. 
  useFocusEffect(
    React.useCallback(() => {
      const fetchCompletedLandmarks = async () => {
        const completed = await getCompletedLandmarks(); // gets the completed landmarks 
        setCompletedLandmarks(completed);
      };
      fetchCompletedLandmarks();
    }, [])
  );
/**
 * useEffect to update the directions and the completed landmarks list.
 * it is used to update the directions and the completed landmarks list.
 * 
 */
  useEffect(() => {
    if (myLocation.latitude && myLocation.longitude) {
      updateDirections(myLocation, { latitude: 48.2081743, longitude: 16.3738189 }); // Default to St. Stephen's Cathedral, Vienna
    }

    const fetchCompletedLandmarks = async () => {
      const completed = await getCompletedLandmarks();
      setCompletedLandmarks(completed);
    };
    fetchCompletedLandmarks();
  }, [myLocation]);

  // Handler for when a marker is pressed, sets the landmark state to the location chosen
  const handleMarkerPress = (location) => {
    // sets the landmark
    setLandmark(location);

    if (myLocation.latitude && myLocation.longitude) {
      updateDirections(myLocation, { latitude: location.latitude, longitude: location.longitude });
    } else {
      console.error('Current location is not available');
    }
  };
// function that opens either google or apple maps based on the platform
  const openDirections = (destination) => {
    if (Platform.OS === 'ios') {
      const url = `http://maps.apple.com/?saddr=${myLocation.latitude},${myLocation.longitude}&daddr=${destination.latitude},${destination.longitude}`;
      Linking.openURL(url);
    } else {
      Linking.openURL(`google.navigation:q=${destination.latitude},${destination.longitude}`);
    }
  };

  // Handler for when the region changes, resets the map to Vienna if the user scrolls too far away
  const handleRegionChangeComplete = (newRegion) => {
    if (!isViennaInView(newRegion)) {
      resetToVienna();
    }
  };
// function to check if vienna is in view
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

  // Renderer for the callout pop-up
  const renderCallout = (location) => (
    <Callout onPress={() => setShowLandmarkDialog(true)}>
      <View style={styles.calloutContainer}>
        <Text style={styles.calloutTitle}>{location.questName}</Text>
        <Text style={styles.calloutDescription}>{location.questDescription}</Text>
        <Button 
          title="Open Quest" 
          onPress={() => setShowLandmarkDialog(true)}
          style={styles.calloutButton}
        />
      </View>
    </Callout>
  );

  // Renders the dialog for a landmark dialog
  const renderLandmarkDialog = () => 
    (<View style={styles.landmarkDialog}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setShowLandmarkDialog(false)}>
        <Text>X</Text>
      </TouchableOpacity>
      <Text style={styles.landmarkTitle}>
        {completedLandmarks[landmark.questName] ? '✅ ' : '❌ '}
        {landmark.questName}
      </Text>
      <Image 
        source={landmark.image ? {uri: landmark.image} : require('../assets/images/placeholder.jpg')}
        style={styles.landmarkImage}
      />
      <Text>{calculateDistance(myLocation, landmark)}km from your location</Text>
      <View style={styles.objectivesContainer}>
        <Text style={styles.objectivesTitle}>Objectives</Text>
        <Text>{landmark.questDescription}</Text>
      </View>
      {completedLandmarks[landmark.questName] ? (
        <View style={styles.completedBox}>
          <Text>Your Postcard has been saved to your photo album</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.landmarkButton} 
          onPress={() => navigation.navigate(CameraScreen, { landmarkTitle: landmark.questName })}
        >
          <Text>Take Postcard</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.landmarkButton} onPress={() => openDirections(landmark)}>
        <Text>Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );

  // calculates the distance to the location, didn't want to do it.
  const calculateDistance = (location1, location2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const lat1 = toRadians(location1.latitude);
    const lon1 = toRadians(location1.longitude);
    const lat2 = toRadians(location2.latitude);
    const lon2 = toRadians(location2.longitude);
  
    const R = 6371; 
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance.toFixed(2);
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
        {locations.map((location, index) => (
          location.latitude && location.longitude && (
            <Marker
              key={index}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={location.questName}
              description={location.questDescription}
              pinColor="purple"
              onPress={() => handleMarkerPress(location)}
            >
              {renderCallout(location)}
            </Marker>
          )
        ))}
               {viennaStorage.json.landmarkLocations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.title}
            description={location.description}
            pinColor="red"
            onPress={() => handleMarkerPress(location)}
          >
            {renderCallout(location)}
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

      {/* Checks if landmark pop-up has been requested, if so it brings up the landmark pop-up for the landmark. */}
      {showLandmarkDialog && renderLandmarkDialog()}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default MapScreen;
