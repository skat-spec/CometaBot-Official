const { Client, Collection ,Intents } = require("discord.js")

const client = new Client({  intents: 32767 })

client.commands = new Collection()
client.aliases = new Collection()

client.login(process.env.Token_BotUB)
