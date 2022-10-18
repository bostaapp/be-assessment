const sendEmail = require("../Utils/mail");
const userController = require("./users");
const reportController = require("./reports");
const { Check } = require("../Models/urlCheck");
const axios = require("axios");
const https = require("https");

const axiosInstance = axios.create();

// Configure axios to calculate request parameters
axiosInstance.interceptors.request.use((axiosRequestConfig) => {
    axiosRequestConfig.headers["start"] = Date.now();
    return axiosRequestConfig;
}, function(error) {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use((axiosResponseConfig) => {
    const start = axiosResponseConfig.config.headers["start"];
    axiosResponseConfig.config.headers["end"] = Date.now();

    axiosResponseConfig.config.headers["duration"] = Date.now() - start;
    return axiosResponseConfig;
}, function(error) {
    error.config.headers["end"] = Date.now();

    error.config.headers["duration"] = error.config.headers["end"] - error.config.headers["start"];
    return Promise.reject(error);
});

async function updateReportOnSuccess(userID, checkID, success) {
    console.log("Success >>>");

    const { userReport } = await reportController.getReport(checkID, userID);
    const oldReport = userReport[0];

    const newReport = {
        status: "available",
        availability: Math.round((oldReport.uptime / (oldReport.downtime + oldReport.uptime + 1) * 100)),
        uptime: oldReport.uptime + parseInt(success.config.headers["duration"]),
        responseTime: parseInt(success.config.headers["duration"]),
        history: oldReport.history
    };
    newReport.history.push({
        status: "available",
        availability: Math.round((oldReport.uptime / (oldReport.downtime + oldReport.uptime + 1) * 100))
    });
    await reportController.updateReport(newReport, checkID, userID);
}

async function updateReportOnFail(userID, checkID, fail) {
    console.log("FAIL >>>");
    const { userReport } = await reportController.getReport(checkID, userID);
    const oldReport = userReport[0];
    const { threshold } = await Check.findById(checkID);

    const newReport = {
        status: fail.response ? "error" : "unavailable",
        downtime: oldReport.downtime + parseInt(fail.config.headers["duration"]),
        outages: fail.response ? oldReport.outages + 1 : oldReport.outages,
        responseTime: parseInt(fail.config.headers["duration"]),
        history: oldReport.history
    };

    newReport.history.push({
        status: fail.response ? "error" : "unavailable",
        availability: Math.round((oldReport.uptime / (newReport.downtime + oldReport.uptime + 1) * 100))
    });

    if (newReport.outages % threshold === 0) {
        // Notify User by mail
        const user = await userController.userExists(userID);
        const message = `Dear ${user.username},\n Your Service with url: ${fail.config.url} Failed`;
        await sendEmail(user.email, "Failed Service", message);
    }

    await reportController.updateReport(newReport, checkID, userID);
}

async function testURL(urlCheck) {
    const options = {
        headers: { ...urlCheck.httpHeaders },
        method: `get`,
        timeout: urlCheck.timeout,
        ignoreSSL: new https.Agent({
            rejectUnauthorized: urlCheck.ignoreSSL
        })
    };

    let url = urlCheck.port ?
        `${urlCheck.protocol}//${urlCheck.url}:${urlCheck.port}` :
        `${urlCheck.protocol}//${urlCheck.url}`;

    if (urlCheck.path) {
        url += urlCheck.path;
    }

    if (urlCheck.authentication) {
        options.auth = {
            username: urlCheck.authentication.username,
            password: urlCheck.authentication.password
        };
    }

    console.log("Checking .. ", url);

    await axiosInstance.get(url, options).then((resp) => {
        // Update Report with Successful entry
        console.log(resp.config.headers["duration"]);
        updateReportOnSuccess(urlCheck.userID, urlCheck._id, resp);

    }).catch((error) => {
        // Update Report with Failure Entry
        console.log(error.config.headers["duration"]);
        updateReportOnFail(urlCheck.userID, urlCheck._id, error);
    });
}

module.exports = { testURL };


// axiosInstance.get("https://www.pinclipart.com/").then((resp) => {
//     // Update Report with Successful entry
//     console.log("success", resp.config.headers["duration"]);
// }).catch((error) => {
//     // Update Report with Failure Entry
//     console.log(error);
//     console.log("fail", error.config.headers["duration"]);
//
// });
