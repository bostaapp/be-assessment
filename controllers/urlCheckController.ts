import schedule from "node-schedule";
import { RequestHandler } from "express";
import { prisma } from "../utils/db";
import { Report, UrlCheckOptions } from "../utils/types";
import { $Enums, User } from "@prisma/client";

const upsertUrlCheck: RequestHandler = async (req, res) => {
	const { authentication, user, ...urlCheckOptions } =
		req.body as UrlCheckOptions & { user: User };

	if (!urlCheckOptions) {
		return res.status(400).send("Wrong options");
	}

	const { url } = urlCheckOptions;
	let status: $Enums.UrlStatus = "DOWN";

	try {
		const response = await fetch(url);
		if (response.ok || response.status === 200) {
			status = "UP";
		}
	} catch (error) {
		status = "DOWN";
	}

	const check = await prisma.urlCheck.upsert({
		create: { ...urlCheckOptions, url, User: { connect: { id: user.id } } },
		where: { url_userId: { url, userId: user.id } },
		update: { ...urlCheckOptions },
	});

	const poll = schedule.scheduleJob(
		`*/${urlCheckOptions?.interval ?? 600} * * * * *`,
		async function () {
			let status: $Enums.UrlStatus = "UP";
			let responseTime: number | undefined;

			const lastUrlLog = await prisma.urlLog.findFirst({
				where: { UrlCheck: { url, userId: user.id } },
				orderBy: { dateTime: "desc" },
			});

			try {
				const start = Date.now();
				const response = await fetch(url);

				status =
					response.status >= 200 && response.status < 400 ? "UP" : "DOWN";
				responseTime = status ? Date.now() - start : undefined;
			} catch (error) {
				status = "DOWN";
				responseTime = undefined;
			}

			// if (lastUrlLog && lastUrlLog.status !== status) {
			// 	sendEmail({ recipient: username });
			// }

			await prisma.urlLog.create({
				data: {
					UrlCheck: { connect: { url_userId: { userId: user.id, url } } },
					status,
					responseTime,
				},
			});
		}
	);

	res.send(check);
};

const getUrlReport: RequestHandler = async (req, res) => {
	const { user, url } = req.body;
	const userId = user.id;
	let currentStatus: $Enums.UrlStatus = "DOWN";

	try {
		const response = await fetch(url);
		currentStatus = response.ok ? "UP" : "DOWN";
	} catch (error) {}

	const [urlLogs, totalUpLogs, totalDownLogs, responseTime] =
		await prisma.$transaction([
			prisma.urlLog.findMany({
				where: { UrlCheck: { url, userId } },
			}),
			prisma.urlLog.count({
				where: { UrlCheck: { userId, url }, status: "UP" },
			}),
			prisma.urlLog.count({
				where: { UrlCheck: { userId, url }, status: "DOWN" },
			}),
			prisma.urlLog.aggregate({
				_avg: { responseTime: true },
				where: { UrlCheck: { userId, url }, status: "UP" },
			}),
		]);

	const report: Report = {
		status: currentStatus,
		outages: totalDownLogs,
		responseTime: responseTime._avg.responseTime!,
		availability:
			urlLogs.length > 0
				? `${Math.round((totalUpLogs / urlLogs.length) * 100)}%`
				: "0%",
		uptime: totalUpLogs * 10 * 60,
		downtime: totalDownLogs * 10 * 60,
		history: urlLogs,
	};
	res.send(report);
};

const getReportsByTag: RequestHandler = async (req, res) => {
	const tag = req.params.tag;
	const user = req.body.user;

	const userId = user.id;
	const urlChecksByTag = await prisma.urlCheck.findMany({
		where: { tags: { has: tag } },
	});

	const reports = await Promise.all(
		urlChecksByTag.map((urlCheck) => {
			const url = urlCheck.url;
			return (async function () {
				let currentStatus: $Enums.UrlStatus = "DOWN";
				try {
					const response = await fetch(url);
					currentStatus = response.ok ? "UP" : "DOWN";
				} catch (error) {}

				const [urlLogs, totalUpLogs, totalDownLogs, responseTime] =
					await prisma.$transaction([
						prisma.urlLog.findMany({
							where: { UrlCheck: { url, userId } },
						}),
						prisma.urlLog.count({
							where: { UrlCheck: { userId, url }, status: "UP" },
						}),
						prisma.urlLog.count({
							where: { UrlCheck: { userId, url }, status: "DOWN" },
						}),
						prisma.urlLog.aggregate({
							_avg: { responseTime: true },
							where: { UrlCheck: { userId, url }, status: "UP" },
						}),
					]);

				const report: Report = {
					status: currentStatus,
					outages: totalDownLogs,
					responseTime: responseTime._avg.responseTime!,
					availability: `${Math.round((totalUpLogs / urlLogs.length) * 100)}%`,
					uptime: totalUpLogs * 10 * 60,
					downtime: totalDownLogs * 10 * 60,
					history: urlLogs,
				};

				return report;
			})();
		})
	);

	res.send(reports);
};

const removeUrlCheck: RequestHandler = async (req, res) => {
	const { url, email } = req.body;
	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		return res.status(404).send();
	}

	await prisma.urlCheck.delete({
		where: { url_userId: { userId: user?.id, url } },
	});

	res.send("Url Check Deleted");
};

export default {
	upsertUrlCheck,
	getUrlReport,
	getReportsByTag,
	removeUrlCheck,
};
