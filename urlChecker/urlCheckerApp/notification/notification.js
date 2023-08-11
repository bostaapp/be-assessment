

class Notification { 
   
    messageContent;
    recieverId;
   

    constructor( messageContent, recieverId) {
     
        this.messageContent = messageContent;
        this.recieverId = recieverId;
    }
    sendNotification ( ) {
        console.log("sending notification ....... ")
    }
        
    
}

module.exports = Notification;