const Check = require("../models/check");

exports.getAllChecks = async () => {
    const checks = await Check.find();

    return checks;
};