import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import City from '../HelperJsFiles/city.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CityCompletionScreen() {
    const [city, setCity] = useState(new City());
    const [cityCompletion, setCityCompletion] = useState(0);

    useEffect(() => {
        const loadCityData = async () => {
            const newCity = new City();
            await newCity.loadCompletedDistricts();
            setCity(newCity);
            setCityCompletion(newCity.calculateCompletionPercentage());
        };

        loadCityData();
    }, []);

    const resetCityData = async () => {
        try {
            await AsyncStorage.clear(); // Clear all AsyncStorage data
            const newCity = new City();
            await newCity.loadCompletedDistricts(); // Reload city data
            setCity(newCity);
            setCityCompletion(newCity.calculateCompletionPercentage()); // Set city completion percentage
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    const updateCityCompletion = async () => {
        const newCity = new City();
        await newCity.loadCompletedDistricts();
        setCity(newCity);
        setCityCompletion(newCity.calculateCompletionPercentage());
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
