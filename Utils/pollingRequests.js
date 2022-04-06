const axios = require("./axios");
const https = require("https");
const Report = require("../Models/reportSchema");
const Check = require("../Models/checkSchema");

module.exports = (check) => {
  let x = setInterval(() => {
    Check.findById(check._id).then((check) => {
      const URL = check.port
        ? `${check.protocol}://${check.url}:${check.port}${check.path}`
        : `${check.protocol}://${check.url}${check.path}`;
      let options = {
        headers: { ...check.headers },
        timeout: check.timeout * 1000,
        httpsAgent: new https.Agent({
          rejectUnauthorized: check.ignoreSSL,
        }),
      };
      if (check.authentication) {
        options.auth = {
          username: check.authentication.username,
          password: check.authentication.password,
        };
      }
      axios
        .get(URL, options)
        .then((res) => {
          Report.findOne({ check: check._id })
            .then((report) => {
              let newStatus = res.status;
              let newOutages = res.error ? report.outages + 1 : report.outages;
              let newRequests = report.requests + 1;
              let newAvailability =
                ((newRequests - newOutages) / newRequests) * 100;
              let newDowntime = res.error
                ? report.downtime + check.interval
                : report.downtime;
              let newUptime = res.error
                ? report.uptime
                : report.uptime + check.interval;
              let newResponseTime = res.error
                ? report.responseTime
                : (report.responseTime + res.headers["duration"]) / 2;
              let newHistory = report.history;
              newHistory.push({
                status: res.status,
                responseTime: res.headers["duration"],
              });
              Report.findByIdAndUpdate(report._id, {
                status: newStatus,
                availability: newAvailability,
                outages: newOutages,
                requests: newRequests,
                downtime: newDowntime,
                uptime: newUptime,
                responseTime: newResponseTime,
                history: newHistory,
              })
                .then((newReport) => {
                  console.log(newReport);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, check.interval * 1000);

  return x;
};
