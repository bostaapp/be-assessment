const User = require("../../models/User");
const Check = require("../../models/Check");
const Report = require("../../models/Report");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { intiateSingleContinousCheck } = require("../Common/Util.js");
const { stopSingleContinousCheck } = require("../Common/Util.js");

const handleDeleteCheck = async (req, res) => {
  const { user_id } = req.user;
  const check = await Check.findOne({
    _id: req.params.checkId,
    user: user_id,
  });
  if (!check) return res.status(400).send("Check not found");
  try {
    stopSingleContinousCheck(check);
    const reports = await Report.deleteMany({
      check: check._id,
    });
    await check.remove();
    res.json({ message: "Check " + check.name + " deleted" });
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  handleDeleteCheck,
};
