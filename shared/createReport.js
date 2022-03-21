import { _axios } from "../configurations/axiosConfig.js";
import { Url } from "../modules/urls/model/urlsModel.js";
// const urls = ["https://googltrdtdye.com", "https://yahoo.com", "https://live.com"];
const test = new Url({ url: "https://google.com" });
// test.save().then(() => console.log("meow"));

const averageResponseTime = async () => {
  try {
    const found = await Url.findById("6236471063f65822badc8a3d");
    console.log(found);
    if (!found.averageResponseTime) {
      console.log("ddffffffffffffffff");
      await Url.findByIdAndUpdate(
        { _id: "6236471063f65822badc8a3d" },
        { averageResponseTime: responseTime }
      );
    }
    if (found.averageResponseTime) {
      await Url.findByIdAndUpdate(
        { _id: "6236471063f65822badc8a3d" },
        { averageResponseTime: (responseTime + found.averageResponseTime) / 2 }
      );
    }
  } catch (error) {}
};

const reportAction = async (url) => {
  try {
    const response = await _axios.get(url);
    const responseTime = response.headers["request-duration"];
    averageResponseTime();
    console.log("Request Duration: " + responseTime);
    console.log("Response Status: " + response.status);
  } catch (error) {
    console.error("Site is down now");
  }
};

let createReport = async () => {
  const urls = await Url.find({});
  //   console.log(urls);
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    reportAction(url.url);
  }
};
export { createReport };
