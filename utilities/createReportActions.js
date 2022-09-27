import { _axios } from "../configurations/axiosConfig.js";
import { Url } from "../modules/urls/model/urlsModel.js";
import { availability } from "../utilities/availability.js";
import { averageResponseTime } from "../utilities/averageResponseTime.js";
import { isAvailable } from "../utilities/isAvailable.js";
import { history } from "../utilities/pullsHistory.js";
import { totalDownPulls } from "../utilities/totalDownPulls.js";
import { totalDownTime } from "../utilities/totalDownTime.js";
import { totalUpPulls } from "../utilities/totalUpPulls.js";
import { totalUpTime } from "../utilities/totalUpTime.js";

let createReportActions = async () => {
  let urlsData = await Url.find({});
  const start = performance.now();
  for (const urlData of urlsData) {
    try {
      console.log("object");
      await averageResponseTime(urlData);
      await availability(urlData);
      await isAvailable(urlData);
      const response = await _axios.get(urlData.url);
      if (response.status >= 100 && response.status <= 399) {
        await totalUpPulls(urlData);
        await totalUpTime(urlData);
        await history(urlData, true);
      }
    } catch (error) {
      if (error.response) {
        await availability(urlData);
        await totalDownTime(urlData);
        await totalDownPulls(urlData);
        await history(urlData, false);
      }
      if (error.request) {
        await availability(urlData);
        await totalDownTime(urlData);
        await totalDownPulls(urlData);
        await history(urlData, false);
      }

      console.log("error", error.message);
    }
  }
  const duration = performance.now() - start;
  console.log(duration);
};

export { createReportActions };
