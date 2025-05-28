export const name = 'ready'
export const once = true
export function execute(client) {
  console.log(`Connecté en tant que ${client.user.tag}`)
} 