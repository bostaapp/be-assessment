const EventEmitter = require("events");
const sendMail = require("./nodeMailer");
const beginJob = require("./pollingRequests");

const eventEmitter = new EventEmitter();

let checksintervals = [];

eventEmitter.on("userCreated", (user) => {
  sendMail(user);
});

eventEmitter.on("checkCreated", (check) => {
  let x = beginJob(check);
  checksintervals.push({
    check: check._id,
    interval: x,
  });
});

eventEmitter.on("checkUpdated", async (check) => {
  let checkInterval = await checksintervals.filter(
    (ch) => ch.check == check._id
  )[0];
  clearInterval(checkInterval.interval);
  let x = beginJob(check);
  checksintervals.forEach((ch) => {
    if (ch.check == check._id) ch.interval = x;
  });
});

module.exports = eventEmitter;
