require("dotenv").config();
const cron = require('node-cron');
// set port, listen for requests
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const dbConfig = require('./urlCheckerApp/config/db.config.js');
const mongoose = require('mongoose');
mongoose.connect(dbConfig.url).catch(err => {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
})

app.use(cookieParser())
app.use(express.json())

const userRoutes = require('./urlCheckerApp/routes/user.routes.js');
app.use('/api/user', userRoutes);

const urlRoutes = require('./urlCheckerApp/routes/url.routes.js');
app.use('/api/url', urlRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use((err, req, res, next) => {
  res.status(404).send({
    "message": err.message || "Some error occurred"
  });
});

cron.schedule('* * * * *', async () => {
  console.log('running a task every 2 minutes')
  const urlService = require('./urlCheckerApp/service/url.service.js');
  await urlService.cronJob();
});
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});