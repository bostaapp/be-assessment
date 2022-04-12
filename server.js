require("dotenv").config()
const express = require('express')

const userRoutes = require('./src/Modules/users/routes/userRoutes')
const checkRoutes = require('./src/Modules/checks/routes/checkRoutes')
const reportRoutes = require('./src/Modules/reports/routes/reportRoutes')
const app = express()



app.use(express.json())

app.use(userRoutes, checkRoutes, reportRoutes)



app.get('/', (req, res) => res.send('Hello World!'))


module.exports = app


