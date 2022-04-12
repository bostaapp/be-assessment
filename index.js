require("dotenv").config()
const dbConnection = require('./config/db')

const app = require('./server')

const port = process.env.PORT || 3000;


dbConnection()


app.listen(port, () => console.log(`Example app listening on port ${port}!`));


