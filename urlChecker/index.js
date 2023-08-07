require("dotenv").config();
// set port, listen for requests
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World! aasdsasdsssosso')
})

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});