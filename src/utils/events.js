const EventEmitter = require("events");
import { Report } from "../resources/report/report.model";
import mongoose from "mongoose";
import axios from "axios";
const eventEmitter = new EventEmitter();

export const job = eventEmitter.on(
  "startCheck",
  async ({ reportDoc, checkDoc }) => {
    const axiosInstance = axios.create({});
    axiosInstance.defaults.timeout = checkDoc.timeout;
    axiosInstance.interceptors.request.use((config) => {
      config.headers["request-startTime"] = process.hrtime();
      return config;
    });

    axiosInstance.interceptors.response.use((response) => {
      const start = response.config.headers["request-startTime"];
      const end = process.hrtime(start);
      const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
      response.headers["request-duration"] = milliseconds;
      return response;
    });
    setInterval(async () => {
      try {
        const poll = await axiosInstance.get(`${checkDoc.url}`);
        console.log(poll.headers["request-duration"]);
        if ((poll.statusCode = 200)) {
          await Report.findByIdAndUpdate(
            { _id: reportDoc._id },
            {
              status: poll.status,
              $inc: { uptime: 1 },
              responseTime: poll.headers["request-duration"],
            },
            { new: true }
          );
          console.log(report);
        } else {
          await Report.findByIdAndUpdate(
            { _id: reportDoc._id },
            {
              status: poll.status,
              $inc: { downtime: 1 },
              responseTime: poll.headers["request-duration"],
            },
            { new: true }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }, checkDoc.interval);
  }
);
