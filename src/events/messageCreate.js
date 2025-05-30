import { getReactions } from '../database/reactions.js'
import { getAnswer, getGlobalAnswers } from '../database/answers.js'

export const name = 'messageCreate'
export const once = false
export async function execute(message, client) {
  if (message.author.bot) return

  // Réponse automatique personnalisée (par user)
  const autoAnswer = getAnswer(message.author.id)
  if (autoAnswer) {
    const { answer, mode, word } = autoAnswer
    let trigger = false
    const msgContent = message.content.toLowerCase()
    const wordLower = word ? word.toLowerCase() : ''
    if (mode === 'all') trigger = true
    else if (mode === 'contains' && word && msgContent.includes(wordLower)) trigger = true
    else if (mode === 'endswith' && word && msgContent.trim().endsWith(wordLower)) trigger = true
    if (trigger) {
      await message.reply(answer)
    }
  }

  // Réponse automatique globale (mot-clé, n'importe qui)
  const globalAnswers = getGlobalAnswers()
  for (const rule of globalAnswers) {
    let trigger = false
    const msgContent = message.content.toLowerCase()
    const wordLower = rule.word ? rule.word.toLowerCase() : ''
    if (rule.mode === 'all') trigger = true
    else if (rule.mode === 'contains' && rule.word && msgContent.includes(wordLower)) trigger = true
    else if (rule.mode === 'endswith' && rule.word && msgContent.trim().endsWith(wordLower)) trigger = true
    if (trigger) {
      await message.reply(rule.answer)
      break
    }
  }

  // Ajout automatique des réactions configurées
  const reactions = getReactions(message.author.id)
  for (const emoji of reactions) {
    await message.react(emoji)
  }

  if (message.content === '!ping') {
    await message.channel.send('Pong!')
    return
  }
  if (message.content === '!lama') {
    const { execute } = await import('../commands/lama.js')
    await execute(message, client)
    return
  }
  if (message.content === '!lamarank') {
    const { execute } = await import('../commands/lamarank.js')
    await execute(message, client)
    return
  }
  if (message.content === '!reactlist') {
    const { execute } = await import('../commands/reactlist.js')
    await execute(message, client)
    return
  }
  if (message.content.startsWith('!react ')) {
    const { execute } = await import('../commands/react.js')
    await execute(message, client)
    return
  }
  if (message.content.startsWith('!reactoff ')) {
    const { execute } = await import('../commands/reactoff.js')
    await execute(message, client)
    return
  }
  if (message.content === '!help') {
    const { execute } = await import('../commands/help.js')
    await execute(message, client)
    return
  }
  if (message.content.startsWith('!answer ')) {
    const { execute } = await import('../commands/answer.js')
    await execute(message, client)
    return
  }
  if (message.content.startsWith('!answeroff ')) {
    const { execute } = await import('../commands/answeroff.js')
    await execute(message, client)
    return
  }
  if (message.content === '!answerlist') {
    const { execute } = await import('../commands/answerlist.js')
    await execute(message, client)
    return
  }
} 