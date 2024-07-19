import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { vienna } from '../HelperJsFiles/city.js' 
import viennaStorage from '../HelperJsFiles/viennaStorage.js';

export default function CityCompletionScreen() {
    const [forceRenderValue, forceRenderFunction] = useState(0);
    const [cityCompletion, setCityCompletion] = useState(0);

    useEffect(() => {
        const loadCityData = async () => {
            setCityCompletion(vienna.calculateCompletionPercentage());
        };

        loadCityData();
    }, []);

    const forceRender = () => {
        forceRenderFunction(forceRenderValue + 1)
    }

    const resetCityData = async () => {
        await vienna.resetCity()
        forceRender()
    };

    const updateCityCompletion = async () => {
        setCityCompletion(vienna.calculateCompletionPercentage());
        forceRender()

        console.log('')
        console.log('')
        console.log('')
        console.log('')
        await viennaStorage.async.printAllKeyValues()
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
