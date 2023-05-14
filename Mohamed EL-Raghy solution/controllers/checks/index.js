const create = require('./createCheck');
const allChecks = require('./getChecks');
const getCheck = require('./getCheck');
const editCheck = require('./edit');
const deleteCheck = require('./delete');

module.exports = {
  create,
  allChecks,
  getCheck,
  editCheck,
  deleteCheck
}