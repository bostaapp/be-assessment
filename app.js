require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//const mongooseCon = require("./config/mongoose");

const authRoutes = require("./routes/auth");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use(authRoutes);
/* 
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
}); */

// connect to mongoose and Start the server
const uri = process.env.MONGOOSE_URI;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.set("strictQuery", false);

mongoose
    .connect(uri, options)
    .then((result) => {
        console.log("Connected");
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
