import "dotenv/config"; //no need for "dotenv.config()" since ES6 modules being used
import { cronJob } from "./configurations/cronJobConfig.js";
import { dbConnection } from "./configurations/dbConnectionConfig.js";
dbConnection();
// cronJob.start();
/////////////////////////////////////////////////////////////////
import { _axios } from "./configurations/axiosConfig.js";
import urlExist from "url-exist";
import { Url } from "./modules/urls/model/urlsModel.js";
import { toSeconds } from "./shared/milliSeconds.js";

const averageResponseTime = async (urlData) => {
  try {
    const status = await urlExist(urlData.url);
    const response = await _axios.get(urlData.url);
    const responseTime = response.headers["request-duration"];
    if (status) {
      if (!urlData.averageResponseTime) {
        await Url.findByIdAndUpdate(urlData._id, {
          averageResponseTime: responseTime,
        });
      }
      if (urlData.averageResponseTime) {
        await Url.findByIdAndUpdate(urlData._id, {
          averageResponseTime: Math.round(
            (urlData.averageResponseTime + responseTime) / 2
          ),
        });
      }
    }
  } catch (error) {}
};

const isAvailable = async (urlData) => {
  try {
    const status = await urlExist(urlData.url);
    await Url.findByIdAndUpdate(urlData._id, {
      status,
    });
  } catch (error) {}
};

const totalDownUpTime = async (urlData) => {
  try {
    const status = await urlExist(urlData.url);
    if (status) {
      console.log(urlData.totaleUpTime);
      await Url.findByIdAndUpdate(urlData._id, {
        totaleUpTime: urlData.totaleUpTime + toSeconds(10),
      });
    }
    if (!status) {
      console.log(urlData.totaleDownTime);
      await Url.findByIdAndUpdate(urlData._id, {
        totaleDownTime: urlData.totaleDownTime + toSeconds(10),
      });
    }
  } catch (error) {}
};

const totalDownUpPulls = async (urlData) => {
  const status = await urlExist(urlData.url);
  if (status) {
    await Url.findByIdAndUpdate(urlData._id, {
      totalUpPulls: urlData.totalUpPulls + 1,
    });
  }
  if (!status) {
    await Url.findByIdAndUpdate(urlData._id, {
      totalDownPulls: urlData.totalDownPulls + 1,
    });
  }
};
const history = async (urlData) => {
  const status = await urlExist(urlData.url);
  await Url.findByIdAndUpdate(urlData._id, {
    $push: { history: { pullTime: Date.now(), available: status } },
  });
};

const availability = async (urlData) => {
  await Url.findByIdAndUpdate(urlData._id, {
    availability: Math.round(
      (urlData.totaleUpTime / (urlData.totaleUpTime + urlData.totaleDownTime)) *
        100
    ),
  });
};

const creatReport = async () => {
  try {
    let urlsData = await Url.find({});
    for (const urlData of urlsData) {
      console.log(urlData.url);
      averageResponseTime(urlData);
      isAvailable(urlData);
      totalDownUpTime(urlData);
      totalDownUpPulls(urlData);
      history(urlData);
      availability(urlData);
    }
  } catch (error) {
    console.log("error");
  }
};

creatReport();
