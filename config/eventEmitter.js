const EventEmitter = require("events");
const startInterval = require("./pollingRequestsUsingAxios");

const eventEmitter = new EventEmitter();

let checksIntervalsMap = new Map();

eventEmitter.on("serverRun", (checks) => {
    checks.forEach((check) => {
        const id = check._id.toString();
        const intervalObj = startInterval(check);
        checksIntervalsMap.set(id, intervalObj);
    });
});

eventEmitter.on("createdCheck", (check) => {
    const id = check._id.toString();
    const intervalObj = startInterval(check);
    checksIntervalsMap.set(id, intervalObj);
});

eventEmitter.on("updatedCheck", async (check) => {
    const id = check._id.toString();
    if (checksIntervalsMap.has(id)) {
        clearInterval(checksIntervalsMap.get(id));
        checksIntervalsMap.delete(id);

        const intervalObj = startInterval(check);
        checksIntervalsMap.set(id, intervalObj);
    }
});

eventEmitter.on("deletedCheck", async (checkId) => {
    const id = checkId.toString();
    if (checksIntervalsMap.has(id)) {
        clearInterval(checksIntervalsMap.get(id));
        checksIntervalsMap.delete(id);
    }
});

module.exports = eventEmitter;
