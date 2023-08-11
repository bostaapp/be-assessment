const Notification = require("./notification");
const nodeMailer = require('nodemailer')
const userService = require('../service/user.service');

class SMSNotification extends Notification {

    smsServiceProvider;

    constructor(messageContent, recieverId) {
        super( messageContent, recieverId);
        //  initialize the sms service provide
    }
    sendNotification () {
        // get the phone number of the user using its id 
        //  use the smsServiceProvider to send the notification
    }
}