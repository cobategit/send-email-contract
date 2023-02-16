const cronNode = require('node-cron')
const shelljs = require('shelljs')
const path = require('path')

const taskWeekly = cronNode.schedule(
  `06 15 * * *`,
  () => {
    console.log(`schedule weekly running...`)
    if (shelljs.exec(`node ${path.join(__dirname, 'index.js')}`).code !== 0) {
      console.log(`terjadi kesalahan cron job weekly`)
    }
  },
  { scheduled: true, timezone: 'Asia/Jakarta' }
)

module.exports = {
  taskWeekly,
}
