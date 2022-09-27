import axios from "axios";
import https from "https";

const _axios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    timeout: 5 * 1000,
  }),
});

_axios.interceptors.request.use((config) => {
  config.headers["request-startTime"] = process.hrtime();
  return config;
});

_axios.interceptors.response.use((response) => {
  const start = response.config.headers["request-startTime"];
  const end = process.hrtime(start);
  const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
  response.headers["request-duration"] = milliseconds;
  return response;
});

export { _axios };
