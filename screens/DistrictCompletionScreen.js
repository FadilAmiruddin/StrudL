import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../HelperJsFiles/styles.js';
import { vienna } from '../HelperJsFiles/city.js'
import { useIsFocused } from '@react-navigation/native';
import refreshIfFocused from '../HelperJsFiles/screenRerender.js';

export const DISTRICT_COMPLETION_SCREEN_ID = "DistrictCompletionScreen"

export default function DistrictCompletionScreen() {
    const isFocused = useIsFocused()
    const [forceRenderValue, forceRenderFunction] = useState(0);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    useEffect(() => {
        forceRender();
    }, [vienna.districtScreenValue])

    const forceRender = () => {
        if (forceRenderValue + 1 == Number.MAX_VALUE) {
            forceRenderValue = 0
        }
        forceRenderFunction(forceRenderValue + 1)
    }

    refreshIfFocused(isFocused, DISTRICT_COMPLETION_SCREEN_ID, forceRender)

    /** Callback function for marking a quest as complete */
    const handleButtonPress = async (index) => {
        if (selectedDistrict) {
            const indexInVienna = selectedDistrict.quests[index]
            vienna.setQuestCompletion(indexInVienna, true)

            forceRender()
            vienna.queueCityScreenRerender()
        }
    };
    /*
     Is the code that allows the city to be selected and the district to be displayed when selected
    */
    const handlePickerChange = async (itemValue, itemIndex) => {
        if (itemIndex > 0) {
            const district = vienna.districts[itemIndex - 1];
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
        var numCompleted = 0
        for (var q of selectedDistrict.quests) {
            numCompleted += vienna.quests[q].getCompleted() ? 1 : 0
        }
        return (numCompleted / selectedDistrict.quests.length) * 100
    };
    /**
     * Resets all data in the app by clearing all AsyncStorage data and resetting the selected district.
     */
    const resetAllData = async () => {
        try {
            await vienna.resetCity()
            setSelectedDistrict(null); // Reset selected district
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    const generateDistrictPickerItems = () => {
        return vienna.districts.map((district, index) => (
            <Picker.Item key={index} label={district.name} value={district.districtNum} />
        ))
    }

    const generateDistrictQuestItems = () => {
        return selectedDistrict.quests.map((quest, questIndex) => (
            <View key={questIndex} style={localStyles.questContainer}>
                <Text style={localStyles.questName}>{vienna.quests[quest].questName}</Text>
                <Text style={localStyles.questDescription}>{vienna.quests[quest].questDescription}</Text>
                <Button title="Mark Completed" questIndex={questIndex} onPress={() => {handleButtonPress(questIndex)}} disabled={vienna.quests[quest].getCompleted()}/>
            </View>
        ))
    }

// Styles for the DistrictCompletionScreen component
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={localStyles.buttonContainer}>
                <Button title="Reset Data" onPress={resetAllData} color="red" />
            </View>
            <Picker
                selectedValue={selectedDistrict ? selectedDistrict.districtNum : null}
                onValueChange={handlePickerChange}
                style={localStyles.picker}
            >
                <Picker.Item label="Select a District" value={null} />
                {generateDistrictPickerItems()}
            </Picker>

            {selectedDistrict && (
                <View style={localStyles.districtContainer}>
                    <Text style={localStyles.districtTitle}>{selectedDistrict.name}</Text>
                    <ScrollView style={localStyles.questScroll}>
                        {generateDistrictQuestItems()}
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
