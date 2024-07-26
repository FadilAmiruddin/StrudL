import { vienna } from './HelperJsFiles/city.js'; // ensures this gets loaded first
import React, { useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import Drawer Navigator
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen.js';
import DistrictCompletionScreen from './screens/DistrictCompletionScreen';
import CityCompletionScreen from './screens/CityCompletionScreen';
import QuestScreen from './screens/QuestScreen'; // Assume this screen is created
import CameraScreen from './screens/CameraScreen';
import PhotoConfirmationScreen from './screens/PhotoConfirmationScreen';
import Nav from './screens/Nav-bar.js';
import viennaStorage from './HelperJsFiles/viennaStorage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

registerRootComponent(App);

// Ensure the database is ready before running the app
viennaStorage.async.ensureDatabaseSetup();

const Stack = createStackNavigator(); // Stack navigation
const Drawer = createDrawerNavigator(); // Drawer navigation

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
  const mapScreenRef = useRef(null); // these refs are unused for now, but eventually they will be involved in forcing renders
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
//code for screens. to switch from map and camara.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerType: 'slide', // Slide the drawer in from the side
            drawerPosition: 'left', // Drawer position (left or right)
            headerShown: false, // Hide the header
            drawerActiveTintColor: '#e91e63', // Active item text color
            drawerLabelStyle: { fontWeight: 'bold' }, // Label styles
          }}
        >
          <Drawer.Screen name="Map" component={Nav} />
          <Drawer.Screen
            name="Camera"
            component={CameraStack}
            options={{
              drawerLabel: 'Camera', // Label for the screen
              drawerIcon: () => null, // Optionally add icons here
            }}
          />
         
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
