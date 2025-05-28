import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

let pool

export function connectDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
  return pool
}

export function getDB() {
  if (!pool) throw new Error('La base de données n\'est pas connectée')
  return pool
} 