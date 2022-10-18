const express = require("express");
const { tryCatchWrapExpress } = require("../Utils/wrappers");
const checksController = require("../Controllers/urlChecks");

const urlChecksRouter = express.Router();


const routerCreateCheck = tryCatchWrapExpress(async (req, res) => {
    const response = await checksController.createCheck(req.body, req.userID);
    if (!response)
        return res.status(500).json({ message: "Internal Error" });
    return res.status(200).json(response);
});

const routerGetChecks = tryCatchWrapExpress(async (req, res) => {
    const response = await checksController.getChecks(req.userID);
    if (response.userChecks.length === 0)
        return res.status(204).json({ message: "No Checks Found" });
    return res.status(200).json(response);
});

const routerGetCheckByName = tryCatchWrapExpress(async (req, res) => {
    if (!req.params.checkName)
        return res.status(400).json({ message: "Provide Check Name" });
    const response = await checksController.getCheckByName(req.userID, req.params.checkName);
    return res.status(200).json(response);
});

const routerGetCheckByTag = tryCatchWrapExpress(async (req, res) => {
    if (!req.body.tags)
        return res.status(400).json({ message: "Provide Tags" });
    const response = await checksController.getCheckByTag(req.userID, req.body.tags);
    return res.status(200).json(response);
});

const routerUpdateCheck = tryCatchWrapExpress(async (req, res) => {
    if (req.body.length === 0)
        return res.status(400).json({ message: "Empty Request" });

    if (!req.params.checkID)
        return res.status(400).json({ message: "Provide Check Id" });
    const response = await checksController.updateCheck(req.userID, req.params.checkID, req.body);
    return res.status(200).json(response);
});

const routerDeleteCheck = tryCatchWrapExpress(async (req, res) => {
    if (!req.params.checkID)
        return res.status(400).json({ message: "Provide Check Id" });
    const response = await checksController.deleteCheck(req.userID, req.params.checkID);
    return res.status(200).json(response);
});


urlChecksRouter.route("/:checkName").get(routerGetCheckByName);

urlChecksRouter.route("/:checkID")
    .patch(routerUpdateCheck)
    .delete(routerDeleteCheck);
urlChecksRouter.route("/find/tag").get(routerGetCheckByTag);
urlChecksRouter.route("/").post(routerCreateCheck).get(routerGetChecks);

module.exports = urlChecksRouter;