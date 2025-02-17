import React, { useRef, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Button, SafeAreaView, Linking, Platform, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StatusBar } from 'expo-status-bar';

import styles from '../HelperJsFiles/styles';
import useLocation from '../HelperJsFiles/locationPerms';
import ShroudContainer from '../HelperJsFiles/shroud';

import viennaStorage from '../HelperJsFiles/viennaStorage';
import { vienna } from '../HelperJsFiles/city';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import refreshIfFocused from '../HelperJsFiles/screenRerender';
import { getCompletedLandmarks } from '../HelperJsFiles/completedLandmarks';
import locations from '../HelperJsonFiles/quests.json';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAlZW0NrFKmUOazzCx8RUfJqReZ-GB_7xg';

export const MAP_SCREEN_ID = "MapScreen"

export function MapScreen() {
  const isFocused = useIsFocused()
  const [forceRenderValue, forceRenderFunction] = useState(0);
  const [directions, setDirectionsState] = useState(null);
  const myLocation = useLocation();
  const shroudContainerRef = useRef(null);
  const mapViewRef = useRef(null);
  // states for the landmark locations and its pop-up menu
  const [landmark, setLandmark] = useState(null);
  const [showLandmarkDialog, setShowLandmarkDialog] = useState(false);
  const [completedLandmarks, setCompletedLandmarks] = useState({});

  const navigation = useNavigation();

  const forceRender = () => {
    if (forceRenderValue + 1 == Number.MAX_VALUE) {
        forceRenderValue = 0
    }
    forceRenderFunction(forceRenderValue + 1)
  }

  refreshIfFocused(isFocused, MAP_SCREEN_ID, forceRender)

  const updateDirections = (origin, destination) => {
    if (origin.latitude && origin.longitude) {
      setDirectionsState({
        origin: { latitude: origin.latitude, longitude: origin.longitude },
        destination: { latitude: destination.latitude, longitude: destination.longitude },
      });
    }
  };

  // effect to update the completed landmarks list
  useFocusEffect(
    React.useCallback(() => {
      const fetchCompletedLandmarks = async () => {
        const completed = await getCompletedLandmarks();
        setCompletedLandmarks(completed);
      };
      fetchCompletedLandmarks();
    }, [])
  );

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
          onPress={() => navigation.navigate('Camera', { landmarkTitle: landmark.questName })}
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
