import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import District from '../HelperJsFiles/District.js'; // Adjust path as needed
import styles from '../HelperJsFiles/styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DistrictCompletionScreen() {
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    /**
     * Initializes the districts when the component is mounted. sets the array of districts to the state. 
     * The districts are loaded from the HelperJsonFiles/quests.json file.
     */
    useEffect(() => {
        const initializeDistricts = async () => {
            const districtNames = [
                'Innere Stadt', 'Leopoldstadt', 'Landstraße', 'Wieden', 'Margareten', 'Mariahilf', 
                'Neubau', 'Josefstadt', 'Alsergrund', 'Favoriten', 'Simmering', 'Meidling', 
                'Hietzing', 'Penzing', 'Rudolfsheim-Fünfhaus', 'Ottakring', 'Hernals', 'Währing', 
                'Döbling', 'Brigittenau', 'Floridsdorf', 'Donaustadt', 'Liesing'
            ];

            const loadedDistricts = await Promise.all(
                districtNames.map(async (name, index) => {
                    const district = new District(name, index + 1, '../HelperJsonFiles/quests.json');
                    await district.loadCompleted();
                    return district;
                })
            );

            setDistricts(loadedDistricts);
        };

        initializeDistricts();
    }, []);

    const handleButtonPress = async () => {
        if (selectedDistrict) {
            await selectedDistrict.loadCompleted(); // Refresh completed data
            await selectedDistrict.increaseCompleted();

            // Create a new instance to avoid mutating state directly
            const updatedDistrict = new District(
                selectedDistrict.name,
                selectedDistrict.districtNum,
                '../HelperJsonFiles/quests.json'
            );
            await updatedDistrict.loadCompleted();

            setSelectedDistrict(updatedDistrict); // Trigger re-render
        }
    };
    /*
     Is the code that allows the city to be selected and the district to be displayed when selected
    */
    const handlePickerChange = async (itemValue, itemIndex) => {
        if (itemIndex > 0) {
            const district = districts[itemIndex - 1];
            await district.loadCompleted();
            setSelectedDistrict(district);
        } else {
            setSelectedDistrict(null);
        }
    };
    /**
     * 
     * @returns the percentage of the district that has been completed based on the size of the array of quests for said district
     */
    const calculateCompletionPercentage = () => {
        if (selectedDistrict) {
            const completed = selectedDistrict.completed;
            const total = selectedDistrict.quests.length;
            return total ? (completed / total) * 100 : 0;
        }
        return 0;
    };
    /**
     * Resets all data in the app by clearing all AsyncStorage data and resetting the selected district.
     */
    const resetAllData = async () => {
        try {
            await AsyncStorage.clear(); // Clear all AsyncStorage data
            setSelectedDistrict(null); // Reset selected district
            const updatedDistricts = await Promise.all(
                districts.map(async (district) => {
                    await district.clearData(); // Clear district specific data
                    await district.loadCompleted(); // Refresh completed data
                    return district;
                })
            );
            setDistricts(updatedDistricts); // Update districts state
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };
// Styles for the DistrictCompletionScreen component
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={localStyles.buttonContainer}>
                <Button title="Mark Completed" onPress={handleButtonPress} />
                <Button title="Reset Data" onPress={resetAllData} color="red" />
            </View>
            <Picker
                selectedValue={selectedDistrict ? selectedDistrict.districtNum : null}
                onValueChange={handlePickerChange}
                style={localStyles.picker}
            >
                <Picker.Item label="Select a District" value={null} />
                {districts.map((district, index) => (
                    <Picker.Item key={index} label={district.name} value={district.districtNum} />
                ))}
            </Picker>

            {selectedDistrict && (
                <View style={localStyles.districtContainer}>
                    <Text style={localStyles.districtTitle}>{selectedDistrict.name}</Text>
                    <ScrollView style={localStyles.questScroll}>
                        {selectedDistrict.quests.map((quest, questIndex) => (
                            <View key={questIndex} style={localStyles.questContainer}>
                                <Text style={localStyles.questName}>{quest.questName}</Text>
                                <Text style={localStyles.questDescription}>{quest.questDescription}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <Text style={localStyles.completionText}>
                        {calculateCompletionPercentage().toFixed(2)}% Complete
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}
//some css things that do css stuff.
const localStyles = StyleSheet.create({
    picker: {
        height: 100,
        width: '100%',
        marginVertical: -40,
    },
    districtContainer: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        marginVertical: 90, // Increased margin to move it down
        borderRadius: 10,
    },
    districtTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    questScroll: {
        maxHeight: 200, // Set a max height for the quest list
    },
    questContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    questName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    questDescription: {
        fontSize: 14,
    },
    completionText: {
        color: 'green',
        marginTop: 10,
    },
    buttonContainer: {
        marginVertical: 20, // Corrected the typo
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
});
