const nodemailer = require("nodemailer");

const sendEmail = async options => {
  //1 create a transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST_SMTP,
    port: process.env.EMAIL_PORT_SMTP,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME_SMTP,
      pass: process.env.EMAIL_PASSWORD_SMTP
    }
  });
  //2 define the mail options
  const mailOptions = {
    from: "Dm Hesh<_hesh_@ukr.net>",
    to: options.email,
    subject: options.subject,
    text: options.message
    //html:
  };
  //3 send email
  /*const res = await transporter.sendMail(mailOptions);*/
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
  });
};

module.exports = sendEmail;
