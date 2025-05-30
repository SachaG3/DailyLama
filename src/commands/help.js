import fs from 'fs'
import path from 'path'
import { EmbedBuilder } from 'discord.js'
import { isAllowed } from '../database/reactPerms.js'

export const name = 'help'
export const description = 'Affiche la liste des commandes que tu peux utiliser.'

export async function execute(message, client) {
  const commandsPath = path.join(process.cwd(), 'src', 'commands')
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))
  const fields = []
  for (const file of files) {
    if (file === 'ping.js') continue
    const cmd = await import(`./${file}`)
    if (!cmd.description) continue
    // Si la commande a une restriction, on vérifie si l'utilisateur a le droit
    if (['react.js', 'reactoff.js', 'reactlist.js'].includes(file)) {
      if (!isAllowed(message)) continue
    }
    fields.push({ name: `!${cmd.name}`, value: cmd.description, inline: false })
  }
  if (fields.length === 0) {
    await message.author.send('Tu n\'as accès à aucune commande.')
    await message.delete().catch(() => {})
    return
  }
  const embed = new EmbedBuilder()
    .setTitle('Commandes disponibles')
    .setColor(0x00bfff)
    .addFields(fields)
    .setFooter({ text: 'DailyLama Bot' })
  await message.author.send({ embeds: [embed] })
  await message.delete().catch(() => {})
} 