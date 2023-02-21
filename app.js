const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/User");
const authRoute = require("./routes/Auth");
const checkRoute = require("./routes/Check");
const reportRoute = require("./routes/Report");

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/checks", checkRoute);
app.use("/api/reports", reportRoute);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server is Running on port " + process.env.SERVER_PORT);
});

let db_url = "mongodb://" + process.env.DB_HOST + "/" + process.env.DB_NAME;

console.log("db url is " + db_url);

const connect = async () => {
  const db = await mongoose.connect(db_url, {
    serverSelectionTimeoutMS: 1 * 60 * 1000, //  try to reconnect for 1 minutes then timeout
  });
};

connect();
