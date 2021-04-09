const Discord = require('discord.js')
const client = new Discord.Client()

var msgReceiver = async function(arg) {
	if(arg.content === "!ping") {
		arg.channel.send('pong');
	}
	if(arg.content === "!shutdown") {
		process.exit();
	}
}

client.on('ready', () => {
	console.log(`${client.user.tag} でログインしています。`);
})

client.on('message', async msg => {
	msgReceiver(msg);	
})

client.login(process.env.DISCORD_BOT_TOKEN);
