const Url = require('../model/url.model');
const axios = require('axios');

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

exports.update = async (id, url) => {
    const result = await Url.findOneAndUpdate({
        _id: id
    }, { ...url }, {
        new: true
    });
    return result;
}

exports.delete = async (id) => {
    const result = await Url.findOneAndDelete({
        _id: id
    });
    return result;
}

