import * as ImageManipulator from 'expo-image-manipulator';

export async function applyOverlay(photoUri, orientation) {
  const overlayUri = orientation === 'LANDSCAPE' 
    ? require('../assets/overlay-landscape.png') 
    : require('../assets/overlay-portrait.png');

  // First, resize the original photo
  const resizedPhoto = await ImageManipulator.manipulateAsync(
    photoUri,
    [
      { resize: orientation === 'LANDSCAPE' ? { width: 1500, height: 1000 } : { width: 1000, height: 1500 } },
    ],
    { format: 'png' }
  );

  // Then, combine the resized photo with the overlay
  return ImageManipulator.manipulateAsync(
    resizedPhoto.uri,
    [
      { resize: orientation === 'LANDSCAPE' ? { width: 1500, height: 1000 } : { width: 1000, height: 1500 } },
    ],
    {
      format: 'png',
      base64: false,
      compress: 1,
      overlay: {
        uri: overlayUri,
        top: 0,
        left: 0,
        width: orientation === 'LANDSCAPE' ? 1500 : 1000,
        height: orientation === 'LANDSCAPE' ? 1000 : 1500,
      },
    }
  );
}