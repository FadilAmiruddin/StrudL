// PhotoConfirmationScreen.js
import React, {useEffect} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as MediaLibrary from 'expo-media-library';



export default function PhotoConfirmationScreen({ route, navigation }) {
  const { photoUri } = route.params;

  /*useEffect(() => {
    // Lock the screen orientation to portrait
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    // Cleanup function to unlock orientation when component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);
  */

    const handleConfirm = async () => {
      try {
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(photoUri);
        
        // Here you would typically save the photo URI to your app's state or storage
        // For example: await AsyncStorage.setItem('lastPhoto', photoUri);
        
        console.log('Photo saved:', photoUri);
        navigation.navigate('Map');
      } catch (error) {
        console.error('Error saving photo:', error);
      }
    };

    const handleRetake = () => {
      // The photo will be automatically discarded when we navigate back
      navigation.goBack();
    };

  return (  
    <View style={styles.container}>
      <Image 
        source={{ uri: photoUri }} 
        style={styles.image} 
        resizeMode="contain"/>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRetake}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#808080',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});