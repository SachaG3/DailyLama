import { getDB } from '../config/database.js'

export const name = 'lama'
export const description = 'Récupère ton lama du jour et affiche combien tu en as.'

function getLocalDate() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 10)
}

export async function execute(message, client) {
  const db = getDB()
  const discordId = message.author.id
  const today = getLocalDate()
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