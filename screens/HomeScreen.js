import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import viennaStorage from '../HelperJsFiles/viennaStorage';

export default function HomeScreen() {
  viennaStorage.async.ensureDatabaseSetup()
  viennaStorage.async.printAllKeyValues()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to StrudL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
