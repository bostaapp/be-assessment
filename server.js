require("dotenv").config();
const usersRouter = require("./Routes/users");
const urlChecksRouter = require("./Routes/urlChecks");
const reportsRouter = require("./Routes/reports");
const eventEmitter = require("./Controllers/events");

const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/config.db");
const errorHandler = require("./Middlewares/errorHandler");
const authorize = require("./Middlewares/authorize");

const PORT = process.env.port || 8000;
const app = express();


// Routes & Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/checks/", authorize, urlChecksRouter);
app.use("/api/v1/reports/", authorize, reportsRouter);

app.use(errorHandler);
// Server
app.get("/", (req, res) => {
    res.json({ message: "Hello Bosta" });
});

(async () => await connectDB())();
app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}...`);
});

eventEmitter.emit("Server Start");