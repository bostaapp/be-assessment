var pushover = require("pushover-js").Pushover;

function PushoverNotfication(user, check) {
  const pushover = new Pushover({
    token: process.env.PUSHOVER_TOKEN,
    user: user.pushover,
  });
  pushover.send({
    message: `Check ${check.name} failed`,
    title: "Check failed",
  });
}

module.exports = {
  PushoverNotfication,
};
