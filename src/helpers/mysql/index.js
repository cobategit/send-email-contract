const { format } = require('date-fns')
const { connMysql } = require('../../config/conn-mysql')

const fetchUserEmailSender = async () => {
  const mysql = await connMysql()
  const [rows, fields] = await mysql.execute('SELECT * from usermailsender', [])

  return rows[0]
}

const fetchMailOpening = async (id) => {
  const mysql = await connMysql()

  // 1 weekly dan weekly curah, 2 montly
  const [rows, fields] = await mysql.execute(
    'SELECT  * FROM mailopening where idmailopening = ?',
    [id]
  )

  return rows[0]
}

const fetchUserEmail = async (type) => {
  const mysql = await connMysql()

  let operator = ''
  if (type == 'monthly') {
    operator = '='
  } else {
    operator = '!='
  }
  const [rows, fields] = await mysql.execute(
    `SELECT 
    u.name, 
    u.email, 
    us.stockpile_id, 
    s.stockpile_name 
  FROM 
    usermail u 
    LEFT JOIN usermail_stockpile us ON us.idusermail = u.idusermail 
    LEFT JOIN stockpile s ON s.stockpile_id = us.stockpile_id 
  WHERE 
    u.active = 1 
    AND s.stockpile_id IS NOT NULL 
    AND us.stockpile_id ${operator} 10;`,
    []
  )

  return rows
}

fetchUserEmail('')

const fetchStoredProceduredMontly = async () => {
  const mysql = await connMysql()

  let dateNow = `${format(new Date(), 'yyyy-MM-dd')}`
  const [rows, fields] = await mysql.execute(`call summarypomonthly(?)`, [
    dateNow,
  ])

  return rows[0]
}

const fetchStoredProceduredWeekly = async (stockpileId) => {
  const mysql = await connMysql()

  let dateNow = `${format(new Date(), 'yyyy-MM-dd')}`
  const [rows, fields] = await mysql.execute(`call summarypo08092019(?,?)`, [
    stockpileId,
    dateNow,
  ])

  return rows[0]
}

const fetchStoredProceduredWeeklyCurah = async (stockpileId) => {
  const mysql = await connMysql()

  let dateNow = `${format(new Date(), 'yyyy-MM-dd')}`
  const [rows, fields] = await mysql.execute(
    `call summarypo08092019curah(?,?)`,
    [stockpileId, dateNow]
  )

  return rows[0]
}

module.exports = {
  fetchUserEmailSender,
  fetchMailOpening,
  fetchUserEmail,
  fetchStoredProceduredMontly,
  fetchStoredProceduredWeekly,
  fetchStoredProceduredWeeklyCurah,
}
