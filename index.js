require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const userRouter = require("./Routers/userRouter");
const authRouter = require("./Routers/authRouter");
const checkRouter = require("./Routers/checkRouter");
const reportRouter = require("./Routers/reportRouter");
const { authenticateToken } = require("./Controllers/authController");

//Create express server
const server = express();

//Connecting to local mongo DB and running the server
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    console.log("DB connected!");
    // listen on port Number
    server.listen(process.env.PORT, () => {
      console.log(`Listenining on port ${process.env.port}!`);
    });
  })
  .catch((err) => {
    console.log("DB Problem", err);
  });

//Middlewares
server.use(cors());

//Logger
server.use(morgan("dev"));
server.use(body_parser.urlencoded({ extended: false }));
server.use(body_parser.json());

//Routers
//Authentication
server.use("/auth", authRouter);
server.use("/users", userRouter);
// server.use(authenticateToken);

server.use("/checks", checkRouter);
server.use("/reports", reportRouter);

//Error middleware
server.use((error, res) => {
  let status = error.status || 500;
  res.status(status).json({ Error: error + "" });
});
