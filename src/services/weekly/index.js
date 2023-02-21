const ejs = require('ejs')
const path = require('path')
const sendEmail = require('../../helpers/email/index')
const {
  fetchMailOpening,
  fetchUserEmail,
  fetchUserEmailSender,
  fetchStoredProceduredWeekly,
} = require('../../helpers/mysql/index')
require('dotenv').config()

const cronJobsWeekly = async () => {
  try {
    const userEmailSender = await fetchUserEmailSender()
    const mailOpening = await fetchMailOpening(1)
    const userEmail = await fetchUserEmail('')

    await Promise.all(
      userEmail.map(async (user) => {
        let stockpileId = user['stockpile_id'] ? user['stockpile_id'] : 1
        const dataWeekly = await fetchStoredProceduredWeekly(stockpileId)

        ejs.renderFile(
          __dirname + '/weekly-email.ejs',
          {
            mailOpening: mailOpening['message'],
            dataWeekly: dataWeekly,
            dear: user['name'],
          },
          async (err, resHtml) => {
            if (!err) {
              const optionsEmail = {
                userEmailSender: userEmailSender['email'],
                userPasswordSender: userEmailSender['password'],
                from: userEmailSender['email'],
                to: user['email'],
                bcc: process.env.EMAIL_BCC,
                subject: user['stockpile_name']
                  ? `(${user['stockpile_name']}) Weekly Report of PO`
                  : 'Subject Generated by System: Weekly Report of PO',
                html: resHtml,
              }

              await sendEmail(optionsEmail)
            } else {
              throw new Error(err)
            }
          }
        )
      })
    )
  } catch (error) {
    throw new Error(error)
  }
}

cronJobsWeekly()
