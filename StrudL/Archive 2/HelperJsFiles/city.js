import AsyncStorage from '@react-native-async-storage/async-storage';
import viennaStorage from './viennaStorage';
import District from './District';
import Quest from './quests';

class City {
    constructor() {
        this.completedDistricts = 0;
        this.shroudContainerRef = null
        this.districts = []
        this.quests = []
        this.districtScreenValue = Number.MIN_VALUE
        this.cityScreenValue = Number.MIN_VALUE
        this.lastScreen = ""
        this.generateQuests()
        this.generateDistricts()
    }

    getLastScreen() {
        return this.lastScreen
    }

    setLastScreen(to) {
        this.lastScreen = to
    }

    queueDistrictScreenRerender() {
        this.districtScreenValue++
    }

    queueCityScreenRerender() {
        this.cityScreenValue++
        console.log("cityScreenRefreshQueued")
    }

    proviteShroudContainerRef(scr) {
        this.shroudContainerRef = scr
    }

    /** generate Quest objects to populate vienna.quests */
    async generateQuests() {
        const questCompletionArray = await viennaStorage.async.getQuestCompletion()
        for (var i = 0; i < viennaStorage.json.quests.length; i++) {
            var newDist = new Quest(viennaStorage.json.quests[i].questName, viennaStorage.json.quests[i].questDescription, i + 1)
            newDist.setCompleted(questCompletionArray[i])
            this.quests.push(newDist)
        }
    }

    /** generate District objects to populate vienna.districts */
    async generateDistricts() {
        for (var i = 0; i < viennaStorage.json.districts.length; i++) {
            var associatedQuests = []
            for (var j = 0; j < viennaStorage.json.quests.length; j++) {
                if (viennaStorage.json.quests[j].districtNum == i + 1) {
                    associatedQuests.push(j)
                }
            }

            var newDist = new District(viennaStorage.json.districts[i].name, i + 1, associatedQuests)

            this.districts.push(newDist)
        }
    }

    /**
     * Refreshes and resets the city object
     */
    async resetCity() {
        try {
            await viennaStorage.async.killThemAll()
            await viennaStorage.async.ensureDatabaseSetup()
            for (const q of this.quests) {
                q.setCompleted(false)
            }
            for (const d of this.districts) {
                await d.setShrouded(true)
            }
        } catch (error) {
            console.error('Error clearing AsyncStorage while resetting City object:', error);
        }
    }

    isDistrictCompleted(index, zeroIndexed=false) {
        const realIndex = zeroIndexed ? index - 1 : index
        var numCompleted = 0

        for (const qi of this.districts[realIndex].quests) {
            numCompleted += this.quests[qi].getCompleted() ? 1 : 0
        }

        return numCompleted == this.districts[realIndex].quests.length
    }

    calculateCompletionPercentage() {
        const totalDistricts = 23;
        var completedDistricts = 0;
        for (var i = 0; i < totalDistricts; i++) {
            if (this.isDistrictCompleted(i)) {
                completedDistricts++
            }
        }
        return totalDistricts ? (completedDistricts / totalDistricts) * 100 : 0;
    }

    getShroudEnabled(index, zeroIndexed=false) {
        const realIndex = zeroIndexed ? index - 1 : index

        return this.districts[realIndex].getShrouded()
    }

    setShroudEnabled(index, to, zeroIndexed=false) {
        const realIndex = zeroIndexed ? index - 1 : index

        this.districts[realIndex].setShrouded(to)

        this.shroudContainerRef.current.setVisibility(realIndex, to)
    }

    setQuestCompletion(index, to) {
        this.quests[index].setCompleted(to)
        viennaStorage.async.writeIndividualQuestCompletion(index, to)

        //this.ensureShroudUpdated()
    }

    ensureShroudUpdated() {
        // TODO: in future, shrouds will be disabled by completing certain quests, which will unlock more quests in that district
        // for now, the shroud drops if all quests are completed in a district

        for (const [index, dist] of this.districts.entries()) {
            var target = dist.quests.length
            var actual = 0
            for (const qi of dist.quests) {
                actual += this.quests[qi].getCompleted() ? 1 : 0
            }

            if (actual == target) {
                this.shroudContainerRef.current.setVisibility(index, false)
            } else {
                this.shroudContainerRef.current.setVisibility(index, true)
            }
        }
    }
}

export var vienna = new City()

export default City;
