import { CronJob } from "cron";

import { createReportActions } from "../utilities/createReportActions.js";

const job = new CronJob("*/10 * * * * *", async function () {
  const time = new Date();
  console.log("AT", time);
  await createReportActions();
});

export { job };
