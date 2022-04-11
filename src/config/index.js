import { merge } from "lodash";
const env = process.env.NODE_ENV || "development";

const baseConfig = {
  env,
  isDev: env === "development",
  isTest: env === "testing",
  port: 3000,
  host: "smtp.gmail.com",
  user: "elhalwaguiahmedmohamed@gmail.com",
  pass: "dbigkxvteiuugboh",
  baseurl: "http://localhost:3000/api",
  service: "gmail",
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: "1d",
  },
};

let envConfig = {};

switch (env) {
  case "dev":
  case "development":
    envConfig = require("./dev").config;
    break;
  case "test":
  case "testing":
    envConfig = require("./testing").config;
    break;
  default:
    envConfig = require("./dev").config;
}

export default merge(baseConfig, envConfig);
