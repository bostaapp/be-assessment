import "dotenv/config"; //no need for "dotenv.config()" since ES6 modules being used
import { cronJob } from "./configurations/cronJobConfig.js";
import { dbConnection } from "./configurations/dbConnectionConfig.js";
dbConnection();
cronJob.start();
/////////////////////////////////
import express from "express";
import { userRouter } from "./modules/users/routes/usersRoutes.js";
import { urlRouter } from "./modules/urls/routes/urlsRouter.js";
const app = express();
app.use(express.json());

app.use(userRouter);
app.use(urlRouter);
app.listen(3000);

///prevent node app from crashing
process.on("uncaughtException", function (err) {
  console.log({ message: "error", err: err._message });
});
