const { taskWeekly } = require('./services/weekly/task.js')
const { taskWeeklyCurah } = require('./services/weekly-curah/task.js')

taskWeeklyCurah.start()
taskWeekly.start()
