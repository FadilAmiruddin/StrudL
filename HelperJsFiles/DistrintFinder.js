import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Button, SafeAreaView, Linking, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StatusBar } from 'expo-status-bar';

import useLocation from './locationPerms';

const viennaDistricts = {
  "1010": "1- Innere Stadt",
  "1020": "2- Leopoldstadt",
  "1030": "3- Landstraße",
  "1040": "4- Wieden",
  "1050": "5- Margareten",
  "1060": "6- Mariahilf",
  "1070": "7- Neubau",
  "1080": "8- Josefstadt",
  "1090": "9- Alsergrund",
  "1100": "10- Favoriten",
  "1110": "11- Simmering",
  "1120": "12- Meidling",
  "1130": "13- Hietzing",
  "1140": "14- Penzing",
  "1150": "15- Rudolfsheim-Fünfhaus",
  "1160": "16- Ottakring",
  "1170": "17- Hernals",
  "1180": "18- Währing",
  "1190": "19- Döbling",
  "1200": "20- Brigittenau",
  "1210": "21- Floridsdorf",
  "1220": "22- Donaustadt",
  "1230": "23- Liesing"
};

async function getDistrictFromCoordinates(lat,lon) {
  const apiKey = 'AIzaSyAlZW0NrFKmUOazzCx8RUfJqReZ-GB_7xg';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      console.log('Data:', data); // Log the entire object
      const address = JSON.stringify(data.results[0]["formatted_address"])
      const addressParts = address.split(',');

      const numericPart = JSON.stringify(addressParts[1].match(/\d+/)[0]);
      const numericPart2 = numericPart.replace(/['"]+/g, '');
      const i = Number(numericPart2);
      console.log(viennaDistricts[i]); // Log the entire object
      return viennaDistricts[i];


      // Find the district from the address components
      console.log('Data:', data); // Log the entire object
      const addressComponents = data.results[0].address_components;
      const district = addressComponents.find(component => component.types.includes('administrative_area_level_2'));

      if (district) {
        console.log('District Object:', district); // Log the entire object
        return district; // Adjust if needed based on the object structure
      } else {
        return 'District not found';
      }
    } else {
      console.error('API Error:', data.status);
      return 'Error fetching district';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return 'Error fetching district';
  }
}



// Example usage
//g//etDistrictFromCoordinates(48.2082, 16.3738).then(district => {
  //console.log(`District: ${district}`);
//});


// Example usage

export default getDistrictFromCoordinates;
