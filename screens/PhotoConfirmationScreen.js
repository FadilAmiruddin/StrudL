// PhotoConfirmationScreen.js
import React, {useEffect} from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';


export default function PhotoConfirmationScreen({ route, navigation }) {
  const { photoUri } = route.params;

  useEffect(() => {
    // Lock the screen orientation to portrait
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    // Cleanup function to unlock orientation when component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const handleConfirm = () => {
    // Here you can add logic to save or process the confirmed photo
    console.log('Photo confirmed:', photoUri);
    // Navigate back to the main app flow (you might want to adjust this based on your app's structure)
    navigation.navigate('Map');
  };

  const handleRetake = () => {
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