import { removeAnswer } from '../database/answers.js'
import { isAllowed } from '../database/reactPerms.js'
import { EmbedBuilder } from 'discord.js'

export const name = 'answeroff'
export const description = 'Désactive la réponse automatique pour un utilisateur ou une règle globale (par ID affiché dans !answerlist).'

export async function execute(message, client) {
  if (!isAllowed(message)) {
    await message.channel.send('Tu n\'as pas la permission d\'utiliser cette commande.')
    return
  }
  const args = message.content.split(/ +/)
  if (args[1] && args[1].startsWith('g')) {
    removeAnswer(args[1])
    const embed = new EmbedBuilder()
      .setTitle('Réponse automatique globale désactivée')
      .setColor(0xffc300)
      .setDescription(`La règle globale ${args[1]} a été supprimée.`)
    await message.channel.send({ embeds: [embed] })
    return
  }
  if (args[1] === 'global') {
    removeAnswer('global')
    const embed = new EmbedBuilder()
      .setTitle('Réponses automatiques globales désactivées')
      .setColor(0xffc300)
      .setDescription('Toutes les réponses automatiques globales ont été supprimées.')
    await message.channel.send({ embeds: [embed] })
    return
  }
  let mention = message.mentions.users.first()
  let user = mention
  if (!user && args.length > 1) {
    try {
      user = await client.users.fetch(args[1])
    } catch (e) { user = null }
  }
  if (!user) {
    await message.channel.send('Mentionne un utilisateur, donne son ID, "global" ou l\'ID d\'une règle globale (!answerlist).')
    return
  }
  removeAnswer(user.id)
  const embed = new EmbedBuilder()
    .setTitle(`Réponse automatique désactivée pour ${user.username}`)
    .setColor(0xffc300)
    .setDescription(`Aucune réponse automatique ne sera envoyée en réponse à ses messages.`)
  await message.channel.send({ embeds: [embed] })
} 