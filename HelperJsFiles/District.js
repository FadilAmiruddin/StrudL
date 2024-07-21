import viennaStorage from "./viennaStorage";

export default class District {
    constructor(name, districtNum, questIndices) {
        this.name = name;
        this.districtNum = districtNum;
        this.quests = questIndices
        this.shrouded = true
    }

    duplicate() {
        var out = new District(this.name, this.districtNum, this.quests)
        out.shrouded = this.shrouded
    }

    getDistrictName() {
        return this.name;
    }

    getQuestsAmt() {
        return this.quests.length;
    }

    getQuests() {
        return this.quests;
    }

    getShrouded() {
        return this.shrouded
    }

    async setShrouded(to) {
        this.shrouded = to
        await viennaStorage.async.writeIndividualDistrictShroud(this.districtNum, to)
    }

}
