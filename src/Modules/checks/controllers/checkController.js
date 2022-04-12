const { StatusCodes } = require("http-status-codes");
const { isAuthorized } = require("../../../../common/services/isAuthorized");
const eventEmitter = require("../../../../common/services/eventEmitter");
const { pagination } = require("../../../../common/services/pagination");
const Check = require("../../checks/models/CheckModel");
const Report = require("../../reports/models/ReportModel");


exports.putCheck = async (req, res) => {
    let { href } = req.body;
    try {
        const exists = await Check.findOne({ href, owner: req.user._id })
        if (!exists) {
            let check = await await new Check({
                ...req.body, owner: req.user._id,
            });;
            const newCheck = await check.save();
            const report = await new Report({ checkId: newCheck._id, checkOwner: req.user._id });
            await report.save();
            eventEmitter.emit("createCheck", newCheck);
            res
                .status(StatusCodes.CREATED)
                .json({ message: "Your check have been sent successfully", data: newCheck });
        }
        else {
            const check = await Check.findByIdAndUpdate(exists._id, { ...req.body }, { new: true });
            const updatedCheck = await check.save();
            eventEmitter.emit("updateCheck", updatedCheck);
            res
                .status(StatusCodes.OK)
                .json({ message: "Your check have been updated successfully", data: updatedCheck });
        }
    }
    catch (err) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: err })
    }

}

exports.updateCheck = async (req, res) => {
    let { id } = req.params;
    try {
        const exists = await Check.findById(id)
        if (!exists) throw new Error("INVALID ID");
        else {
            const check = await Check.findByIdAndUpdate(id, { ...req.body }, { new: true });
            const updatedCheck = await check.save();
            eventEmitter.emit("updateCheck", updatedCheck);
            res
                .status(StatusCodes.OK)
                .json({ message: "Your check have been updated successfully", data: updatedCheck });
        }
    }
    catch (err) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: err })
    }

}

exports.getCheckById = async (req, res) => {
    const { checkId } = req.params;
    try {
        // console.log(checkId)
        const check = await Check.findById(checkId);
        // console.log(check)
        if (check) {
            const authorized = isAuthorized(req.user._id, check.owner);
            if (!authorized) {
                res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: "UNAUTHORIZED" })
            }
            res
                .status(StatusCodes.OK)
                .json({ data: check })
        }
        else {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "not found" })
        }

    } catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error })
    }
}

exports.getChecks = async (req, res) => {
    const { page = 1, size = 6, search } = req.query;
    const { skip, limit } = pagination(page, size);
    try {
        // const checks = await Check.find({ owner: req.user._id });
        const checks = (search) ? await Check.find({ owner: req.user._id, tags: search })
            :
            await Check.find({ owner: req.user._id }).limit(limit).skip(skip);

        res
            .status(StatusCodes.OK)
            .json({ data: checks })

    } catch (err) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: err })

    }

}

exports.deleteChecks = async (req, res) => {

    const { checkId } = req.params;
    try {
        const check = await Check.findById(checkId);
        if (!check) res.status(StatusCodes.BAD_REQUEST).json({ message: "Not Found" });
        else {
            const authorized = isAuthorized(req.user._id, check.owner);
            if (!authorized) {
                res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: "UNAUTHORIZED" })
            }
            else {
                await Check.findByIdAndRemove(checkId)
                eventEmitter.emit("deleteCheck", check);
                await Report.findOneAndRemove({ checkId: checkId, checkOwner: req.user._id })
                res
                    .status(StatusCodes.OK)
                    .json({ message: "deleted successfully" })
            }
        }

    } catch (err) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: err })
    }

}




