const { StatusCodes } = require("http-status-codes");
const { isAuthorized } = require("../../../../common/services/isAuthorized");
const { pagination } = require("../../../../common/services/pagination");
const Check = require("../../checks/models/CheckModel");
const Report = require("../models/ReportModel");


exports.getReports = async (req, res) => {
    const { page = 1, size = 6, tags } = req.query;
    const { skip, limit } = pagination(page, size);
    let reports = [];
    try {
        if (tags) {
            const checks = await Check.find({ owner: req.user._id, tags: tags });

            for (let i = 0; i < checks.length; i++) {
                const check = checks[i];
                const report = await Report.findOne({ checkId: check._id })
                if (report) {
                    reports.push(report)
                }

            }

        }
        else {
            reports = await Report.find({ checkOwner: req.user._id }).limit(limit).skip(skip);
        }
        res
            .status(StatusCodes.OK)
            .json({ data: reports })


    } catch (err) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: err })
    }

}

exports.getreportById = async (req, res) => {
    const { reportId } = req.params;
    try {
        const report = await Report.findById(reportId);
        if (report) {
            const authorized = isAuthorized(req.user._id, report.checkOwner);
            if (!authorized) {
                res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ message: "UNAUTHORIZED" })
            }
            else {
                res
                    .status(StatusCodes.OK)
                    .json({ data: report })
            }
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
