const path = require("path");
const { pagination } = require("../../common/pagination");
const Check = require("../../models/check");
const Report = require("../../models/report");

exports.getAllReports = async (req, res) => {
    const { page = 1, size = 1, tags } = req.query;
    const { skip, limit } = pagination(page, size);
    const userId = req.user._id;
    try {
        const reports = tags
            ? await Report.find({})
                  .populate({
                      path: "check",
                      match: { user: userId, tags: tags },
                  })
                  .limit(limit)
                  .skip(skip)
            : await Report.find({})
                  .populate({
                      path: "check",
                      match: { user: userId },
                  })
                  .limit(limit)
                  .skip(skip);
        res.status(200).json({ reports: reports });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
    }
};

exports.getReportById = async (req, res) => {
    const reportId = req.params.id;
    try {
        const report = await Report.findById(reportId).populate({
            path: "check",
        });
        
        if (!report)
            return res.status(404).json({ message: "Report not found" });

        const isAuth = req.user._id.toString() == report.check.user.toString();
        if (!isAuth)
            return res.status(401).json({ message: "Unauthorized user" });

        res.status(200).json({ report: report });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
