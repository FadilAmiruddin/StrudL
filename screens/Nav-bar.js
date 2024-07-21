import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import MapView from "react-native-maps";

function Untitled(props) {
  const [rectHeight, setRectHeight] = useState(200);
  const [isSmall, setIsSmall] = useState(true);

  const handlePress = () => {
    if (isSmall) {
      setRectHeight(400);
      setIsSmall(false);
    } else {
      setRectHeight(200);
      setIsSmall(true);
    }
    console.log(rectHeight);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.2082,
          longitude: 16.3738,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <ScrollView contentContainerStyle={[styles.contentContainer, { height: rectHeight }]}>
        <Text style={styles.todaysQuest}>Today's Quest</Text>
        <View style={[styles.rect, { height: rectHeight }]}>
          <TouchableOpacity onPress={handlePress} style={styles.button}></TouchableOpacity>
          <Text style={styles.quest3}>Quest</Text>
          <View style={styles.metersXStack}>
            <Text style={styles.metersX}>Meters : x</Text>
            <Text style={styles.quest4}>Quest</Text>
          </View>
          <View style={styles.metersX1Stack}>
            <Text style={styles.metersX1}>Meters : x</Text>
            <Text style={styles.quest5}>Quest</Text>
          </View>
          <Text style={styles.metersX2}>Meters : x</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    marginBottom:-20,  
  },
  map: {
    flex: 4,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  rect: {
    backgroundColor: "rgba(255,255,255,1)",
    padding: 16,
  },
  button: {
    width: 74,
    height: 20,
    backgroundColor: "#E6E6E6",
    marginBottom: 16,
    alignSelf: 'center',
  },
  quest3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    lineHeight: 50,
    fontSize: 25,
    marginTop: 10,
    marginLeft: 25,
  },
  metersX: {
    top: 0,
    left: 18,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 24,
    width: 89,
  },
  quest4: {
    top: 12,
    left: 0,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    lineHeight: 50,
    fontSize: 25,
  },
  metersXStack: {
    width: 125,
    height: 62,
    marginLeft: 25,
  },
  metersX1: {
    top: 0,
    left: 18,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 24,
    width: 89,
  },
  quest5: {
    top: 12,
    left: 0,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    lineHeight: 50,
    fontSize: 25,
  },
  metersX1Stack: {
    width: 125,
    height: 62,
    marginLeft: 25,
  },
  metersX2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 24,
    width: 89,
    marginLeft: 43,
  },
  todaysQuest: {
    fontFamily: "roboto-700",
    color: "#121212",
    lineHeight: 50,
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default Untitled;
