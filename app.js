import "dotenv/config"; //no need for "dotenv.config()" since ES6 modules being used
import { cronJob } from "./configurations/cronJobConfig.js";
import { dbConnection } from "./configurations/dbConnectionConfig.js";
dbConnection();
// cronJob.start();
