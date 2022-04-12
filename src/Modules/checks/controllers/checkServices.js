const eventEmitter = require("../../../../common/services/eventEmitter");
const Check = require("../../checks/models/CheckModel");
const Report = require("../../reports/models/ReportModel");




exports.getCheckByIdService = async (checkId, userId) => {
    const check = await Check.findById(checkId);
    if (check) {
        const authorized = (userId == check.owner) ? true : false;
        if (!authorized) {
            throw new Error('UNAUTHORIZED')
        }
        return check;
    }
    else {
        throw new Error('NOT FOUND')
    }

}

exports.getCheckByTagService = async (search, userID) => {
    const checks = await Check.find({ owner: userID, tags: search });
    if (!checks) {
        throw new Error('NOT FOUND')
    }
    return checks
}

exports.putCheck = async (data, userId) => {
    let { href } = data;
    const exists = await Check.findOne({ href, owner: userId })
    if (!exists) {
        let check = await new Check({
            data,
            owner: userId,
        });;
        const newCheck = await check.save();
        const report = await new Report({ checkId: newCheck._id, checkOwner: userId });
        await report.save();
        eventEmitter.emit("createCheck", newCheck);
        return { check: newCheck, report: report }
    }
    else {
        const check = await Check.findByIdAndUpdate(exists._id, { ...data }, { new: true });
        const updatedCheck = await check.save();
        eventEmitter.emit("updateCheck", updatedCheck);
        return { check: updatedCheck }
    }
}