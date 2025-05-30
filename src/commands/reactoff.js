import { removeReactions } from '../database/reactions.js'
import { isAllowed } from '../database/reactPerms.js'
import { EmbedBuilder } from 'discord.js'

export const name = 'reactoff'
export const description = 'Désactive les réactions automatiques pour un utilisateur (mention ou ID).'

export async function execute(message, client) {
  if (!isAllowed(message)) {
    await message.channel.send('Tu n\'as pas la permission d\'utiliser cette commande.')
    return
  }
  let mention = message.mentions.users.first()
  let user = mention
  const args = message.content.split(/ +/)
  if (!user && args.length > 1) {
    try {
      user = await client.users.fetch(args[1])
    } catch (e) { user = null }
  }
  if (!user) {
    await message.channel.send('Mentionne un utilisateur ou donne son ID pour désactiver les réactions automatiques.')
    return
  }
  removeReactions(user.id)
  const embed = new EmbedBuilder()
    .setTitle(`Réactions automatiques désactivées pour ${user.username}`)
    .setColor(0x00bfff)
    .setDescription(`Aucune réaction automatique ne sera ajoutée à ses messages.`)
  await message.channel.send({ embeds: [embed] })
} 