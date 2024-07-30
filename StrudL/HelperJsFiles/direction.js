// directions.js

export const setDirections = (myLocation, destination, setDirectionsState, setShowMap) => {
    if (!myLocation.latitude || !myLocation.longitude) {
      console.error('myLocation is undefined or invalid');
      return;
    }
  
    setDirectionsState({
      origin: { latitude: myLocation.latitude, longitude: myLocation.longitude },
      destination: { latitude: destination.latitude, longitude: destination.longitude },
    });
    setShowMap(true);
  };
  
  export default setDirections;
  