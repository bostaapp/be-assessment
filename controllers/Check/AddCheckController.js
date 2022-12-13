const Check = require("../../models/Check");
const { intiateSingleContinousCheck } = require("../Common/Util.js");

const handleAddCheck = async (req, res) => {
  const { user_id } = req.user;
  const existingCheck = await Check.findOne({
    name: req.body.name,
    user: user_id,
  });
  if (existingCheck) return res.status(400).send("Check already exists");
  const check = new Check({
    user: user_id,
    name: req.body.name,
    url: req.body.url,
    protocol: req.body.protocol,
    path: req.body.path,
    port: req.body.port,
    webhook: req.body.webhook,
    timeout: req.body.timeout,
    interval: req.body.interval * 1000,
    threshold: req.body.threshold,
    authentication: req.body.authentication,
    httpHeaders: req.body.httpHeaders,
    assert: req.body.assert,
    tags: req.body.tags,
    ignoreSSL: req.body.ignoreSSL,
  });
  try {
    await check.save();
    res.json({ Check: check.name, message: "Check added" });
    intiateSingleContinousCheck(check);
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  handleAddCheck,
};
