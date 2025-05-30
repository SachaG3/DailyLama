import { getAllAnswers } from '../database/answers.js'
import { isAllowed } from '../database/reactPerms.js'
import { EmbedBuilder } from 'discord.js'

export const name = 'answerlist'
export const description = 'Affiche la liste des réponses automatiques configurées.'

export async function execute(message, client) {
  if (!isAllowed(message)) {
    await message.channel.send('Tu n\'as pas la permission d\'utiliser cette commande.')
    return
  }
  const { userAnswers, globalAnswers } = getAllAnswers()
  if (Object.keys(userAnswers).length === 0 && globalAnswers.length === 0) {
    await message.channel.send('Aucune réponse automatique configurée.')
    return
  }
  const fields = []
  for (const userId in userAnswers) {
    const user = await client.users.fetch(userId).catch(() => null)
    const username = user ? user.username : `Inconnu (${userId})`
    const { answer, mode, word } = userAnswers[userId]
    let modeTxt = mode
    if (mode !== 'all') modeTxt += ` (${word})`
    fields.push({ name: username, value: `"${answer}" (mode : ${modeTxt})`, inline: false })
  }
  for (const rule of globalAnswers) {
    let modeTxt = rule.mode
    if (rule.mode !== 'all') modeTxt += ` (${rule.word})`
    fields.push({ name: `Global [${rule.id}]`, value: `"${rule.answer}" (mode : ${modeTxt})`, inline: false })
  }
  const embed = new EmbedBuilder()
    .setTitle('Réponses automatiques configurées')
    .setColor(0xffc300)
    .addFields(fields)
    .setFooter({ text: 'DailyLama Bot' })
  await message.channel.send({ embeds: [embed] })
} 