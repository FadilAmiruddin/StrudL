import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Button, SafeAreaView, Linking, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import styles from './HelperJsFiles/styles';
import useLocation from './HelperJsFiles/locationPerms';
import landmark_locations from './HelperJsonFiles/landmark_locations.json';
import ShroudContainer from './HelperJsFiles/shroud';
import HomeScreen from './screens/HomeScreen';
import DistrictCompletionScreen from './screens/DistrictCompletionScreen';
import CityCompletionScreen from './screens/CityCompletionScreen';
import QuestScreen from './screens/QuestScreen';  // Assume this screen is created
import { registerRootComponent } from 'expo';

registerRootComponent(DistrictCompletionScreen);

const Tab = createBottomTabNavigator();
const GOOGLE_MAPS_APIKEY = 'AIzaSyAlZW0NrFKmUOazzCx8RUfJqReZ-GB_7xg';

function MapScreen() {
  const [directions, setDirectionsState] = useState(null);
  const myLocation = useLocation();
  const shroudContainerRef = useRef(null);

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
      console.log("Button pressed");
    }
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
        {landmark_locations.map((location, index) => (
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
            onError={(errorMessage) => console.log('MapViewDirections Error:', errorMessage)}
          />
        )}
        <ShroudContainer ref={shroudContainerRef} />
      </MapView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="District Completion Rate" component={DistrictCompletionScreen} />
        <Tab.Screen name="City Completion Rate" component={CityCompletionScreen} />
        <Tab.Screen name="Quest" component={QuestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
