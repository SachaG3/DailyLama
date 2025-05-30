import { setReactions } from '../database/reactions.js'
import { isAllowed } from '../database/reactPerms.js'
import { EmbedBuilder } from 'discord.js'

export const name = 'react'
export const description = 'Configure les réactions automatiques pour un utilisateur (mention ou ID).'

export async function execute(message, client) {
  if (!isAllowed(message)) {
    await message.channel.send('Tu n\'as pas la permission d\'utiliser cette commande.')
    return
  }
  console.log('Commande !react reçue')
  let mention = message.mentions.users.first()
  // Si pas de mention, essaie de récupérer l'ID passé en argument
  if (!mention) {
    const args = message.content.split(/ +/)
    if (args.length > 1) {
      try {
        mention = await client.users.fetch(args[1])
      } catch (e) {
        mention = null
      }
    }
  }
  if (!mention) {
    console.log('Aucune mention ou ID trouvé')
    await message.channel.send('Mentionne un utilisateur ou donne son ID pour activer les réactions automatiques.')
    return
  }
  console.log('Utilisateur ciblé :', mention.id)
  const prompt = await message.channel.send(`Réagis à ce message avec les emojis à utiliser pour ${mention}. Quand tu as fini, écris "ok".`)
  const textFilter = m => m.author.id === message.author.id && m.content.toLowerCase() === 'ok'
  await message.channel.awaitMessages({ filter: textFilter, max: 1, time: 60000 })
  console.log('Message "ok" reçu, attente 1s pour les réactions...')
  await new Promise(res => setTimeout(res, 1000))
  await prompt.fetch()
  const reactions = Array.from(prompt.reactions.cache.values()).map(r => r.emoji.name)
  console.log('Réactions trouvées sur le message :', reactions)
  if (reactions.length === 0) {
    await message.channel.send('Aucune réaction trouvée sur le message. Réessaie en ajoutant bien les emojis avant d\'écrire "ok".')
    console.log('Aucune réaction trouvée, commande annulée')
    return
  }
  setReactions(mention.id, reactions)
  console.log('Réactions enregistrées pour', mention.id, ':', reactions)
  const embed = new EmbedBuilder()
    .setTitle(`Réactions automatiques configurées pour ${mention.username}`)
    .setColor(0x00bfff)
    .setDescription(`**Emojis :** ${reactions.join(' ')}\nElles seront ajoutées à chaque message de ${mention}.`)
  await message.channel.send({ embeds: [embed] })
} 