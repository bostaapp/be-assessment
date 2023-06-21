import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js"
import reportRouter from "./routes/reportRouter.js"
import urlChecks from "./routes/urlChecksRoutes.js"
import mongoose from "mongoose";
import config from "./config.js"
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(urlChecks);
app.use(reportRouter)
app.get("/", (req, res) => res.status(200).send("hello world"));

mongoose.connect(config.databaseUrl)
    .then(() => {
        // console.log('Connected!');

    });

export default app;