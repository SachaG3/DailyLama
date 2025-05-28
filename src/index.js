import { Client, GatewayIntentBits, Collection } from 'discord.js'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })
client.commands = new Collection()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commandsPath = path.join(__dirname, 'commands')
const eventsPath = path.join(__dirname, 'events')

for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = await import(`./commands/${file}`)
  if (command.data && command.data.name) {
    client.commands.set(command.data.name, command)
  }
}

for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const event = await import(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client))
  } else {
    client.on(event.name, (...args) => event.execute(...args, client))
  }
}

connectDB()

client.login(process.env.DISCORD_TOKEN) 