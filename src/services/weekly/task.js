const cronNode = require('node-cron')
const shelljs = require('shelljs')
const path = require('path')

const taskWeekly = cronNode.schedule(
  `10 7 * * *`,
  () => {
    if (shelljs.exec(`node ${path.join(__dirname, 'index.js')}`).code !== 0) {
      console.log(`terjadi kesalahan cron job weekly`)
    }
    console.log(`schedule weekly running...`)
  },
  { scheduled: true, timezone: 'Asia/Jakarta' }
)

taskWeekly.start()

module.exports = {
  taskWeekly,
}
