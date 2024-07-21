import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

/**
 * Unfinished functional component for the quest screen.
 * Currently returns a basic, unstyled "under construction" screen.
 */
export default function QuestScreen() {
    /*
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
                const district = new District(name, index + 1);
                return district.loadQuestJson().then(() => district);
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
    */

    const [forceRenderValue, forceRenderFunction] = useState(0);

    const forceRender = () => {
        if (forceRenderValue + 1 == Number.MAX_VALUE) {
            forceRenderValue = 0
        }
        forceRenderFunction(forceRenderValue + 1)
    }

    return (
        <View>
            <Text>Screen under construction 🚧</Text>
            <Text>Come back soon! :3</Text>
        </View>
    )
}
