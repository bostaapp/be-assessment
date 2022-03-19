import { _axios } from "../configurations/axiosConfig.js";
// const urls = ["https://googltrdtdye.com", "https://yahoo.com", "https://live.com"];
const urls = ["https://google.com"];

const reportAction = (url) => {
  _axios
    .get(url)
    .then((response) => {
      console.log("Request Duration: " + response.headers["request-duration"]);
      console.log("Response Status: " + response.status);
    })
    .catch((error) => {
      console.error("Site is down now");
    });
};

let createReport = () => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    reportAction(url);
  }
};
export { createReport };
