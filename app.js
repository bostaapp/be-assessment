const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const authRoutes = require("./routes/auth");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use()
app.get("/checks", (req, res) => {
    // TODO: implement get checks endpoint
    const { userId } = req.query;

    // Find all checks belonging to the specified user
    const userChecks = checks.filter((check) => check.userId === userId);

    res.json(userChecks);
});

app.post("/checks", (req, res) => {
    // TODO: implement create check endpoint
});

app.get("/checks/:id", (req, res) => {
    // TODO: implement get check endpoint
});

app.put("/checks/:id", (req, res) => {
    // TODO: implement update check endpoint
});

app.delete("/checks/:id", (req, res) => {
    // TODO: implement delete check endpoint
});

app.post("/notifications/email", (req, res) => {
    // TODO: implement email notification endpoint
});

app.post("/notifications/webhook", (req, res) => {
    // TODO: implement webhook notification endpoint
});

app.get("/reports", (req, res) => {
    // TODO: implement get reports endpoint
});

app.get("/reports/:tag", (req, res) => {
    // TODO: implement get reports by tag endpoint
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
