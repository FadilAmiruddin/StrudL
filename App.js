import { vienna } from './HelperJsFiles/city.js' // ensures this gets loaded first (I think)
import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { registerRootComponent } from 'expo';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen.js';
import DistrictCompletionScreen from './screens/DistrictCompletionScreen';
import CityCompletionScreen from './screens/CityCompletionScreen';
import QuestScreen from './screens/QuestScreen';  // Assume this screen is created

import viennaStorage from './HelperJsFiles/viennaStorage';

registerRootComponent(DistrictCompletionScreen);

// ensure the database is ready before running the app
viennaStorage.async.ensureDatabaseSetup()
viennaStorage.async.printAllKeyValues()

const Tab = createBottomTabNavigator();

export default function App() {
  const homeScreenRef = useRef(null) // these refs are unused for now, but eventually they will be involved in forcing renders
  const mapScreenRef = useRef(null)
  const districtCompletionScreenRef = useRef(null)
  const cityCompletionScreenRef = useRef(null)
  const questCompletionScreenRef = useRef(null)

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
