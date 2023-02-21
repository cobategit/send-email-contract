const cronNode = require('node-cron')
const shelljs = require('shelljs')
const path = require('path')

const taskWeeklyCurah = cronNode.schedule(
  `10 6 * * *`,
  () => {
    console.log(`schedule weekly curah running...`)
    if (shelljs.exec(`node ${path.join(__dirname, 'index.js')}`).code !== 0) {
      console.log(`terjadi kesalahan cron job weekly curah`)
    }
  },
  { scheduled: true, timezone: 'Asia/Jakarta' }
)

module.exports = {
  taskWeeklyCurah,
}
