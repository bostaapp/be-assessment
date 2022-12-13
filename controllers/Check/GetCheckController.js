const User = require("../../models/User");
const Check = require("../../models/Check");
const Report = require("../../models/Report");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleGetCheckById = async (req, res) => {
  const { user_id } = req.user;
  const check = await Check.findOne({
    _id: req.params.checkId,
    user: user_id,
  });
  if (!check) return res.status(400).send("Check not found");
  res.json(check);
};
const handleGetChecksByTag = async (req, res) => {
  const { user_id } = req.user;
  result = [];
  const checks = await Check.find({
    user: user_id,
  });
  for (let i = 0; i < checks.length; i++) {
    if (checks[i].tags.includes(req.params.tag)) {
      result.push(checks[i]);
    }
  }
  if (!checks) return res.status(400).send("Check not found");
  res.json(result);
};
const handleGetAllChecks = async (req, res) => {
  const { user_id } = req.user;
  const checks = await Check.find({
    user: user_id,
  });
  if (!checks) return res.status(400).send("no checks found");
  return res.json(checks);
};

module.exports = {
  handleGetCheckById,
  handleGetChecksByTag,
  handleGetAllChecks,
};
