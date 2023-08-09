const Url = require('../models/url.model');
const axios = require('axios');
const { performance } = require('perf_hooks');

exports.create = async (url) => {
    const newUrl = new Url({ ...url });
    const result = await newUrl.save();
    return result;
}

exports.findAll = async () => {
    const result = await Url.find();
    return result;
}

exports.findOne = async (id) => {

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
            url = await url.save({new: true});
            url = await url.getLatest();
        })
        .catch(async (error) => {
            const process = Math.ceil(performance.now() - time)
            url.history.push({
                status: 'down',
                responseTimeInMS: process
            })
            url = await url.save({new: true});
            url = await url.getLatest();
        })
    return url
}
