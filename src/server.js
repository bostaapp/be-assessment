import express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { connect } from "./utils/db";
import config from "./config";
import checkRouter from "./resources/check/check.router";
import userRouter from "./resources/user/user.router";
import reportRouter from "./resources/report/report.router";
import { protect } from "./utils/auth";
export const app = express();

app.disable("x-powered-by");

//middlewares
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true })); //to post nested objects
app.use(morgan("dev"));

//routes
app.use("/api/user", userRouter);
app.use("/api", protect);
app.use("/api/report", reportRouter);
app.use("/api/check", checkRouter);

export const start = async () => {
  try {
    await connect();
    app.listen(config.port, () => {
      console.log(`listening on port ${config.port}`);
    });
  } catch (e) {
    console.error(e);
  }
};
