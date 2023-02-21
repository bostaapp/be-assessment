const {
  Check,
  CheckValidationSchema,
  updateValidationSchema,
} = require("../models/Check");

const { getUserID } = require("../middlewares/jwt-auth");
const { User } = require("../models/User");
const cronJob = require("../services/cronJob");

// get check by tags
// if the user didnt give any tag as a query param then it gets all the checks
const getChecks = async (req, res) => {
  res.setHeader("content-type", "application/json");

  if (!req.query.token)
    return res.status(400).json({ error: "Please add authentication Token" });

  try {
    let userId = getUserID(req.query.token);

    // if there is no tags return all the checks
    if (!req.query.tags) {
      let checks = await User.findById(userId)
        .select({ checks: 1, _id: 0 })
        .populate({
          path: "checks",
          select: "-_id",
        });
      return res.status(200).json(checks);
    } else {
      // if there is a tags gather them in an array and return them
      let arr_tags = req.query.tags.split(",");

      let arrOfChecks = await User.findById(userId)
        .select({ checks: 1, _id: 0 })
        .populate({
          path: "checks",
          match: { tags: { $in: arr_tags } },
          select: "-_id",
        });

      return res.status(200).json(arrOfChecks);
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

const createCheck = async (req, res) => {
  res.setHeader("content-type", "application/json");

  const { error, value } = CheckValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    let errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json(errorMessages);
  }

  try {
    // insert check into the database then update user table to push that check id in the user table
    let check = new Check(value);
    let userId = getUserID(req.body.authToken);
    let user = await User.findById(userId);

    await check.save();
    user.checks.push(check.id);
    await user.save();

    let job = new cronJob();
    await job.createReportJob(check, user);

    return res.status(200).json(check);
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

const updateCheck = async (req, res) => {
  res.setHeader("content-type", "application/json");

  if (!req.query.token)
    return res.status(400).json({ error: "Please add authentication Token" });

  if (!req.query.checkName)
    return res
      .status(400)
      .json({ error: "You must add check name in order to update this check" });

  const { error, value } = updateValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  try {
    let userId = getUserID(req.query.token);

    let arr = await User.findById(userId)
      .select({ checks: 1, _id: 0 })
      .populate({
        path: "checks",
        match: { name: req.query.checkName },
      });

    let checks = arr.checks;

    if (checks.length == 0)
      return res.status(400).json("no check with that name");

    await checks[0].update(value);

    return res.status(200).json({ message: "updated successfully" });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

const deleteCheck = async (req, res) => {
  res.setHeader("content-type", "application/json");

  if (!req.query.token)
    return res.status(400).json({ error: "Please add authentication Token" });

  if (!req.query.checkName)
    return res
      .status(400)
      .json({ error: "You must add check name in order to update this check" });

  const { error, value } = updateValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  try {
    let userId = getUserID(req.query.token);

    let arr = await User.findById(userId)
      .select({ checks: 1, _id: 0 })
      .populate({
        path: "checks",
        match: { name: req.query.checkName },
      });

    let checks = arr.checks;

    if (checks.length == 0)
      return res.status(400).json("no check with that name");

    checks.forEach((check) => check.delete());

    return res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

module.exports = { getChecks, createCheck, updateCheck, deleteCheck };
