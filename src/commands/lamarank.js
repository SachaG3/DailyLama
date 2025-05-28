import { getDB } from '../config/database.js'

export const name = 'lamarank'

export async function execute(message, client) {
  const db = getDB()
  const [rows] = await db.query(`
    SELECT discord_id, COUNT(*) as count
    FROM DailyLame
    GROUP BY discord_id
    ORDER BY count DESC
    LIMIT 5
  `)
  if (rows.length === 0) {
    await message.channel.send('Aucun lama n\'a encore été récupéré !')
    return
  }
  let rankMsg = 'Top 5 des éleveurs de lamas :\n'
  for (let i = 0; i < rows.length; i++) {
    const user = await client.users.fetch(rows[i].discord_id).catch(() => null)
    const username = user ? user.username : `Inconnu (${rows[i].discord_id})`
    rankMsg += `#${i+1} - ${username} : ${rows[i].count} lamas\n`
  }
  await message.channel.send(rankMsg)
} 