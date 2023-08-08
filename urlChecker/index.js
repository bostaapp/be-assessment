require("dotenv").config();
// set port, listen for requests
const express = require('express')
const app = express()
const User = require('./urlCheckerApp/models/user.model.js');
const dbConfig = require('./urlCheckerApp/config/db.config.js');
const mongoose = require('mongoose');
mongoose.connect(dbConfig.url).catch(err => {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
})

app.use(express.json())

const findUser = async () => {


  // const testUser = new User({
  //   email: 'omar@gmail.com',
  //   password: 'Password123'
  // });

  // // // save the user to database
  // const savedUser = await testUser.save()
  const userCreated = await User.findOne({ email: 'omar@gmail.com' });
  // test a matching password
  userCreated.comparePassword('Password123',  (err, isMatch) => {
    if (err) throw err;
    console.log('Password123:', isMatch); // -&gt; Password123: true
  });

  // test a failing password
  userCreated.comparePassword('123Password',  (err, isMatch) => {
    if (err) throw err;
    console.log('123Password:', isMatch); // -&gt; 123Password: false
  });
}


const userRoutes = require('./urlCheckerApp/routes/user.routes.js');
app.use('/api/user', userRoutes);

// const urlRoutes = require('./urlCheckerApp/routes/url.routes.js');
// app.use('/api/url', urlRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use((err, req, res, next) => {
  res.status(500).send({
    "message": err.message || "Some error occurred"
  });
});

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});