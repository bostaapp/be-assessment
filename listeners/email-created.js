import sendEmail from '../utils/send-email.js'

export default function(eventEmitter){
    eventEmitter.on('user-created', (user) => sendEmail({
        email: user.email,
        body: `welcome to url checker, your verification code is ${user.verificationCode}`
    }))
}
