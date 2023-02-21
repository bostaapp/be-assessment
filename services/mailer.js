let SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.MAILER_API;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

const sendVEmail = (user, vLink) => {
  let sender = {
    email: "bosta-test@bosta.com",
  };
  console.log(user.email);
  let to = [
    {
      email: user.email,
      name: user.userName,
    },
  ];

  sendSmtpEmail = {
    sender,
    to,
    subject: "Bosta Verificaton Email",
    textContent:
      "hello this is bosta verification email please use that link to verify your email " +
      vLink,
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
    },
  };
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("API called successfully. Returned data: " + data);
    },
    function (error) {
      console.error(error);
    }
  );
};

const sendServiceDownEmail = (user, url) => {
  let sender = {
    email: "bosta-test@bosta.com",
  };
  console.log(user.email);
  let to = [
    {
      email: user.email,
      name: user.userName,
    },
  ];

  sendSmtpEmail = {
    sender,
    to,
    subject: "Bosta Verificaton Email",
    textContent: `Report Status : ${url} is down `,
    headers: {
      "X-Mailin-custom":
        "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
    },
  };
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("API called successfully. Returned data: " + data);
    },
    function (error) {
      console.error(error);
    }
  );
};

module.exports = { sendVEmail,sendServiceDownEmail };
