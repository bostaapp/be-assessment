const { Report } = require("../models/Report");
const { User } = require("../models/User");
const { getUserID } = require("../middlewares/jwt-auth");

const getReports = async (req, res) => {
  res.setHeader("content-type", "application/json");

  if (!req.query.token)
    return res.status(400).json({ error: "Please add authentication Token" });

  try {
    let userId = getUserID(req.query.token);

    let user = await User.findById(userId);

    if (!req.query.tags) {
      let checks = user.checks;

      let reports = await Report.find({ checkId: { $in: checks } });

      return res.status(200).json(reports);
    } else {
      let arr_tags = req.query.tags.split(",");

      let arr = await User.findById(userId)
        .select({ checks: 1, _id: 0 })
        .populate({
          path: "checks",
          match: { tags: { $in: arr_tags } },
          select: "_id",
        });

      console.log(arr);

      let reports = await Report.find({ checkId: { $in: arr.checks } });

      return res.status(200).json(reports);
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

module.exports = { getReports };
