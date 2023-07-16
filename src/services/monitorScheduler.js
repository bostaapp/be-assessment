const cron = require("node-cron");
const axios = require("axios");
const urlCheckController = require("../controllers/urlCheckController");
const reportService = require("./reportService");
const User = require("../models/User");
require("dotenv").config();

const updateReportHandler = async (
	report,
	responseTime,
	status,
	userEmail,
	urlCheckName
) => {
	try {
		// update URL check with new data
		const history = report.history;

		history.push({ timestamp: Date.now(), status: status, responseTime });
		const avgResponseTime =
			history.reduce((acc, curr) => {
				acc += curr.responseTime;
			}) / history.length;

		if (history.length > 1440) history.shift(); // keep last 24 hours of history
		const availability = calculateAvailability(history);
		const outages = calculateOutages(history);
		const downtime = calculateDowntime(history);
		const uptime = calculateUptime(history);
		const updatedReport = await reportService.updateReport(report._id, {
			status,
			availability,
			outages,
			downtime,
			uptime,
			responseTime: avgResponseTime,

			history,

			lastCheckedAt: Date.now(),
			lastStatus: status,
			lastStatusChangedAt:
				report.lastStatus !== status ? Date.now() : report.lastStatusChangedAt,
		});
		// send notifications if necessary
		if (report.lastStatus !== status) {
			sendNotification(status, userEmail, urlCheckName);
		}
	} catch (error) {
		console.log(
			"🚀 ~ file: monitorScheduler.js:66 ~ uptimeHandler ~ error:",
			error
		);
	}
};

const runMonitorScheduler = async () => {
	// define cron job to send polling requests
	cron.schedule("*/10 * * * *", async () => {
		// const urlChecks = await UrlCheck.find();
		const urlChecks = await urlCheckController.getURLChecks();
		urlChecks.forEach(async (urlCheck) => {
			const user = User.findOne(urlCheck.userId);
			if (!user) throw error("user not found");
			const startTime = Date.now();
			try {
				const response = await axios({
					method: urlCheck.protocol.toLowerCase(),
					url: `${urlCheck.protocol.toLowerCase()}://${urlCheck.url}${
						urlCheck.port ? `:${urlCheck.port}` : ""
					}${urlCheck.path ? urlCheck.path : ""}`,
					auth: urlCheck.authentication
						? {
								username: urlCheck.authentication.username,
								password: urlCheck.authentication.password,
						  }
						: undefined,
					headers: urlCheck.httpHeaders
						? urlCheck.httpHeaders.reduce(
								(headers, header) =>
									Object.assign(headers, {
										[header.key]: header.value,
									}),
								{}
						  )
						: undefined,
					timeout: urlCheck.timeout * 1000,
					httpsAgent: check.ignoreSSL
						? new https.Agent({ rejectUnauthorized: false })
						: undefined,
				});

				const endTime = Date.now();
				const responseTime = endTime - startTime;
				const status = "UP";

				const report = reportService.getReportsByCheckId(urlCheck.checkId);

				if (report.length > 0) {
					await updateReportHandler(
						report,
						responseTime,
						status,
						user.email,
						urlCheck.name
					);
				} else {
					const history = [];

					history.push({ timestamp: Date.now(), status: "UP", responseTime });
					// create new report
					const report = {
						checkId: urlCheck._id,
						status,
						availability: 100,
						outages: 0,
						downtime: 0,
						uptime: 1,
						responseTime,
						history,
						lastCheckedAt: Date.now(),
						lastStatus: "UP",
						lastStatusChangedAt: null,
					};
					await reportService.createReport(report);
				}
			} catch (err) {
				const endTime = Date.now();
				const responseTime = endTime - startTime;
				const status = "DOWN";

				const report = reportService.getReportsByCheckId(urlCheck.checkId);

				if (report.length > 0) {
					await updateReportHandler(
						report,
						responseTime,
						status,
						user.email,
						urlCheck.name
					);
				} else {
					const history = [];

					history.push({ timestamp: Date.now(), status: "DOWN", responseTime });
					// create new report
					const report = {
						checkId: urlCheck._id,
						status,
						availability: 0,
						outages: 1,
						downtime: 0,
						uptime: 0,
						responseTime,
						history,
						lastCheckedAt: Date.now(),
						lastStatus: "DOWN",
						lastStatusChangedAt: null,
					};
					await reportService.createReport(report);
					await sendNotification("DOWN", user.email, urlCheck.name);
				}
			}
		});
	});
};

// helper functions for calculating availability, outages, downtime, and uptime
function calculateAvailability(history) {
	const upCount = history.filter((entry) => entry.status === "UP").length;
	return (upCount / history.length) * 100;
}

function calculateOutages(history) {
	const outageCount = history.filter((entry) => entry.status === "DOWN").length;
	return outageCount;
}

function calculateDowntime(history) {
	const downtime = history
		.filter((entry) => entry.status === "DOWN")
		.reduce((totalDowntime, entry, index, array) => {
			if (index === 0 || array[index - 1].status === "UP") {
				return totalDowntime;
			} else {
				return totalDowntime + (entry.timestamp - array[index - 1].timestamp);
			}
		}, 0);
	return downtime;
}

function calculateUptime(history) {
	const uptime = history
		.filter((entry) => entry.status === "UP")
		.reduce((totalUptime, entry, index, array) => {
			if (index === 0 || array[index - 1].status === "DOWN") {
				return totalUptime;
			} else {
				return totalUptime + (entry.timestamp - array[index - 1].timestamp);
			}
		}, 0);
	return uptime;
}

// function for sending notifications
async function sendNotification(status, userEmail, urlCheckName) {

    const msg = {
        to: userEmail,
        from: process.env.EMAIL_FROM,
        subject: "Email Verification",
        text: `The ${urlCheckName} is ${status.toLowerCase()}`,
        html: `The ${urlCheckName} is ${status.toLowerCase()}`,
    };
	try {
		await sgMail.send(msg);

		console.log(
			`Notification email sent to ${msg.to} for URL check ${urlCheckName}`
		);
	} catch (err) {
		console.error(
			`Error sending notification email to ${msg.to} for URL check ${urlCheckName}: ${err.message}`
		);
	}
}
module.exports = { runMonitorScheduler };
