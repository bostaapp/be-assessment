const axios = require('axios');

const { User } = require('../models/user');
const ReportServices = require('../controllers/report/reportServices');
const { sendPingStatus } = require('../services/sendGrid');

module.exports =  async function createUptimeMonitor(check) {
  const { name, url, protocol, path = '/', port = '', timeout, interval, threshold, authentication, httpHeaders, assert, ignoreSSL = false } = check;
  
  const user = await User.findById(check.createdBy);
  if (!user) {
    //* Impossible to happen
    throw new Error('No User for that check');
  }

  const reportData = {
    status: 'unknown',
    availability: 0,
    outages: 0,
    downtime: 0,
    uptime: 0,
    aveResponseTime: 0,
    history: [],
    checkId: check._id
  }

  const checkData = {
    userEmail: user.email,
    name: name,
    protocol: protocol,
    url: url,
    port: port,
    path: path,
    status: reportData.status
  }

  const reportServices = ReportServices(reportData);

  const pingUrl = async () => {

    const startTime = Date.now();
    try {
      const config = {
        method: 'get',
        url: `${protocol}://${url}:${port}${path}`,      
        timeout,
        headers: {},
        auth: authentication,
        //httpsAgent: new https.Agent({ rejectUnauthorized: !ignoreSSL })
      };

      if (httpHeaders) {
        httpHeaders.forEach(obj => {
          const values = Object.values(obj);
          config.headers[values[0]] = values[1];
        });
      }
    
      const response = await axios(config);
      const endTime = Date.now();
      const duration = endTime - startTime;
      reportData.aveResponseTime = (reportData.aveResponseTime + duration) / 2;
      if (assert && assert.statusCode && response.status !== assert.statusCode) {
        await handleFailure('status code does not match', startTime);
      } else {
        await handleSuccess(startTime);
      }
    } catch (error) {
      await handleFailure(error, startTime);
    }
  };

  const handleSuccess = async (startTime) => {
    if (reportData.status !== 'up') {
      reportData.uptime = (reportData.uptime + (Date.now() - startTime)) / 1000;
      reportData.status = 'up';
      checkData.status = 'up';
      reportData.history.push({ timestamp: new Date().toISOString(), status: reportData.status });
      await sendPingStatus(checkData); //sending E-mail when check is up
      
    }
  };

  const handleFailure = async (error, startTime) => {
    if (reportData.status !== 'down') {
      reportData.downtime = (reportData.downtime + (Date.now() - startTime)) / 1000;
      reportData.status = 'down';
      checkData.status = 'down';
      reportData.outages++;
      reportData.history.push({ timestamp: new Date().toISOString(), status: reportData.status });
      await sendPingStatus(checkData); //sending E-mail when check is down

    }
    if (reportData.outages >= threshold) {
      // sendPingStatus(checkData); //sending E-mail when check is down
      // send a webhook notification
    }
  };

  const start = () => {
    setInterval(async () => {
      await pingUrl();
      reportData.availability = (((reportData.uptime / (reportData.uptime + reportData.downtime)) * 100).toFixed(2) || 0);
      const report = { status: reportData.status,  availability: reportData.availability, outages: reportData.outages, downtime: reportData.downtime, uptime: reportData.uptime, aveResponseTime: reportData.aveResponseTime, history: reportData.history };
      console.log(report);
    }, interval);

    // Update the report every 2 minutes and save it to the database every 20 minutes
    setInterval(() => {
      reportServices.updateReport()
    }, 2 * 60 * 1000);
    setInterval(() => {
      reportServices.saveReport()
    }, 20 * 60 * 1000);
  };

  return {
    start,
  };
}