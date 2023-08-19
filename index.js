// Import necessary dependencies
import mongoose from "mongoose"; // MongoDB object modeling library
import app from "./src/app.js"; // Express.js application
import { runMonitorScheduler } from "./src/services/Scheduler.js";
import cron from 'node-cron'; // Import the 'cron' library
import dotenv from 'dotenv'; // Load environment variables from .env file
dotenv.config();
const port = process.env.SERVER_PORT;


//initialize CronJob
const cronJob = cron.schedule("*/10 * * * *", runMonitorScheduler);

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_DB).then(
    console.log('connected')
).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// Start the Express.js server
app.listen(port, () => {
    console.log(`Server running at  http://localhost:${port}/`);
    cronJob.start()
}); 