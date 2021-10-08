module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
	  console.log(`Ready ${client.user.username}`);
	  const statuses = [`${client.guilds.cache.size}servers, ${client.users.cache.size}users`, ``]
	  const types = ["WATCHING", "LISTENING"]
	  
	  const rnd = statuses[Math.floor(Math.random() * statuses.length)]
      const rnd2 = types[Math.floor(Math.random() * types.length)]
	  
	  setInterval(() => {
	    client.user.setActivity(rnd, {type: rnd2})
	  }, 15000)
	},
};
