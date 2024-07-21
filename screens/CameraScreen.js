import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraView, useCameraPermissions} from 'expo-camera';
import { StyleSheet, TouchableOpacity, View, StatusBar, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { applyOverlay } from '../HelperJsFiles/overlayProcessor';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [orientation, setOrientation] = useState(null);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));



  useEffect(() => {
    StatusBar.setHidden(true);
    const dimensionsSubscription = Dimensions.addEventListener('change', updateScreenDimensions);

    return () => {
      StatusBar.setHidden(false);
      dimensionsSubscription.remove();
    };
  }, []); 

  const updateScreenDimensions = ({ window }) => {
    setScreenDimensions(window);
    setOrientation(window.width > window.height ? 'LANDSCAPE' : 'PORTRAIT');
  };

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
        skipProcessing: true,
      });
      
      console.log(photo);

      const processedPhoto = await applyOverlay(photo.uri, orientation);
      navigation.navigate('PhotoConfirmation', { photoUri: processedPhoto.uri});
    }
  }

  const handleClose = () => {
    navigation.navigate('Map');
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        ratio="3:2"
      />
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.captureButton} 
          onPress={() => {
            //cameraRef.current.animateToPreset(Camera.Constants.ShutterPreset.Standard);
            takePicture();
          }} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  flashButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});