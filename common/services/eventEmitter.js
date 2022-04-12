const EventEmitter = require("events");
const pollingProcess = require("../utilities/pollingProcess");
const sendEmail = require("./sendEmail");

const eventEmitter = new EventEmitter();

let intervals = [];

// eventEmitter.on("serverDown", (user) => {
//   sendEmail([user.email],
//     `Website Alert`,
//     `<h1> unfortunately, your website geos down</h1>`)
// });

eventEmitter.on("createCheck", (check) => {
  let interval = pollingProcess(check);
  intervals.push({
    checkId: check._id,
    checkOwner: check.owner,
    interval: interval,
  });
});

eventEmitter.on("updateCheck", async (check) => {
  let checkInterval = intervals.filter((e) => e.checkId == check._id);
  clearInterval(checkInterval.interval);
  let interval = pollingProcess(check);
  intervals.map((e) => e.checkId == check._id ? e.interval = interval : e)
});

eventEmitter.on("deleteCheck", async (check) => {
  let checkInterval = intervals.filter((e) => e.checkId == check._id);
  clearInterval(checkInterval.interval);
});

module.exports = eventEmitter;