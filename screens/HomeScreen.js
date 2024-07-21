import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import viennaStorage from '../HelperJsFiles/viennaStorage';
import { useIsFocused } from '@react-navigation/native';
import refreshIfFocused from '../HelperJsFiles/screenRerender';

export const HOME_SCREEN_ID = "HomeScreen"

export default function HomeScreen() {
  const isFocused = useIsFocused()
  const [forceRenderValue, forceRenderFunction] = useState(0);

  const forceRender = () => {
    if (forceRenderValue + 1 == Number.MAX_VALUE) {
        forceRenderValue = 0
    }
    forceRenderFunction(forceRenderValue + 1)
  }

  refreshIfFocused(isFocused, HOME_SCREEN_ID, forceRender)

  viennaStorage.async.ensureDatabaseSetup()

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
