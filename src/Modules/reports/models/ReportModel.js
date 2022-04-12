const mongoose  = require("mongoose");
const reportSchema = require("../Schema/ReportSchema");

const Report = mongoose.model('report', reportSchema);

module.exports = Report;