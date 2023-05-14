const user = require('../routes/user');
const check = require('../routes/check');
const report = require('../routes/report');

module.exports = app => {
  app.use('/api/users', user);
  app.use('/api/checks', check);
  app.use('/api/report', report);
}