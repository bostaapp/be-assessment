const axios = require("axios").default;
exports.startProcessConfig = async () => {
    axios.interceptors.request.use((config) => {
        config.headers["request-startTime"] = process.hrtime();
        return config;
    });

    axios.interceptors.response.use((response) => {
        const start = response.config.headers["request-startTime"];
        const end = process.hrtime(start);
        const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
        response.headers["duration"] = milliseconds;
        response.headers.status = response.status;
        return response;
    });
}