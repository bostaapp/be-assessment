const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./utils/errorHandler');
const authRoutes = require('./routes/authRoutes');
const urlCheckRoutes = require('./routes/urlCheckRoutes');
const reportRoutes = require('./routes/reportRoutes')
const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/urlchecks', urlCheckRoutes);
app.use('/report', reportRoutes);

app.use(errorHandler);

module.exports = app;

