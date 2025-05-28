export const name = 'messageCreate'
export const once = false
export async function execute(message, client) {
  if (message.author.bot) return
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
} 