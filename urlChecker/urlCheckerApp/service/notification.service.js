const NotificationFactory = require("../notification/notification.factory");

exports.sendNotification = (type, messageContent, recieverId) => {
    
    const notification = NotificationFactory.createNotification(type ,messageContent ,recieverId );
    // console.log(notification)
    notification.sendNotification()
}