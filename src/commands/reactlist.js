import fs from 'fs'
import { isAllowed } from '../database/reactPerms.js'
import { EmbedBuilder } from 'discord.js'

export const name = 'reactlist'
export const description = 'Affiche la liste des utilisateurs avec réactions automatiques.'

export async function execute(message, client) {
  if (!isAllowed(message)) {
    await message.channel.send('Tu n\'as pas la permission d\'utiliser cette commande.')
    return
  }
  if (!fs.existsSync('./reactions.json')) {
    await message.channel.send('Aucune réaction automatique configurée.')
    return
  }
  const data = JSON.parse(fs.readFileSync('./reactions.json', 'utf-8'))
  if (Object.keys(data).length === 0) {
    await message.channel.send('Aucune réaction automatique configurée.')
    return
  }
  const fields = []
  for (const userId in data) {
    const user = await client.users.fetch(userId).catch(() => null)
    const username = user ? user.username : `Inconnu (${userId})`
    fields.push({ name: username, value: data[userId].join(' '), inline: false })
  }
  const embed = new EmbedBuilder()
    .setTitle('Réactions automatiques configurées')
    .setColor(0x00bfff)
    .addFields(fields)
    .setFooter({ text: 'DailyLama Bot' })
  await message.channel.send({ embeds: [embed] })
} 