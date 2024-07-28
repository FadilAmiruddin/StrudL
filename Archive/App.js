import { vienna } from './HelperJsFiles/city.js'; // ensures this gets loaded first
import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen.js';
import DistrictCompletionScreen from './screens/DistrictCompletionScreen';
import CityCompletionScreen from './screens/CityCompletionScreen';
import QuestScreen from './screens/QuestScreen';  // Assume this screen is created
import CameraScreen from './screens/CameraScreen';
import PhotoConfirmationScreen from './screens/PhotoConfirmationScreen';
import Nav from './screens/Nav-bar.js'

import viennaStorage from './HelperJsFiles/viennaStorage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

registerRootComponent(App);

// Ensure the database is ready before running the app
viennaStorage.async.ensureDatabaseSetup();

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator(); // Adding Stack navigation

// New Stack to handle the postcard creation process
function CameraStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="PhotoConfirmation" 
        component={PhotoConfirmationScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [forceRenderValue, forceRenderFunction] = useState(0);
  const homeScreenRef = useRef(null); // these refs are unused for now, but eventually they will be involved in forcing renders
  const mapScreenRef = useRef(null);
  const districtCompletionScreenRef = useRef(null);
  const cityCompletionScreenRef = useRef(null);
  const questCompletionScreenRef = useRef(null);

  const forceRender = () => {
    if (forceRenderValue + 1 === Number.MAX_VALUE) {
      forceRenderFunction(0);
    } else {
      forceRenderFunction(forceRenderValue + 1);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarShowIcon: true,
            tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
            tabBarLabelStyle: { textAlign: 'center', paddingVertical: 5 }, // Add paddingVertical to center the text better
          }}
        >
          <Tab.Screen name="Home" ref={homeScreenRef} component={HomeScreen} />
          <Tab.Screen name="Map" ref={mapScreenRef} component={MapScreen} />
          <Tab.Screen name="District" ref={districtCompletionScreenRef} component={DistrictCompletionScreen} />
          <Tab.Screen name="City" ref={cityCompletionScreenRef} component={CityCompletionScreen} />
          <Tab.Screen name="Quest" ref={questCompletionScreenRef} component={QuestScreen} />
          <Tab.Screen name="ProtoTypeMap" component={Nav} />
          <Tab.Screen name="Camera" // Adds new tab containing the camera 
          component={CameraStack} 
          options = 
          {
            {
              tabBarButton: () => null,
              headerShown: false,
              tabBarStyle: { display: 'none'}
            }
          }/>
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
