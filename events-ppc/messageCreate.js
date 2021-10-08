const config = require("../config.json");
const configdev = config.developers;
const { Collection, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message, client) {
      
      if(message.author.bot) return;
	    
      let cooldowns = client.cooldowns;
      if (!message.content.startsWith(client.config.prefix)) return;
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
      if (!command) return;
      //if(message.channel.type === 'dm') {
        //return newGuildHook1.send(
          //new Discord.MessageEmbed()
          //.setTitle('Лс с ботом')
          //.setColor(0x0000ff)
          //.setDescription(message.content)
          //.setTimestamp()
        //)
      //}
      if (command.args && !args.length) {
        let reply = `Вы не правильно написали, ${message.author}!\n\n`;
        if (command.usage) {
          reply += `Правильное использование команды: \`${config.prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send({ content: reply });
      }
      if(!configdev.includes(message.author.id) && command.admin == true) {
        console.log(`${message.author.tag} пытался использовать admin команду!`);
        return message.react('❌');
      }
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }
      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 5) * 1000;
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply({ content: `Пожалуйста, подожди еще ${timeLeft.toFixed(1)} секунд(ы) прежде чем использовать команду \`${command.name}\``});
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      try {
        command.execute(client, message, args, command);
      } catch (error) {
        console.error(error);
        message.channel.send(new MessageEmbed()
        .setTitle("Ошибка!")
        .setDescription(`\`\`\`` + error + `\`\`\``)
        .setColor(client.colors.error))
        console.log('Ошибка у бота!');
      }
  }
}
