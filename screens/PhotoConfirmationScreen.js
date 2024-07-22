// PhotoConfirmationScreen.js
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { setLandmarkCompleted } from '../HelperJsFiles/completedLandmarks';

export default function PhotoConfirmationScreen({ route, navigation }) {
  const { photoUri } = route.params;

  // permissions for photo gallery access 
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [permissionGranted, setPermissionGranted] = useState(false);


  const [imageAspectRatio, setImageAspectRatio] = useState(3/2);

  useEffect(() => {
    Image.getSize(photoUri, (width, height) => {
      setImageAspectRatio(width / height);
    });
  }, [photoUri]);
  
  const imageStyle = imageAspectRatio >= 1 
    ? { width: '100%', aspectRatio: imageAspectRatio }
    : { height: '70%', aspectRatio: imageAspectRatio };

  useEffect(() => {
    // Check and request permissions when the component mounts
    if (permissionResponse?.granted) {
      setPermissionGranted(true);
    } else if (permissionResponse === null) {
      requestPermission();
    }
  }, [permissionResponse]);

  useEffect(() => {
    if (permissionResponse && !permissionResponse.granted) {
      Alert.alert(
        'Permission Required',
        'We need your permission to access photos',
        [
          {
            text: 'Grant Permission',
            onPress: requestPermission,
          },
        ]
      );
    }
  }, [permissionResponse]);

  // Handles confirm button on confirmation screen. Saves the postcard to the phones photo gallery
  const handleConfirm = async () => {
    try {
      await MediaLibrary.saveToLibraryAsync(photoUri);
      await setLandmarkCompleted(route.params.landmarkTitle);
      navigation.navigate('Map');
      setTimeout(() => {
        navigation.pop();
      }, 100);
    } catch (error) {
      console.error('Error saving photo or marking landmark as completed:', error);
      Alert.alert('Error', 'Failed to save the photo or mark the landmark as completed. Please try again.');
    }
  };

  const handleRetake = () => {
    // The photo will be automatically discarded when we navigate back
    navigation.goBack();
  };

  if (!permissionResponse) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.postcardContainer}>
        <Text style={styles.title}>Your Postcard</Text>
        <Text style={styles.subtitle}>Confirmation</Text>
        <Text style={styles.instruction}>
          Pick a good photo, once the postcard is set, it can't be changed.
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: photoUri }}
            style={[styles.image, imageStyle]}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={!permissionGranted}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postcardContainer: {
    backgroundColor: '#FF6B6B',
    width: '90%',
    height: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    backgroundColor: 'white',
  },
  confirmButton: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  retakeButton: {
    backgroundColor: '#DDDDDD',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});