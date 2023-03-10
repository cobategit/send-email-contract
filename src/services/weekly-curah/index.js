const ejs = require('ejs')
const path = require('path')
const sendEmail = require('../../helpers/email/index')
const {
  fetchMailOpening,
  fetchUserEmail,
  fetchUserEmailSender,
  fetchStoredProceduredWeeklyCurah,
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
        const dataWeeklyCurah = await fetchStoredProceduredWeeklyCurah(
          stockpileId
        )

        ejs.renderFile(
          __dirname + '/weekly-curah-email.ejs',
          {
            mailOpening: mailOpening['message'],
            dataWeeklyCurah: dataWeeklyCurah,
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
                  ? `(${user['stockpile_name']}) Weekly Report of PO Curah`
                  : 'Subject Generated by System: Weekly Report of PO Curah',
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
