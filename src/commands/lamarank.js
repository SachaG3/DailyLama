import { getDB } from '../config/database.js'

export const name = 'lamarank'
export const description = 'Affiche le top 5 des utilisateurs avec le plus de lamas.'

export async function execute(message, client) {
  const db = getDB()
  const [rows] = await db.query(`
    SELECT discord_id, COUNT(*) as count, MIN(id) as min_id
    FROM DailyLame
    GROUP BY discord_id
    ORDER BY count DESC, min_id ASC
    LIMIT 5
  `)
  if (rows.length === 0) {
    await message.channel.send('Aucun lama n\'a encore été récupéré !')
    return
  }
  let rankMsg = 'Top 5 des éleveurs de lamas :\n'
  let lastCount = null
  let lastRank = 0
  for (let i = 0; i < rows.length; i++) {
    const user = await client.users.fetch(rows[i].discord_id).catch(() => null)
    const username = user ? user.username : `Inconnu (${rows[i].discord_id})`
    let rank = i + 1
    if (rows[i].count === lastCount) {
      rank = lastRank
    } else {
      lastRank = rank
      lastCount = rows[i].count
    }
    rankMsg += `#${rank} - ${username} : ${rows[i].count} lamas\n`
  }
  await message.channel.send(rankMsg)
} 