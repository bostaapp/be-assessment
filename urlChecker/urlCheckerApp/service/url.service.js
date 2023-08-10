const Url = require('../models/url.model');
const axios = require('axios');
const { performance } = require('perf_hooks');
const reportService = require('./report.service');


exports.create = async (url) => {
    const newUrl = new Url({ ...url });
    const result = await newUrl.save();
    return result;
}

exports.findAll = async (user) => {
    const result = await Url.find({
        User: user.id
    });
    return result;
}

exports.findOne = async (id, user) => {
    const result = await Url.find({ _id: id, User: user.id });
    return result;

}

exports.update = async (id, url, user) => {
    const result = await Url.findOneAndUpdate({
        _id: id,
        User: user.id
    }, { ...url }, {
        new: true
    });
    return result;
}

exports.delete = async (id, user) => {
    const result = await Url.findOneAndDelete({
        _id: id,
        User: user.id
    });
    return result;
}

exports.getFirstUrl = async (userId) => {
    const result = await Url.findOne({ User: userId });
    return result;
}

exports.checkURL = async (url) => {
    const urlParams = url.formulateRequestData();
    let time = performance.now();
    await axios.get(urlParams.url, { headers: urlParams.headers })
        .then(async (response) => {
            const process = Math.ceil(performance.now() - time)
            url.history.push({
                status: 'up',
                responseTimeInMS: process
            })
            url = await url.save({ new: true });
            url = await url.getLatest();
        })
        .catch(async (error) => {
            const process = Math.ceil(performance.now() - time)
            url.history.push({
                status: 'down',
                responseTimeInMS: process
            })
            url = await url.save({ new: true });
            url = await url.getLatest();
        })
    return url
}

const constructReportObjectFromUrl = (url) => {
    return {
        name: url.name,
        url: url.url,
        averageResponseTime: url.getAverageResponseTime(),
        status: url.status,
        availability: url.getAvailabiltyPercentage(),
        outages: url.getTheNumberOfOutages(),
        uptime: url.totalUptimeInSeconds,
        downtime: url.totalDowntimeInSeconds,
        history: url.history
    }
}



exports.generateReport = async (urls ,  user) => {
    const reportObjectArr= urls.map(url => constructReportObjectFromUrl(url));
    const report = await reportService.generateReport(reportObjectArr, user)
  
    return report;
}