const _ = require('lodash');

const Report = require('../../models/report');


module.exports = function createReport(reportData) {

  let updatedReport;

  const createReport = async () => {
    try{
      const report = new Report(_.pick(reportData, ['status', 'availability', 'outages', 'downtime', 'uptime', 'aveResponseTime', ]));
      report.forCheck = reportData.checkId;
      await report.save();
    } catch(err) {
      throw err;
    }
  }
  
  const updateReport = async () => {
    try {
      const report = await Report.findOne({
        forCheck: reportData.checkId
      });

      if(!report){
        createReport();
        return;
      }

      const filter = { forCheck: reportData.checkId };
      updatedReport = await Report.findOneAndUpdate(filter, reportData);
      console.log("from update Report", updatedReport);
  
    } catch (error) {
      throw error;
    }
  }

  const saveReport = async () => {
    try {
      await updatedReport.save();
      console.log("report Saved", updatedReport);
    } catch (error) {
      throw error;
    }
  }

  return {
    updateReport,
    saveReport
  }
}