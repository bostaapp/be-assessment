const axios = require("axios").create();
const Https = require("https");
const Check = require("../models/check");
const Report = require("../models/report");
const nodemailer = require("./nodemailer");

//set request start time
axios.interceptors.request.use((config) => {
    config.headers["start-time"] = Date.now();
    return config;
});

//set request duration time from request to response
axios.interceptors.response.use((response) => {
    const start = response.config.headers["start-time"];
    const duration = Date.now() - start;
    response.headers["duration"] = duration;
    return response;
});

//setup options
const setupAxiosOptions = (check) => {
    let axiosOptions = {
        url: check.url,
        timeout: check.timeout * 1000,
        //rejectUnauthorized option to ignore SSL errors when making a request with Axios
        httpsAgent: new Https.Agent({
            rejectUnauthorized: check.ignoreSSL,
        }),
    };
    if (check.httpHeaders && check.httpHeaders.length > 0) {
        axiosOptions.headers = check.httpHeaders;
    }
    if (check.authentication) {
        axiosOptions.auth = {
            username: check.authentication.username,
            password: check.authentication.password,
        };
    }

    return axiosOptions;
};

//update report data
const updateReportUsingResponse = (report, check, res) => {
    const status = res.status;
    const isOk = status > 199 && status < 300;
    const outages = isOk ? report.outages : report.outages + 1;
    const uptimeRequests = isOk
        ? report.uptimeRequests + 1
        : report.uptimeRequests;
    const availability = (uptimeRequests / (uptimeRequests + outages)) * 100;
    const downtime = isOk ? report.downtime : report.downtime + check.interval;
    const uptime = isOk ? report.uptime + check.interval : report.uptime;
    const history = report.history;
    history.push({
        status: res.status,
        responseTime: res.headers["duration"],
    });
    const totalResponseTime = history.reduce(
        (acc, h) => acc + h.responseTime,
        0
    );
    const avgResponseTime = totalResponseTime / history.length;
    const responseTime = avgResponseTime;

    if (history.length >= check.threshold) {
        let isOutages = true;
        let count = 0;
        for (let i = 0; i < check.threshold; i++) {
            const stat = history[history.length - 1 - i].status;
            if (stat > 199 && stat < 300) isOutages = false;
        }

        if (isOutages)
            nodemailer.sendMail(
                check.authentication.username,
                "Check outages",
                `your ${check.name} is outages for ${check.threshold} times in a row.`
            );
    }

    const reportSchema = {
        status,
        availability,
        outages,
        uptimeRequests,
        downtime,
        uptime,
        responseTime,
        history,
    };

    return reportSchema;
};

const updateReport = async (check, res) => {
    const report = await Report.findOne({ check: check._id });
    if (!report) throw "report of check not exist";

    const reportSchema = updateReportUsingResponse(report, check, res);

    const updatedReport = await Report.findByIdAndUpdate(
        report._id,
        reportSchema
    );

    //console.log("updatedReport");
};

//set interval
module.exports = (check) => {
    try {
        let intervalObj = setInterval(async () => {
            try {
                //const check = await Check.findById(check._id);
                const axiosOptions = setupAxiosOptions(check);

                const res = await axios.get(check.url, axiosOptions);
                //console.log(res);
                await updateReport(check, res);
            } catch (error) {
                if (error.response) {
                    const start = error.response.config.headers["start-time"];
                    const duration = Date.now() - start;
                    error.response.headers["duration"] = duration;
                    await updateReport(check, error.response);
                }
                console.log("error at axios"+error);
            }
        }, check.interval);

        return intervalObj;
    } catch (error) {
        console.log("at set interval: " + error);
    }
};
