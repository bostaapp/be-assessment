const Check = require("../../checks/models/CheckModel");
const Report = require("../models/ReportModel");

exports.getReportByIdService = async (reportId, userId) => {
    const report = await Report.findById(reportId);
    if (report) {
        const authorized = (userId == report.checkOwner) ? true : false;
        if (!authorized) {
            throw new Error('UNAUTHORIZED')
        }
        else {
            return report;
        }
    }

}

exports.getReportByTagService = async (search, userID) => {
    let reports = [];
    const checks = await Check.find({ owner: userID, tags: search });
    if (!checks) throw new Error ("Not Found")
    for (let i = 0; i < checks.length; i++) {
        const check = checks[i];
        const report = await Report.findOne({ checkId: check._id })
        if (report) {
            reports.push(report)
        }
    }
    return reports;
}

