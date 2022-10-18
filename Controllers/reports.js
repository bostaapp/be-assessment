const { apiError } = require("../Utils/apiError");
const { Report, validateReport } = require("../Models/report");

function validReportParameters(report) {
    const isNotValid = validateReport(report);
    if (isNotValid) throw new apiError(400, isNotValid.details[0].message);
}

const createReport = async (report, checkID, userID) => {
    if (!userID)
        throw new apiError(400, "Missing User ID");
    if (!checkID)
        throw new apiError(400, "Missing Check ID");

    // Empty Reports are Allowed
    validReportParameters(report);

    // Check for Duplicate Report
    const foundDuplicate = await Report.findOne({ urlID: checkID, userID });
    if (foundDuplicate)
        throw new apiError(400, "Duplicate Report");

    const newReport = await new Report({
        ...report,
        urlID: checkID,
        userID
    }).save();

    return { message: "Report Created ", newReport };
};

const getReport = async (checkID, userID) => {
    if (!userID)
        throw new apiError(400, "Missing User ID");
    if (!checkID)
        throw new apiError(400, "Missing Check ID");

    const userReport = await Report.find({ urlID: checkID, userID });
    return { message: "Reports Found", userReport };
};

const updateReport = async (newReport, checkID, userID) => {
    if (!newReport || Object.keys(newReport).length === 0)
        throw new apiError(400, "Empty Update Check");
    if (!checkID)
        throw new apiError(400, "Missing Check ID");
    if (!userID)
        throw new apiError(400, "Missing User ID");

    validReportParameters(newReport);
    const exists = await Report.exists({ urlID: checkID, userID });
    if (!exists)
        throw new apiError(400, "Check Not Found");

    await Report.findByIdAndUpdate(exists, newReport);
    return { message: "Report Updated" };
};

const deleteReport = async (checkID, userID) => {
    if (!checkID)
        throw new apiError(400, "Missing Check ID");
    if (!userID)
        throw new apiError(400, "Missing User ID");

    const exists = await Report.exists({ urlID: checkID, userID });
    if (!exists)
        throw new apiError(400, "Check Not Found");

    await Report.findByIdAndDelete(exists);
    return { message: "Check Deleted" };
};

module.exports = {
    createReport,
    getReport,
    updateReport,
    deleteReport
};