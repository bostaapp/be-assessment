const axios = require("axios").default;

//append start time with every request
axios.interceptors.request.use((config) => {
  config.headers["startTime"] = Date.now();
  return config;
});

//append duration with every response
axios.interceptors.response.use((response) => {
  const start = response.config.headers["startTime"];
  const duration = Date.now() - start;
  response.headers["duration"] = duration;
  return response;
});

module.exports = axios;
