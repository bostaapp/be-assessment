const nodemailer = require('nodemailer');
const sendgridTransporter = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(
  sendgridTransporter({
    auth: {
      api_key: process.env.NODE_MAILER_KEY
    }
  })
);

exports.sendVerifyCode = async (email, code) => {
  console.log('sending verification mail');
  try {
    await transport.sendMail({
      to: email,
      from: "elraghy8+noreplay@gmail.com",
      subject: "Active Your Uptime",
      html: `
      <p>You just register on Uptime Monitoring</p>
      <p>Use this code: ${code} to active your Account</p>       
      `,
    });
    
  } catch (error) {
    throw error;
  }
}

exports.sendPingStatus = async (checkData) => {
  console.log("inform you check status in mail please check you inbox...");
  try {
    await transport.sendMail({
      to: checkData.userEmail,
      from: "elraghy8+noreplay@gmail.com",
      subject: `Your ${checkData.name} status`,
      html: `
      <p>This is a notification from Uptime Monitoring</p>
      <p>Your check: ${checkData.protocol}://${checkData.url}:${checkData.port}${checkData.path} status is: ${checkData.status}</p>
      <p>we Will inform You about any updates</p>      
      `,
    });
  } catch (error) {
    throw error;
  }
}