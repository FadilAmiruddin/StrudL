import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The DB holds a numCompletedDistricts value (for convenience, mostly)
 * it holds a number of quest completion statuses in questCompletion (a list of true/false for all quests)
 * it also holds each district via district<number>
 * districts hold these values:
 *      shroudEnabled (true/false)
 * 
 */

export const viennaStorage = {
    json : { // json data
        districts : require("./../HelperJsonFiles/districts.json"),
        landmarkLocations : require("./../HelperJsonFiles/landmark_locations.json"),
        quests : require("./../HelperJsonFiles/quests.json"),
        verts : require("./../HelperJsonFiles/verts.json")
    },
    async : { // pure async stuff
        /**
         * Performs initial setup for the async database.
         * If keys do not exist for some reason, they will be created.
         */
        ensureDatabaseSetup : async () => {
            const numCompletedDistricts = await AsyncStorage.getItem("numCompletedDistricts")
            if (numCompletedDistricts == null) {
                await AsyncStorage.setItem("numCompletedDistricts", "0")
            }

            const questCompletionStatusesRaw = await AsyncStorage.getItem("questCompletion")
            if (questCompletionStatusesRaw == null) {
                var to = []
                for (var i = 0; i < viennaStorage.json.quests.length; i++) {
                    to.push(false)
                }
                await AsyncStorage.setItem("questCompletion", JSON.stringify(to))
            }

            async function regenerateDistrict(key) {
                var to = {
                    shroudEnabled : true
                }
                await AsyncStorage.setItem(key, JSON.stringify(to))
            }

            // check each district
            for (var i = 0; i < 23; i++) {
                var currKey = `district${i + 1}`
                var districtRaw = await AsyncStorage.getItem(currKey)
                if (districtRaw == null) {
                    regenerateDistrict(currKey)
                    continue // we know it's valid if we just regenerated
                }
                
                // the district exists, check if its properties are good
                var district = JSON.parse(districtRaw)
                // TODO: figure out how to check if a stored value is a certain type or not
                if (Object.hasOwn(district, "shroudEnabled") == false) {
                    regenerateDistrict(currKey)
                    continue
                }
            }
        },

        /**
         * Prints the asyncstorage db
         */
        printAllKeyValues : async () => {
            var allKeys = await AsyncStorage.getAllKeys()
            for (var i = 0; i < allKeys.length; i++) {
                console.log("key: " + allKeys[i])
                console.log("value: " + await AsyncStorage.getItem(allKeys[i]))
                console.log("")
            }
        },

        /**
         * Wipes and resets the asyncstorage db.
         * Be cautious using this, it does what it does.
         */
        killThemAll : async () => {
            await AsyncStorage.clear()
            await viennaStorage.async.ensureDatabaseSetup()
        },

        /**
         * Gets a district's information as stored in the asyncstorage db
         */
        getDistrict : async (index, zeroIndexed = false) => {
            var realIndex = (zeroIndexed) ? index + 1 : index;

            return JSON.parse(await AsyncStorage.getItem(`district${realIndex}`))
        },

        getQuestCompletion : async () => {
            var rawOut = JSON.parse(await AsyncStorage.getItem("questCompletion"))
            
            return rawOut
        },

        writeIndividualQuestCompletion : async (index, to) => {
            var questCompletionArray = await (viennaStorage.async.getQuestCompletion())
            questCompletionArray[index] = to

            await AsyncStorage.setItem("questCompletion", JSON.stringify(questCompletionArray))
            return to
        },

        writeIndividualDistrictShroud : async (index, to, zeroIndexed=false) => {
            var realIndex = (zeroIndexed) ? index + 1 : index;

            var parsedDistrict = JSON.parse(await AsyncStorage.getItem(`district${realIndex}`))
            parsedDistrict.shroudEnabled = to
            await AsyncStorage.setItem(`district${realIndex}`, JSON.stringify(parsedDistrict))
        }
    }
}

export default viennaStorage