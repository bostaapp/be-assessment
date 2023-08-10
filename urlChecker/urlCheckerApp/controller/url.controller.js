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

exports.read = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = req.user;
    const result = await urlService.findOne(id, user);
    if (!result) {
        res.status(404)
        throw new Error("Not found");
    }
    return res.json(result);
})

exports.check = catchAsync(async (req, res, next) => {
    const url = await urlService.getFirstUrl(req.user.id);
    const urlResult = await urlService.checkURL(url)
    const averageTime = await urlResult.getAverageResponseTime()
    const history = urlResult.history.slice(-1);
    
    return res.json({"checkResult" : history, averageResponseTime: averageTime })
})

exports.report = async (req, res, next) => {
    const user =  req.user;
    const result = await urlService.findAll(user);
    const report = await urlService.generateReport(result, user);
    res.set("Content-disposition", `attachment; filename="${report.fileName}"`);
    report.readStream.pipe(res);
    
    // return res.json({ message: "Report generated" });
}