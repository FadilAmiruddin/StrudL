import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { vienna } from '../HelperJsFiles/city.js' 
import viennaStorage from '../HelperJsFiles/viennaStorage.js';
import { useIsFocused } from '@react-navigation/native';
import refreshIfFocused from '../HelperJsFiles/screenRerender.js';

export const CITY_COMPLETION_SCREEN_ID = "CityCompletionScreen"

export default function CityCompletionScreen() {
    const isFocused = useIsFocused()
    const [forceRenderValue, forceRenderFunction] = useState(0);
    const [cityCompletion, setCityCompletion] = useState(0);

    useEffect(() => {
        const loadCityData = async () => {
            setCityCompletion(vienna.calculateCompletionPercentage());
        };

        loadCityData();

        forceRender();
    }, [vienna.cityScreenValue]);

    const forceRender = () => {
        forceRenderFunction(forceRenderValue + 1)
    }

    refreshIfFocused(isFocused, CITY_COMPLETION_SCREEN_ID, forceRender)

    const resetCityData = async () => {
        await vienna.resetCity()
        forceRender()
        vienna.queueDistrictScreenRerender()
    };

    const updateCityCompletion = async () => {
        setCityCompletion(vienna.calculateCompletionPercentage());
        forceRender()
        vienna.queueDistrictScreenRerender()
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>City Completion Rate</Text>
            <Text style={styles.completionText}>
                {cityCompletion.toFixed(2)}% of Districts Completed
            </Text>
            <Button title="Reset City Data" onPress={resetCityData} color="red" />
            <Button title="Update Completion" onPress={updateCityCompletion} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    completionText: {
        fontSize: 18,
        marginVertical: 20,
    },
});
