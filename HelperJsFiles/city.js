import AsyncStorage from '@react-native-async-storage/async-storage';

class City {
    constructor() {
        this.completedDistricts = 0;
    }
    /**
     * Loads the number of completed districts from AsyncStorage
     * and sets the value to the completedDistricts property.
     * If no data is found, the default value of 0 is used.
    */
    async loadCompletedDistricts() {
        try {
            const savedCompleted = await AsyncStorage.getItem('CityRate');
            if (savedCompleted !== null) {
                this.completedDistricts = parseInt(savedCompleted, 10);
            }
        } catch (e) {
            console.log("Error loading completed districts data", e);
        }
    }
    /**
     * Increases the number of completed districts and saves the new value to AsyncStorage. Which is then used to calculate the completion percentage.
     */
    async increaseCompletedDistricts() {
        this.completedDistricts++;
        try {
            await AsyncStorage.setItem('CityRate', this.completedDistricts.toString());
            console.log("Saved completed districts:", this.completedDistricts);
        } catch (e) {
            console.log("Error saving completed districts", e);
        }
    }

    calculateCompletionPercentage() {
        const totalDistricts = 23;
        return totalDistricts ? (this.completedDistricts / totalDistricts) * 100 : 0;
    }
}

export default City;
