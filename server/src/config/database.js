import mysql from 'mysql2/promise'
import { config } from './env.js'

let pool = null

export function getPool() {
  if (!pool) {
    // Support Railway MYSQL_PUBLIC_URL or individual fields
    const dbUrl = process.env.MYSQL_PUBLIC_URL
    if (dbUrl) {
      pool = mysql.createPool({
        uri: dbUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
      })
    } else {
      pool = mysql.createPool({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
      })
    }
  }
  return pool
}

export async function query(sql, params) {
  const [rows] = await getPool().execute(sql, params)
  return rows
}

export async function testConnection() {
  try {
    const conn = await getPool().getConnection()
    await conn.ping()
    conn.release()
    return true
  } catch (err) {
    console.error('Database connection failed:', err.message)
    return false
  }
}
