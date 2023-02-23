const Check = require("../../models/check");
const Report = require("../../models/report");
const { pagination } = require("../../common/pagination");
const eventEmitter = require("../../config/eventEmitter");
const mongoose = require("mongoose");

exports.getAllChecks = async (req, res) => {
    const { page = 1, size = 3, tags } = req.query;
    const { skip, limit } = pagination(page, size);
    try {
        const checks = tags
            ? await Check.find({ user: req.user._id, tags: { $in: tags } })
                  .limit(limit)
                  .skip(skip)
            : await Check.find({ user: req.user._id }).limit(limit).skip(skip);
        res.json({ checks: checks, message: "success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
};

exports.getCheckById = async (req, res) => {
    const checkId = req.params.id;

    try {
        const check = await Check.findById(checkId);

        if (!check) return res.status(404).json({ msg: "Check not found" });

        if (check.user != req.user.id)
            return res.status(401).json({ msg: "User not authorized" });

        res.json({ check: check });
    } catch (err) {
        res.status(500).json({ msg: err });
    }
};

exports.postAddCheck = async (req, res) => {
    const user = req.user._id;
    const authentication = {
        username: req.user.email,
        password: req.user.password,
    };
    const interval = +req.body.interval * 1000;
    const {
        name,
        url,
        protocol,
        path,
        port,
        webhook,
        timeout,
        threshold,
        httpHeaders,
        assert,
        tags,
        ignoreSSL,
    } = req.body;

    const existingCheck = await Check.findOne({
        name: req.body.name,
        user: user,
    });

    if (existingCheck) return res.status(400).send("Check already exists");

    const check = new Check({
        user,
        name,
        url,
        protocol,
        path,
        port,
        webhook,
        timeout,
        interval,
        threshold,
        authentication,
        httpHeaders,
        assert,
        tags,
        ignoreSSL,
    });
    const report = new Report();
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const savedCheck = await check.save({ session });

        report.check = savedCheck._id;
        const savedReport = await report.save({ session });
        await session.commitTransaction();
        console.log("commitTransaction");

        await session.endSession();
        console.log("endSession");

        eventEmitter.emit("createdCheck", savedCheck);

        res.status(201).json({
            check: savedCheck,
            report: savedReport,
            message: "Check added",
        });
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        console.log("aborted");
        console.log("error at post check" + err);
        res.status(400).json({ message: "failed to add check" });
    }
};

exports.updateCheck = async (req, res) => {
    const userId = req.user._id;
    const checkId = req.params.id;
    const authentication = {
        username: req.user.email,
        password: req.user.password,
    };
    const {
        name,
        url,
        protocol,
        path,
        port,
        webhook,
        timeout,
        interval,
        threshold,
        httpHeaders,
        assert,
        tags,
        ignoreSSL,
    } = req.body;

    try {
        const check = await Check.findById(checkId);

        if (!check) return res.status(404).json({ message: "Check not found" });

        const isAuth = check.user.toString() === userId.toString();
        if (!isAuth) return res.status(401).json({ message: "Not authorized" });

        check.name = name || check.name;
        check.url = url || check.url;
        check.protocol = protocol || check.protocol;
        check.path = path || check.path;
        check.port = port || check.port;
        check.webhook = webhook || check.webhook;
        check.timeout = timeout || check.timeout;
        check.interval = interval * 1000 || check.interval;
        check.threshold = threshold || check.threshold;
        check.authentication = authentication || check.authentication;
        check.httpHeaders = httpHeaders || check.httpHeaders;
        check.assert = assert || check.assert;
        check.tags = tags || check.tags;
        check.ignoreSSL = ignoreSSL !== undefined ? ignoreSSL : check.ignoreSSL;

        const updatedCheck = await check.save();
        res.status(200).json({ updatedCheck: updatedCheck });
        eventEmitter.emit("updatedCheck", updatedCheck);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
};

exports.deleteCheckById = async (req, res) => {
    let checkId = req.params.id;
    const userId = req.user._id;

    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const check = await Check.findById(checkId);

        if (!check) return res.status(404).json({ message: "Check not found" });

        if (check.user.toString() !== userId.toString())
            return res.status(401).json({ message: "Not authorized" });

        checkId = check._id;
        await check.remove({ session });

        const report = await Report.findOne({ check: checkId });

        if (!report)
            return res
                .status(404)
                .json({ message: "Check's Report not found" });

        await report.remove({ session });

        await session.commitTransaction();
        await session.endSession();

        eventEmitter.emit("deletedCheck", checkId);

        res.json({ message: "Check removed" });
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        console.error(err);
        res.status(500).json({ message: err });
    }
};
