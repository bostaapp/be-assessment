import nodeCron from "node-cron";
import { creatReport } from "../shared/createReport.js";

const cronJob = nodeCron.schedule(
  "0 */50 * * * *",
  // "*/5 * * * * *",
  async function job() {
    console.log(new Date().toLocaleString());
    await creatReport();
  },
  { scheduled: false }
);

export { cronJob };
