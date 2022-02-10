import nodemailer from 'nodemailer'

export default function(params){
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.VERIFICATION_EMAIL_SENDER,
          pass: process.env.VERIFICATION_EMAIL_PASSWORD
        }
    });
    
    const mailOptions = {
        from: process.env.VERIFICATION_EMAIL_SENDER,
        to: params.email,
        subject: 'Verification email for url checker',
        text: params.body
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
} 
