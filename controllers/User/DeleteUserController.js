User = require("../../models/User");
const Check = require("../../models/Check");
const { stopSingleContinousCheck } = require("../Common/Util.js");
const Report = require("../../models/Report");

bcrypt = require("bcryptjs");
const handleDeleteUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(400).send("User not found");
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send("Invalid Credentials");
  const checks = await Check.find({
    user: user._id,
  });
  if (!checks) return res.status(400).send("Checks not found");
  for (let i = 0; i < checks.length; i++) {
    stopSingleContinousCheck(checks[i]);
  }

  for (let i = 0; i < checks.length; i++) {
    await Report.deleteMany({
      check: checks[i]._id,
    });
    await checks[i].remove();
  }
  try {
    await user.remove();
    res.json({ User: user, message: "User removed" });
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  handleDeleteUser,
};
