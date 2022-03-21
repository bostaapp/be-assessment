import "dotenv/config"; //no need for "dotenv.config()" since ES6 modules being used
import { cronJob } from "./configurations/cronJobConfig.js";
import { dbConnection } from "./configurations/dbConnectionConfig.js";
dbConnection();
cronJob.start();
/////////////////////////////////
import express from "express";
const app = express();
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3000);
