const mongoose = require("mongoose");
const joi = require("joi");

//model schema in the schemas folder
const schema = require("../schemas/Report");

module.exports = {
  Report: mongoose.model("Report", schema),
};
