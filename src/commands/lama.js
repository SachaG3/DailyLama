import { getDB } from '../config/database.js'

export const name = 'lama'

export async function execute(message) {
  const db = getDB()
  const discordId = message.author.id
  const today = new Date().toISOString().slice(0, 10)
  const [rows] = await db.query('SELECT * FROM DailyLame WHERE discord_id = ? AND date_obtention = ?', [discordId, today])
  if (rows.length > 0) {
    const [countRows] = await db.query('SELECT COUNT(*) as count FROM DailyLame WHERE discord_id = ?', [discordId])
    const count = countRows[0].count
    await message.channel.send(`Tu as déjà récupéré ton lama aujourd'hui ! Tu possèdes ${count} lamas 🦙.`)
    return
  }
  await db.query('INSERT INTO DailyLame (discord_id, date_obtention) VALUES (?, ?)', [discordId, today])
  const [countRows] = await db.query('SELECT COUNT(*) as count FROM DailyLame WHERE discord_id = ?', [discordId])
  const count = countRows[0].count
  await message.channel.send(`Voici ton lama du jour ! 🦙 Tu en as maintenant ${count}.`)
} 