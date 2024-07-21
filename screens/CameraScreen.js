import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, StatusBar, Dimensions, Text, Button} from 'react-native';
// import * as ScreenOrientation from 'expo-screen-orientation';
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

      // moves to the photoConfirmation screen in the stack 

      navigation.navigate('PhotoConfirmation', { photoUri: photo.uri });
    }
  }

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


  const { width, height } = screenDimensions;

  const cameraViewHeight = width * (2/3); // 3:2 ratio
  const verticalPadding = (height - cameraViewHeight) / 2;

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        ratio="3:2"
        // type={Camera.Constants.Type.back} 
      />
      <View style={[
        styles.buttonContainer,
        orientation === 'LANDSCAPE'
          ? { bottom: 20, right: 20 }
          : { bottom: 20, alignSelf: 'center' }
      ]}>
        <TouchableOpacity
          onPress={takePicture}
          style={styles.button}
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
  buttonContainer: {
    position: 'absolute',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#808080',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});