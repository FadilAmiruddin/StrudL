import { vienna } from './HelperJsFiles/city.js' // ensures this gets loaded first (I think)
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { registerRootComponent } from 'expo';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen.js';
import DistrictCompletionScreen from './screens/DistrictCompletionScreen';
import CityCompletionScreen from './screens/CityCompletionScreen';
import QuestScreen from './screens/QuestScreen';  // Assume this screen is created
import CameraScreen from './screens/CameraScreen';
import PhotoConfirmationScreen from './screens/PhotoConfirmationScreen';

import viennaStorage from './HelperJsFiles/viennaStorage';

registerRootComponent(DistrictCompletionScreen);

// ensure the database is ready before running the app
viennaStorage.async.ensureDatabaseSetup()

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Adding Stack navigation

const GOOGLE_MAPS_APIKEY = 'AIzaSyAlZW0NrFKmUOazzCx8RUfJqReZ-GB_7xg';

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
  const homeScreenRef = useRef(null) // these refs are unused for now, but eventually they will be involved in forcing renders
  const mapScreenRef = useRef(null)
  const districtCompletionScreenRef = useRef(null)
  const cityCompletionScreenRef = useRef(null)
  const questCompletionScreenRef = useRef(null)
  const navigation = useNavigation()

  const forceRender = () => {
    if (forceRenderValue + 1 == Number.MAX_VALUE) {
        forceRenderValue = 0
    }
    forceRenderFunction(forceRenderValue + 1)
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" ref={homeScreenRef} component={HomeScreen} />
        <Tab.Screen name="Map" ref={mapScreenRef} component={MapScreen} />
        <Tab.Screen name="District Completion Rate" ref={districtCompletionScreenRef} component={DistrictCompletionScreen} />
        <Tab.Screen name="City Completion Rate" ref={cityCompletionScreenRef} component={CityCompletionScreen} />
        <Tab.Screen name="Quest" ref={questCompletionScreenRef} component={QuestScreen} />
      </Tab.Navigator>
    </NavigationContainer>
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
        <Tab.Screen name="Camera" // Adds new tab containing the camera 
          component={CameraStack} 
          options = 
          {
            {
              //tabBarButton: () => null,
              headerShown: false,
              tabBarStyle: { display: 'none'}
            }
          }/> 
      </Tab.Navigator>
    </NavigationContainer>
  );
}
