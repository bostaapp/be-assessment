const Report = require("../../models/Report");

async function CreateReport(check) {
  const reports = await Report.find({
    checkId: check._id,
  });
  result = {};
  if (!reports) {
    result = {
      checkId: check._id,
      url: check.url,
      name: check.name,
      ups: 0,
      Curruntstatus: 0,
      availability: 0,
      outages: 0,
      downtime: 0,
      uptime: 0,
      averageResponseTime: 0,
      history: [],
    };
    return result;
  }
  Curruntstatus = 0;
  availability = 0;
  outages = 0;
  downtime = 0;
  uptime = 0;
  ups = 0;
  averageResponseTime = 0;
  newestReportDate = reports[0].time;
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].time > newestReportDate) {
      newestReportDate = reports[i].time;
      Curruntstatus = reports[i].status;
    }
    if (reports[i].status == -1) {
      outages++;
      downtime += check.interval;
    } else {
      uptime += check.interval;
      averageResponseTime += reports[i].responseTime;
      ups++;
    }
  }
  averageResponseTime = averageResponseTime / ups;
  availability = (uptime / (uptime + downtime)) * 100;
  result = {
    checkId: check._id,
    url: check.url,
    name: check.name,
    ups,
    Curruntstatus,
    availability,
    outages,
    downtime,
    uptime,
    averageResponseTime,
    history: reports,
  };
  return result;
}

module.exports = {
  CreateReport,
};
