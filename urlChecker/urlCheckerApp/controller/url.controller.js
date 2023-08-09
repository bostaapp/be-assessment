const urlService = require('../service/url.service.js')
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res, next) => {
    const user = req.user;
    const body = req.body;
    const data = { ...body, User: user.id };
    const result = await urlService.create(data);
    return res.json(result);

})

exports.update = catchAsync(async (req, res, next) => {
    const body = req.body;
    const id = req.params.id;
    const user = req.user;
    const result = await urlService.update(id, body, user);
    if (!result) {
        res.status(404)
        throw new Error("Not found");
    }
    return res.json(result);
})

exports.delete = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = req.user;
    const result = await urlService.delete(id, user);
    if (!result) {
        res.status(404)
        throw new Error("Not found");
    }
    return res.json({ message: "Deleted" });
})

exports.read = async (req, res, next) => {
    res.send("read");
}

exports.check = catchAsync(async (req, res, next) => {
    const url = await urlService.getFirstUrl(req.user.id);
    const urlResult = await urlService.checkURL(url)
    const averageTime = await urlResult.getAverageResponseTime()
    const history = urlResult.history.slice(-1);
    // urlResult.averageResponseTime = averageTime;
    // console.log("url", urlResult);
    return res.json({"checkResult" : history, averageResponseTime: averageTime })
})