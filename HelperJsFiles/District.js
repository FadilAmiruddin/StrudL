import Quest from './quests'; // Ensure this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';
import City from './city';

export default class District {
    constructor(name, districtNum, questFilePath) {
        this.name = name;
        this.districtNum = districtNum;
        this.quests = [];
        this.completedQuests = [];
        this.completed = 0; // Default value
        this.ratio = 0; // Default value
        this.loadQuests(questFilePath);
        this.loadCompleted();
    }

    // Method to clear all AsyncStorage data
    async clearData() {
        try {
            await AsyncStorage.clear();
            console.log("All data cleared");
        } catch (error) {
            console.error("Error clearing AsyncStorage:", error);
        }
    }

    // Method to load completed quests from AsyncStorage
    async loadCompleted() {
        try {
            const savedCompleted = await AsyncStorage.getItem(`completed-${this.districtNum}`);
            if (savedCompleted !== null) {
                this.completed = parseInt(savedCompleted, 10);
            }
        } catch (error) {
            console.error('Error loading completed quests:', error);
        }
    }

    getDistrictName() {
        return this.name;
    }

    getRatio() {
        return this.quests.length ? this.completed / this.quests.length : 0;
    }

    setDistrictName(name) {
        this.name = name;
    }

    getQuestsAmt() {
        return this.quests.length;
    }

    async increaseCompleted() {
        this.completed++;
        try {
            await AsyncStorage.setItem(`completed-${this.districtNum}`, this.completed.toString());
            console.log("saved", this.completed);

            if (this.completed === this.quests.length) {
                console.log("completed all quests");


                const city = new City();
                await city.loadCompletedDistricts();
                await city.increaseCompletedDistricts();

                if (typeof onDistrictCompleted === 'function') {
                    onDistrictCompleted();
                }
            }
        } catch (error) {
            console.error('Error saving completed quests:', error);
        }
    }

    async loadQuests(filePath) {
        try {
            const module = await import("../HelperJsonFiles/quests.json"); // Adjust path as needed
            const questData = module.default;
            this.quests = questData
                .filter(quest => quest.districtNum === this.districtNum)
                .map(quest => new Quest(quest.questName, quest.questDescription, quest.districtNum));
        } catch (error) {
            console.error('Error loading quests:', error);
        }
    }

    getQuests() {
        return this.quests;
    }
}
