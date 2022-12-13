require("dotenv").config();
const express = require("express");
const { handleAddCheck } = require("./controllers/Check/AddCheckController");
const {
  handleDeleteCheck,
} = require("./controllers/Check/DeleteCheckController");
const {
  handleGetAllChecks,
  handleGetCheckById,
  handleGetChecksByTag,
} = require("./controllers/Check/GetCheckController");
const {
  handleUpdateCheck,
} = require("./controllers/Check/UpdateCheckController");
const { intiateContinuousCheck } = require("./controllers/Common/Util");
const {
  handleGetReportsByTag,
  handleGetReportsByCheckId,
} = require("./controllers/Report/GetReportsController");
const { handleDeleteUser } = require("./controllers/User/DeleteUserController");
const { handleSignIn } = require("./controllers/User/signInController");
const { handleNewUser } = require("./controllers/User/signUpController");
const {
  handleVerfication,
} = require("./controllers/User/verficationController");

const app = express();
const port = 3000;
const auth = require("./middleware/auth");
const Verfication = require("./models/Verfication");
app.use(express.json());

const mongoose = require("./config/mongo").mongoose;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//user routes
app.delete("/deleteUser", handleDeleteUser);
app.post("/signUp", handleNewUser);
app.get("/verfy/:uniqueString", handleVerfication);
app.post("/signIn", handleSignIn);

//checks routes
app.post("/addCheck", auth, handleAddCheck);
app.get("/getAllChecks", auth, handleGetAllChecks);
app.get("/getCheck/:checkId", auth, handleGetCheckById);
app.get("/getChecks/:tag", auth, handleGetChecksByTag);
app.delete("/deleteCheck/:checkId", auth, handleDeleteCheck);
app.put("/updateCheck/:checkId", auth, handleUpdateCheck);

//reports routes
app.get("/getCheckReport/:checkId", auth, handleGetReportsByCheckId);
app.get("/getCheckReports/:tag", auth, handleGetReportsByTag);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

intiateContinuousCheck();
console.log("Continuous Check Started :D");

module.exports = app;
