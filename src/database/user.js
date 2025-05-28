import { getDB } from '../config/database.js'

export async function getUserById(id) {
  const db = getDB()
  const [rows] = await db.query('SELECT * FROM users WHERE discord_id = ?', [id])
  return rows[0]
}

export async function createUser(id, username) {
  const db = getDB()
  await db.query('INSERT INTO users (discord_id, username) VALUES (?, ?)', [id, username])
} 