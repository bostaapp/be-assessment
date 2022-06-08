import { job } from "./configurations/cronJobConfig.js";
import "dotenv/config"; //no need for "dotenv.config()" since ES6 modules being used
/////////////////////////////////
import express from "express";
// import { cronJob } from "./configurations/cronJobConfig.js";
import { dbConnection } from "./configurations/dbConnectionConfig.js";
import { urlRouter } from "./modules/urls/routes/urlsRouter.js";
import { userRouter } from "./modules/users/routes/usersRoutes.js";
dbConnection();
const app = express();
app.use(express.json());

app.use(userRouter);
app.use(urlRouter);
app.listen(3000);
job.start();

///prevent node app from crashing
process.on("uncaughtException", function (err) {});

// cronJob.start();
