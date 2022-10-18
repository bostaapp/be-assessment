const express = require("express");
const { tryCatchWrapExpress } = require("../Utils/wrappers");
const { getReport } = require("../Controllers/reports");

const reportsRouter = express.Router();

const routerGetReport = tryCatchWrapExpress(async (req, res) => {
    if (!req.params.checkID)
        return res.status(400).json({ message: "Provide Check ID" });
    const response = await getReport(req.params.checkID, req.userID);
    if (response.userReport.length === 0)
        res.status(204).json({ message: "No Reports found for user" });
    return res.status(200).json(response);
});


reportsRouter.route("/:checkID").get(routerGetReport);

module.exports = reportsRouter;