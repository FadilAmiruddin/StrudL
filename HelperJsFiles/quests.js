import viennaStorage from "./viennaStorage";

/**
 * Quest objects store a quest's name, description, district number and whether or not the quest is completed.
 */
export default class Quest {
    constructor(questName, questDescription, districtNum) {
        this.questName = questName;
        this.questDescription = questDescription;
        this.districtNum = districtNum;
        this.completed = false;
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

    getCompleted() {
        return this.completed
    }

    setCompleted(to) {
        this.completed = to
    }
}
