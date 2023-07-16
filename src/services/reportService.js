const Report = require("../models/Report");
const URLCheck = require("../models/URLCheck");

const createReport = async ({
	checkId,
	status,
	availability,
	outages,
	downtime,
	uptime,
	responseTime,
	history,
	lastCheckedAt,
	lastStatusChangedAt,
}) => {
	try {
		// Retrieve the URL check associated with the report
		const urlCheck = await URLCheck.findById(checkId);
		if (!urlCheck) {
			return res.status(404).json({ error: "URL check not found" });
		}
		// Save the report
		const report = new Report({
			checkId,
			status,
			availability,
			outages,
			downtime,
			uptime,
			responseTime,
			history,
			lastCheckedAt,
			lastStatusChangedAt,
		});
		await report.save();
		return report;
	} catch (error) {
		throw new Error("Failed to create report");
	}
};

const getReportById = async (reportId) => {
	try {
		const report = await Report.findById(reportId);
		if (!report) {
			throw new Error("Report not found");
		}
		return report;
	} catch (error) {
		throw new Error("Failed to get report");
	}
};

const getReportsByCheckId = async (checkId) => {
	try {
		const report = await Report.find({ checkId });
		if (!report) {
			throw new Error("Report not found");
		}
		return report;
	} catch (error) {
		throw new Error("Failed to get report");
	}
};
const updateReport = async (reportId, updatedData) => {
	try {
		const report = await Report.findByIdAndUpdate(reportId, updatedData, {
			new: true,
		});
		if (!report) {
			throw new Error("Report not found");
		}
		return report;
	} catch (error) {
		throw new Error("Failed to update report");
	}
};

const deleteReport = async (reportId) => {
	try {
		const report = await Report.findByIdAndDelete(reportId);
		if (!report) {
			throw new Error("Report not found");
		}
	} catch (error) {
		throw new Error("Failed to delete report");
	}
};

// Other report-related service methods

module.exports = {
	createReport,
	getReportById,
	updateReport,
	deleteReport,
	getReportsByCheckId,
};
