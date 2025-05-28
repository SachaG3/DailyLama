export const name = 'interactionCreate'
export const once = false
export async function execute(interaction, client) {
  if (!interaction.isCommand()) return
  const command = client.commands.get(interaction.commandName)
  if (!command) return
  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'Erreur lors de l\'exécution de la commande.', ephemeral: true })
  }
} 