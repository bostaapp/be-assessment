require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongooseConnection = require("./config/mongoose");

//const mongooseCon = require("./config/mongoose");

const { getAllChecks } = require("./common/getAllChecks");
const eventEmitter  = require('./config/eventEmitter');

const authRoutes = require("./routes/auth");
const checkRoutes = require("./routes/check");
const reportRoutes = require("./routes/report");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use(authRoutes);
app.use(checkRoutes);
app.use(reportRoutes);
/* 
app.post("/notifications/email", (req, res) => {
    // TODO: implement email notification endpoint
});

app.post("/notifications/webhook", (req, res) => {
    // TODO: implement webhook notification endpoint
});*/

mongooseConnection.on(
    "error",
    console.error.bind(console, "Connection error:")
);
mongooseConnection.once("open", () => {
    console.log("Connected to database");
    app.listen(port, async () => {
        console.log(`Server listening on port ${port}`);
        const checks = await getAllChecks();
        eventEmitter.emit("serverRun", checks);
    });
});
