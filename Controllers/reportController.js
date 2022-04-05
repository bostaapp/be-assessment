const { validationResult } = require("express-validator");

const Report = require("../Models/reportSchema");
const Check = require("../Models/checkSchema");

exports.getReport = (req, res, next) => {
  Report.findOne({ check: req.params.check })
    .then((report) => {
      res.status(200).json({ data: report });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getReportByTag = (req, res, next) => {
  Check.find({ tags: req.params.tag })
    .then((data) => {
      let reports = [];
      data.forEach((d) => {
        Report.findOne({ check: d._id })
          .then((report) => {
            reports.push(report);
          })
          .catch((error) => {
            next(error);
          });
      });
      res.status(200).json({ data: reports });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};
