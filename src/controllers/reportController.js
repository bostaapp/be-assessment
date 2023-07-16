const reportService = require("../services/reportService");

const createReport = async (req, res) => {
	try {
		const {
			checkId,
			status,
			availability,
			outages,
			downtime,
			uptime,
			responseTime,
			history,
		} = req.body;

		const report = reportService.createReport({
			checkId,
			status,
			availability,
			outages,
			downtime,
			uptime,
			responseTime,
			history,
		});

		res.json(report);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getReportsByCheckId = async (req, res) => {
	try {
		const { checkId } = req.body;
		const reports = await reportService.getReportsByCheckId(checkId);
		res.json(reports);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getReportById = async (req, res) => {
	try {
		const { id } = req.params;
		const report = reportService.getReportById(id);

		res.json(report);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const deleteReport = async (req, res) => {
	try {
		const { id } = req.params;
		const report = reportService.deleteReport(id);

		res.json({ message: "Report deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	createReport,
	getReportById,
	deleteReport,
	getReportsByCheckId,
};
