// Import necessary dependencies
import express from 'express'
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js'
import UrlCheckRoutes from './routes/MonitoringRoutes.js'
import ReportsRoutes from './routes/ReportsRoutes.js'
// const reportRoutes = require('./routes/reportRoutes')
// const errorHandler = require('./utils/errorHandler');

const app = express();

// Use the bodyParser middleware to parse incoming JSON data
app.use(bodyParser.json());

// Define routes for authentication and monitoring
app.use('/auth', authRoutes); // Route for authentication
app.use('/check', UrlCheckRoutes); // Route for monitoring
app.use('/report', ReportsRoutes)

// app.use('/report', reportRoutes);

// app.use(errorHandler);

export default app;