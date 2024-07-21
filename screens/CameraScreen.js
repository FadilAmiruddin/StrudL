import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, StatusBar, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [orientation, setOrientation] = useState(null);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, [navigation]);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    StatusBar.setHidden(true);
    updateOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener(updateOrientation);
    const dimensionsSubscription = Dimensions.addEventListener('change', updateScreenDimensions);

    return () => {
      ScreenOrientation.unlockAsync();
      StatusBar.setHidden(false);
      ScreenOrientation.removeOrientationChangeListener(subscription);
      dimensionsSubscription.remove();
    };
  }, []);

  const updateOrientation = () => {
    const { width, height } = Dimensions.get('window');
    setOrientation(width > height ? 'LANDSCAPE' : 'PORTRAIT');
    setScreenDimensions({ width, height });
  };

  const updateScreenDimensions = ({ window }) => {
    setScreenDimensions(window);
  };

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      // Here you can add logic to handle the captured photo
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const { width, height } = screenDimensions;
  const cameraViewHeight = width * (2/3); // 3:2 ratio
  const verticalPadding = (height - cameraViewHeight) / 2;

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);

      // Navigate to confirmation screen after image is taken
      navigation.navigate('PhotoConfirmation', {photoUri: photo.uri});
    }
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.cameraContainer,
        { 
          height: cameraViewHeight,
          marginTop: verticalPadding,
          marginBottom: verticalPadding
        }
      ]}>
        <CameraView style={styles.camera} ref={cameraRef} />
      </View>
      <View style={[
        styles.buttonContainer, 
        orientation === 'LANDSCAPE' ? styles.landscapeButton : styles.portraitButton
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
    backgroundColor: 'black', // This will fill any space not covered by the camera
  },
  cameraContainer: {
    width: '100%',
    overflow: 'hidden', // This will crop the camera view to maintain the aspect ratio
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    right: 30,
  },
  landscapeButton: {
    bottom: '50%',
    transform: [{ translateY: 35 }],
  },
  portraitButton: {
    top: '50%',
    transform: [{ translateY: -35 }],
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#808080',
  },
});