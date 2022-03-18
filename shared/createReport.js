import { _axios } from "../configurations/axiosConfig.js";
const urls = ["https://google.com", "https://yahoo.com", "https://live.com"];

let createReport = () => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    _axios
      .get(url)
      .then((response) => {
        console.log(response.headers["request-duration"]);
        console.log(response.status);
      })
      .catch((error) => {
        console.error("error", { error });
      });
  }
};

export { createReport };
