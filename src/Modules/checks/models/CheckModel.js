const mongoose = require('mongoose');
const checkSchema = require('../Schema/CheckSchema');

const Check = mongoose.model('check', checkSchema);

module.exports = Check;