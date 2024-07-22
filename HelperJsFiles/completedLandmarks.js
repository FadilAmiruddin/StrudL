import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCompletedLandmarks = async () => {
  try {
    const completedLandmarks = await AsyncStorage.getItem('completedLandmarks');
    return completedLandmarks ? JSON.parse(completedLandmarks) : {};
  } catch (error) {
    console.error('Error getting completed landmarks:', error);
    return {};
  }
};

export const setLandmarkCompleted = async (landmarkTitle) => {
  try {
    const completedLandmarks = await getCompletedLandmarks();
    completedLandmarks[landmarkTitle] = true;
    await AsyncStorage.setItem('completedLandmarks', JSON.stringify(completedLandmarks));
  } catch (error) {
    console.error('Error setting landmark as completed:', error);
  }
};