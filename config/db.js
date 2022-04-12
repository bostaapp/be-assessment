const mongoose = require("mongoose");

const dbConnection = () =>
  mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then((result) => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log(err);
    });

module.exports = dbConnection;
