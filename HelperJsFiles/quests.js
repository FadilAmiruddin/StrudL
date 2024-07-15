// quests.js

/**
 * Simple quest object to store quest information ands fo completion statur a district.
 * 
 */
export default class Quest {
    constructor(questName, questDescription, districtNum) {
        this.questName = questName;
        this.questDescription = questDescription;
        this.districtNum = districtNum;
        this.Completed = false;
    }

    getQuestName() {
        return this.questName;
    }

    getQuestDescription() {
        return this.questDescription;
    }

    getDistrictNum() {
        return this.districtNum;
    }
}
