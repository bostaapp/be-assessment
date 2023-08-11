const EmailNotification = require("./email.notification");
// const SMSNotification = require("./sms.notification");
// const WebhookNotification = require("./webhook.notification");


class NotificationFactory {

    createNotification(type , messageContent, recieverId) {
        switch (type) {
            case "email":
                return new EmailNotification(messageContent, recieverId);
            case "sms":
                // return new SMSNotification(this.messageContent, this.recieverId);
            case "webhook":
                // return new WebhookNotification(this.messageContent, this.recieverId);
            default:
                throw new Error("Invalid notification type");
        }
    }
}

module.exports = new NotificationFactory();