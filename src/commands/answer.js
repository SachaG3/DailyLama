import { setAnswer } from '../database/answers.js'
import { isAllowed } from '../database/reactPerms.js'
import { EmbedBuilder } from 'discord.js'

export const name = 'answer'
export const description = `Configure une réponse automatique qui sera envoyée EN RÉPONSE au message d'un utilisateur ou à n'importe qui selon un mot-clé.

Utilisation :
- !answer @user <texte> [all|contains <mot>|endswith <mot>]
- !answer global <texte> [contains <mot>|endswith <mot>|all]

Options :
- all (par défaut) : répond à chaque message
- contains <mot> : répond si le message contient <mot>
- endswith <mot> : répond si le message se termine par <mot>

Exemples :
!answer @Soyer Salut !
!answer @Soyer Bravo contains gg
!answer global Merci contains merci
!answer global GG endswith gg
`

export async function execute(message, client) {
  if (!isAllowed(message)) {
    await message.channel.send('Tu n\'as pas la permission d\'utiliser cette commande.')
    return
  }
  const args = message.content.split(/ +/)
  let mention = message.mentions.users.first()
  let userId, answer, mode = 'all', word = ''
  // Mode global
  if (args[1] === 'global') {
    userId = 'global'
    let optIdx = args.findIndex(a => ['all','contains','endswith'].includes(a))
    if (optIdx > 1) {
      mode = args[optIdx]
      if (mode !== 'all' && args.length > optIdx+1) word = args[optIdx+1]
      answer = args.slice(2, optIdx).join(' ')
    } else {
      answer = args.slice(2).join(' ')
    }
    if (!answer) {
      await message.channel.send('Précise le texte de la réponse.')
      return
    }
    setAnswer(userId, answer, mode, word)
    const embed = new EmbedBuilder()
      .setTitle('Réponse automatique globale configurée')
      .setColor(0xffc300)
      .setDescription(`**Texte :** ${answer}\n**Mode :** ${mode}${word ? ' (' + word + ')' : ''}\nElle sera envoyée EN RÉPONSE à chaque message qui correspond.`)
    await message.channel.send({ embeds: [embed] })
    return
  }
  // Mode utilisateur
  if (!mention && args.length > 1) {
    try {
      mention = await client.users.fetch(args[1])
    } catch (e) { mention = null }
  }
  if (!mention) {
    await message.channel.send('Mentionne un utilisateur, donne son ID ou "global".')
    return
  }
  userId = mention.id
  let idx = 2
  if (!message.mentions.users.first()) idx = 1
  let optIdx = args.findIndex(a => ['all','contains','endswith'].includes(a))
  if (optIdx > 0) {
    mode = args[optIdx]
    if (mode !== 'all' && args.length > optIdx+1) word = args[optIdx+1]
    answer = args.slice(idx, optIdx).join(' ')
  } else {
    answer = args.slice(idx).join(' ')
  }
  if (!answer) {
    await message.channel.send('Précise le texte de la réponse.')
    return
  }
  setAnswer(userId, answer, mode, word)
  const embed = new EmbedBuilder()
    .setTitle(`Réponse automatique configurée pour ${mention.username}`)
    .setColor(0xffc300)
    .setDescription(`**Texte :** ${answer}\n**Mode :** ${mode}${word ? ' (' + word + ')' : ''}\nElle sera envoyée EN RÉPONSE à chaque message qui correspond.`)
  await message.channel.send({ embeds: [embed] })
} 