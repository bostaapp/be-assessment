const cron = require("node-cron");
const axios = require("axios");
const axiosTime = require("axios-time");

const { Report } = require("../models/Report");
const { sendServiceDownEmail } = require("./mailer");

axiosTime(axios);

class cronJob {
  static check_jobs = {};

  isUP = async (check) => {
    let siteUrl =
      check.protocol + "://" + check.url + ":" + check.port + check.path;

    try {
      let res = await new axios({
        method: "get",
        url: siteUrl,
      });

      let elapsedTime = res.timings.elapsedTime;
      if (res.status == check.assert.statusCode)
        return { up: true, status: res.status, responseTime: elapsedTime };
      else {
        return { up: false, status: res.status, responseTime: elapsedTime };
      }
    } catch {
      return { up: false, status: 400, responseTime: 0 };
    }
  };

  // hash map that store the time for each job

  // job to check if the url is up or down

  createCheckJob = async (check) => {
    // job that runs every 10 seconds to check if the url is up or down

    cron.schedule(`0 */${check.interval} * * * *`, async () => {
      try {
        let { up, status, responseTime } = await this.isUP(check);

        if (!cronJob.check_jobs[check.id]) {
          let checkTime = {
            total_time: 10,
            up_time: up == true ? 10 : 0,
            down_time: up == false ? 10 : 0,
            history_log: [
              up == true
                ? `Success: GET Request With Status ${status} in time ${responseTime} sec`
                : `Fail: GET ${status} in time ${responseTime} sec`,
            ],
            status: up == true ? "UP" : "DOWN",
          };
          cronJob.check_jobs[check.id] = checkTime;
        } else {
          cronJob.check_jobs[check.id].total_time += 10;
          cronJob.check_jobs[check.id].up_time += up == true ? 10 : 0;
          cronJob.check_jobs[check.id].down_time += up == false ? 10 : 0;
          cronJob.check_jobs[check.id].status = up == true ? "UP" : "DOWN";
          cronJob.check_jobs[check.id].history_log.push(
            up == true
              ? `Success: GET Request With Status ${status} in time ${responseTime} sec`
              : `Fail: GET ${status} in time ${responseTime}sec`
          );
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  createReportJob = async (check, user) => {
    await this.createCheckJob(check);
    // run interval in minutes
    cron.schedule(`0 */${check.interval} * * * *`, async () => {
      let report = await Report.findOne({ checkId: check.id });

      let current_check = cronJob.check_jobs[check.id];

      let values = {
        status: current_check.status,
        availability: (current_check.up_time * 100) / current_check.total_time,
        downTime: current_check.downTime,
        upTime: current_check.upTime,
        responseTime: current_check.responseTime,
        historyLog: current_check.history_log,
        checkId: check.id,
      };

      if (current_check.status == "DOWN") {
        sendServiceDownEmail(user, check.url);
      }
      // if he didnt find any report
      // make a new report
      try {
        if (!report) {
          let d = new Report(values);
          console.log(d);
          await d.save();
        } else {
          await report.update(values);
          console.log(report);
        }
      } catch (err) {
        console.log(err);
      }
    });
  };
}

module.exports = cronJob;
