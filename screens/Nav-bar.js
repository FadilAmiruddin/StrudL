import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapScreen from './MapScreen'; // Adjust the path as necessary

const App = () => {
  const [bottom, setBottom] = useState(-80);
  const [isSmall, setIsSmall] = useState(false);

  const handlePress = () => {
    if (!isSmall) {
      setBottom(-290); // Move the rectangle up
      setIsSmall(true);
    } else {
      setBottom(-80); // Move the rectangle down
      setIsSmall(false);
    }
    console.log('Button pressed');
  };

  const Go1 = () => {
    console.log('Go 1 pressed');
  };

  const Go2 = () => {
    console.log('Go 2 pressed');
  };

  const Go3 = () => {
    console.log('Go 3 pressed');
  };

  return (
    <View style={styles.container}>
      <MapScreen style={styles.map} />
      <View style={[styles.rectangle, { bottom }]}>
        <TouchableOpacity style={styles.buttonWrapper} onPress={handlePress}>
          <View style={styles.modalHeaderButton} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Today’s Quests</Text>

        <View style={styles.questContainer}>
          <View style={styles.questTextContainer}>
            <Text style={styles.questTitle}>Eat a Kasekrainer</Text>
            <Text style={styles.questDistance}>20km</Text>
          </View>
          <View style={styles.flexSpacer} />
          <TouchableOpacity style={styles.goButton} onPress={Go1}>
            <Text style={styles.goButtonText}>Go</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.questContainer}>
          <View style={styles.questTextContainer}>
            <Text style={styles.questTitle}>Visit Karlskirche</Text>
            <Text style={styles.questDistance}>15m</Text>
          </View>
          <View style={styles.flexSpacer} />
          <TouchableOpacity style={styles.goButton} onPress={Go2}>
            <Text style={styles.goButtonText}>Go</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.questContainer}>
          <View style={styles.questTextContainer}>
            <Text style={styles.questTitle}>Ride the Riesenrad</Text>
            <Text style={styles.questDistance}>30km</Text>
          </View>
          <View style={styles.flexSpacer} />
          <TouchableOpacity style={styles.goButton} onPress={Go3}>
            <Text style={styles.goButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  rectangle: {
    position: 'absolute',
    width: '100%',
    height: 348,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  buttonWrapper: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 90,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalHeaderButton: {
    width: 70,
    height: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    marginBottom: 32,
    marginLeft: 280,
  },
  modalTitle: {
    color: '#000000',
    fontSize: 30,
    marginBottom: 15,
  },
  questContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
  },
  questTextContainer: {
    flex: 3,
    alignSelf: 'flex-start',
    marginRight: 6,
  },
  questTitle: {
    color: '#000000',
    fontSize: 18,
    marginBottom: 2,
  },
  questDistance: {
    color: '#6C6C6C',
    fontSize: 15,
  },
  flexSpacer: {
    flex: 1,
  },
  goButton: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    paddingVertical: 14,
  },
  goButtonText: {
    color: '#000000',
    fontSize: 22.5,
  },
});

export default App;
