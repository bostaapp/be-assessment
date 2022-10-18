const EventEmitter = require("events");
const pollController = require("./polling");
const checkModel = require("../Models/urlCheck");
const eventEmitter = new EventEmitter();

// Listeners
eventEmitter.on("Check Created", (check) => {
    const handle = setInterval(() => pollController.testURL(check), check.interval);
    checkModel.Check.findByIdAndUpdate(check._id, { active: true, handle });
});

eventEmitter.on("Check Update", (check) => {
    clearInterval(check.handle);
    const handle = setInterval(() => pollController.testURL(check), check.interval);
    checkModel.Check.findByIdAndUpdate(check._id, { active: true, handle });
});

eventEmitter.on("Check Deleted", (handle) => {
    clearInterval(handle);
});

eventEmitter.on("Server Start", () => {
    checkModel.Check.find({}).then((checks) => {
        checks.forEach((check) => {
            if (check.active) {
                const handle = setInterval(() => pollController.testURL(check), check.interval);
                checkModel.Check.findByIdAndUpdate(check._id, { handle });
            }
        });
    });
});

module.exports = eventEmitter;