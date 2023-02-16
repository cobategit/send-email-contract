const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (options) => {
  const toptions = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: options.userEmailSender,
      pass: options.userPasswordSender,
    },
  }

  const mailOptions = {
    from: options.from,
    to: options.to,
    bcc: options.bcc,
    subject: options.subject,
    html: options.html,
  }

  const transpoter = nodemailer.createTransport(toptions)

  await transpoter.sendMail(mailOptions)
}

module.exports = sendEmail
