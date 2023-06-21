import axios from "axios";
import Report from "../models/Report.js";
import https from "https";
import UrlCheck from "../models/UrlCheck.js";
import User from "../models/User.js";
import { sendNotificationEmail, webhookNotifications } from "../helpers/notifications.js";
import { assert } from "console";

async function pingUrl(urlCheck) {
    let report = await Report.findOne({ urlCheckId: urlCheck._id });
    if (!report) return
    // let availability = report.availability ? report.availability : 0;
    let outages = report.outages ? report.outages : 0;
    let downtime = report.downtime ? report.downtime : 0;
    let uptime = report.uptime ? report.uptime : 0;
    let thresholdCount = 0;
    let history = report.history ? report.history : [];

    console.log(`Url monitor started for ${urlCheck.url}`);
    const id = setInterval(async () => {
        let updatedReport;
        const reportExist = await Report.findOne({ urlCheckId: urlCheck._id });
        if (!reportExist) {
            console.log(urlCheck.name + " ||| Deleted");
            clearInterval(id);
        }

        if (thresholdCount === urlCheck.threshold) {
            console.log(urlCheck.name + " || threshold limit reached ")
            console.log("Sending alert email.....");
        }
        const start = Date.now()
        try {
            let requestOptions = {
                timeout: urlCheck.timeout,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: urlCheck.ignoreSSL
                })
            }
            if (urlCheck.httpHeaders && urlCheck.httpHeaders > 0) {
                requestOptions.httpHeaders = urlCheck.httpHeaders;
            }
            if (urlCheck.authentication) {
                requestOptions.auth = urlCheck.authentication;
            }
            let url = !urlCheck.path ? urlCheck.url : urlCheck.url + path;
            const response = await axios.get(url, requestOptions);
            const finish = Date.now()
            const time = (finish - start) / 1000
            if ((urlCheck.assert.statusCode === response.status) || (response.status >= 200 < 300)) {
                console.log(urlCheck.name + " || " + response.status);
                // console.log(urlCheck.name + " || " + response.statusText)
                // console.log(urlCheck.name + " || " + time);
                history.push({ status: "available", timestamp: Date.now() });
                uptime += urlCheck.interval / 1000;
                updatedReport = {
                    status: "available",
                    availability: `${(uptime / (uptime + downtime)) * 100}%`,
                    outages: outages,
                    downtime: downtime,
                    uptime: uptime,
                    responseTime: time,
                    history: history
                }

            } else {
                throw "status code required not met"
            }
        } catch (error) {
            const finish = Date.now();
            const time = (finish - start) / 1000
            // console.log(urlCheck.name + " || " + time);
            console.log(urlCheck.name + " || " + error.message);
            outages++;
            downtime += urlCheck.interval / 1000;
            history.push({ status: "unavailable", timestamp: Date.now() });
            updatedReport = {
                status: "unavailable",
                availability: `${(uptime / (uptime + downtime)) * 100}%`,
                outages: outages,
                downtime: downtime,
                uptime: uptime,
                responseTime: time,
                history: history
            }
        }
        // console.log(updatedReport);
        if (history.length > 2) {
            if (history[history.length - 1].status !== history[history.length - 2].status) {
                thresholdCount = 0;
                const user = await User.findById(urlCheck.userId);
                sendNotificationEmail(user.email, `${urlCheck.name} is ${history[history.length - 1].status} `);
                if (urlCheck.webhook !== "") {
                    webhookNotifications(urlCheck.url, `${urlCheck.name} is ${history[history.length - 1].status} `, urlCheck.webhook)
                }

            }
        }
        await Report.findByIdAndUpdate(reportExist._id, updatedReport);
    }, urlCheck.interval);
}

export default pingUrl