import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import District from '../HelperJsFiles/District.js'; // Adjust path as needed
import styles from '../HelperJsFiles/styles.js';

export default function DistrictCompletionScreen() {
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        const initializeDistricts = async () => {
            const districtNames = [
                'Innere Stadt', 'Leopoldstadt', 'Landstraße', 'Wieden', 'Margareten', 'Mariahilf', 
                'Neubau', 'Josefstadt', 'Alsergrund', 'Favoriten', 'Simmering', 'Meidling', 
                'Hietzing', 'Penzing', 'Rudolfsheim-Fünfhaus', 'Ottakring', 'Hernals', 'Währing', 
                'Döbling', 'Brigittenau', 'Floridsdorf', 'Donaustadt', 'Liesing'
            ];

            const districtPromises = districtNames.map((name, index) => {
                const district = new District(name, index + 1, '../HelperJsonFiles/quests.json');
                return district.loadQuests().then(() => district);
            });

            try {
                const loadedDistricts = await Promise.all(districtPromises);
                setDistricts(loadedDistricts);
            } catch (error) {
                console.error('Error initializing districts:', error);
            }
        };

        initializeDistricts();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.text}>District Completion</Text>
            {districts.map((district, index) => (
                <View key={index} style={styles.districtContainer}>
                    <Text style={{ fontWeight: 'bold' }}>{district.getDistrictName()}</Text>
                    {district.getQuests().map((quest, questIndex) => (
                        <View key={questIndex} style={styles.questContainer}>
                            <Text>{quest.questName}</Text>
                            <Text>{quest.questDescription}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}
