const { NotfyByMail } = require("./NotficationOptions/MailNotfication");
const {
  WebhookNotfication,
} = require("./NotficationOptions/WebhookNotfication");
const {
  PushoverNotfication,
} = require("./NotficationOptions/PushoverNotfication");
const User = require("../../models/User");

async function SendNotfication(check) {
  const user = await User.findOne({ _id: check.user });
  console.log(user.email);
  if (user.email) {
    NotfyByMail(user, check);
    console.log("Mail sent");
  }
  if (check.webhook) {
    WebhookNotfication(user, check);
    console.log("Webhook sent");
  }
  if (check.pushover) {
    PushoverNotfication(user, check);
    console.log("Pushover sent");
  }
}

module.exports = {
  SendNotfication,
};
