const https = require("https");
const Check = require("../../src/Modules/checks/models/CheckModel");
const Report = require("../../src/Modules/reports/models/ReportModel");
const failedCase = require("./failedResponse");
const sucessCase = require("./successResponse");
const { startProcessConfig } = require("./axiosConfig");
const User = require("../../src/Modules/users/models/UserModel");
const axios = require("axios");
const sendEmail = require("../services/sendEmail");

const getOptions = (checkData) => {
  const { timeout, authentication, httpHeaders, ignoreSSL } = checkData;
  let options = {
    headers: httpHeaders,
    timeout: timeout * 1000,
    httpsAgent: new https.Agent({
      rejectUnauthorized: ignoreSSL,
    }),
  };
  if (authentication) {
    options.auth = {
      username: authentication.username,
      password: authentication.password,
    };
  }
  return options;
}

const CheckURLs = async (href, options, checkData, reportData) => {

  try {
    let response = await axios.get(href, options);
    if (response.status == 200) {
      const updatedReportInfo = sucessCase(reportData, checkData, response);
      await Report.findOneAndUpdate({ checkId: checkData._id }, { ...updatedReportInfo });
    }
    else {
      const updatedReportInfo = failedCase(reportData, checkData, response.status);
      await Report.findOneAndUpdate({ checkId: checkData._id }, { ...updatedReportInfo });
      const checkOwner = await User.findById(checkData.owner);
      sendEmail([checkOwner.email],
        `Website Alert`,
        `<h1> unfortunately, your website geos down</h1>`)
    }
  } catch (error) {
    console.log(error);
  }
  
}

const pollingProcess = async (check) => {
  startProcessConfig()
  let interval = setInterval(async () => {
    try {
      const checkData = await Check.findById(check._id);
      const reportData = await Report.findOne({ checkId: check._id });
      let { href } = checkData;
      const options = getOptions(checkData);
      await CheckURLs(href, options, checkData, reportData)

    } catch (error) {
      console.log(error)
    }
  }, (check.interval) * 1000);

  return interval;
};

module.exports = pollingProcess;