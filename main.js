const Discord = require('discord.js');
const pg = require('pg');
var http = require('http');

const client = new Discord.Client();

const dbURI = process.env.DISCORD_BOT_DB_URI;
const token = process.env.DISCORD_BOT_TOKEN;

const masterUserID = 364699222706225156;

/*本番環境 ※Releaseブランチ*/
//const serverID = 808294835848740865;
//const joinMessageChannelID = 723054022847889451;a

/*デバッグ環境 ※Developブランチ*/
const serverID = 692774588995731530;
const joinMessageChannelID = 723054022847889451;

const msgInvailArgs = "つかいかたがちがいます！ｗｗｗｗｗｗｗｗｗｗ";
const msgNotEnoughPermission = "……………キミ…………ターゲットロック…………したから………エクスぺリエント…………するから………………キミを………………ずっと…………ァハッ……♪";
const msgOnDelDB = "どっかーん！\n(データベースを全削除しました)";
const msgNotFoundCommands = "えっ何そのコマンドは...(困惑)";
const queryDelDataOnTest = "DELETE FROM test";
const queryFindMaxIdOnTest = "SELECT MAX(id) FROM test";

const db = new pg.Pool({
	connectionString: dbURI,
	ssl: {
		rejectUnauthorized: false
	}
});


const makeGetDataOrder = function(arg) {
	var order = `SELECT * FROM test WHERE Key = '${arg}';`;
	return order;
}

const makeInsertDataOrder = function(id, key, txt) {
	var order = `INSERT INTO test VALUES ('${id}', '${key}', '${txt}')`;
	return order;
}

const notEnoughPermission = function(msg) {
	if(msg.author.id != masterUserID) {
		return true;
	}
	return false;
}


var msgReceiver = async function(msg) {
	var msgStr = msg.content;
	var args = msgStr.split(/\s/);
	var command = args[0];

	
	if(command === "!ping") {
		if(args.length != 1) {
			msg.channel.send(msgInvailArgs);
			return;
		}
		msg.channel.send('pong');
		return;
	}

	
	if(command === "!sd") {
		if(notEnoughPermission(msg)) {
			msg.channel.send(msgNotEnoughPermission);
			return;
		}
		if(args.length != 1) {
			msg.channel.send(msgInvailArgs);
			return;
		}
		console.log("シャットダウンします...");
		process.exit();
		return;
	}

	
	if(command === "!getdb") {
		if(args.length !== 2) {
			msg.channel.send(msgInvailArgs);
			return;
		}
		db.connect()
			.then(() => {
				var q = makeGetDataOrder(args[1]);
				return  db.query(q);
			})
			.then((res) => {
				res = res.rows;
				res = JSON.stringify(res);
				msg.channel.send(`結果\n\`\`\`json\n${res}\`\`\``);
			})
			.catch((e) => {
				msg.channel.send(`Database Error!\n\` ${e}\``);
			});
		return;
	}

	
	if(command === "!adddb") {
		if(args.length !== 3) {
			msg.channel.send(msgInvailArgs);
			return;
		}
		db.connect()
		   .then(() => {
			   return db.query(queryFindMaxIdOnTest);
		   })
			.then((newid) => {
				newid = newid.rows[0].max;
				return makeInsertDataOrder(newid + 1, args[1], args[2]);
		   })
		   .then((q) => {
			   db.query(q);
		   })
			.then(() => {
				msg.channel.send("更新完了。");
			})
		   .catch((e) => {
			   msg.channel.send(`Database Error!\n\` ${e}\``)
		   });
		return;
	}

	
	if(command === "!deldb") {
		if(notEnoughPermission(msg)) {
			msg.channel.send(msgNotEnoughPermission);
			return;
		}
		if(args.length !== 1) {
			msg.channel.send(msgInvailArgs);
			return;
		}
		db.connect()
			.then(() => db.query(queryDelDataOnTest))
			.then(() => msg.channel.send(msgOnDelDB))
			.catch(e => msg.channel.send(`Database Error!\n\` ${e}\``));
		return;
	}

	
	if(command === "!editdb") {
		if(notEnoughPermission(msg)) {
			msg.channel.send(msgNotEnoughPermission);
			return;
		}
		db.connect()
			.then(() => db.query(msgStr.substr(7)))
			.then((res) => {
				res = res.rows;
				res = JSON.stringify(res);
				msg.channel.send(`操作完了\n\`\`\`json\n${res}\`\`\``)
			})
			.catch(e => msg.channel.send(`Database Error!\n\` ${e}\``))
		return;
	}

	if(command === "!getdata") {
		if(!(args.length == 1||args.length == 2)) {
			msg.channel.send(msgNotEnoughPermission);
			return;
		}
		let TargetUserID;
		if(args.length == 1) {
			TargetUserID = msg.author.id;
		}
		else {
			TargetUserID = args[1];
		}
		db.connect()
			.then(() => db.query(getQueryFindUserData(TargetUserID)))
			.then((res) => {
				res = res.rows;
				res = JSON.stringify(res);
				msg.channel.send(`操作完了\n\`\`\`json\n${res}\`\`\``);
			})
			.catch(e => msg.channel.send(`Database Error!\n\` ${e}\``))
	}

	if(command === "!testJoinmsg") {
		if(notEnoughPermission(msg)) {
			msg.channel.send(msgNotEnoughPermission);
			return;
		}
		joinEventExecuter(msg.author);
		return;
	}
	if(msgStr[0] === '!') {
		msg.channel.send(msgNotFoundCommands);
		return;
	}
}

const joinEventExecuter = function(usr) {
	client.guilds.fetch(serverID)
		.then((server) => {
			console.log(server.iconURL);
			client.channels.fetch("723054022847889451")
				.then(ch => {
					ch.send({embed: {
						author: {
							name: server.name,
							icon_url: server.iconURL
						},
						fields: [
							{
								name: "Welcome!!!",
								value: "welcome to the underground(暗黒微笑)"
							}
						],
						color: 0x114514
					}
							})
				}
					 )
				.catch((e) => console.error(e));
		})
		.catch((e) => {console.log("えらー");console.error(e);});
}

client.on('ready', () => {
	console.log(`${client.user.tag} でログインしています。`);
});

client.on('guildMemverAdd', async usr => {
	joinEventExecuter(usr);
});
client.on('message', async msg => {
	msgReceiver(msg);	
});

var server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('200 なにもありませんよ');
});

server.listen(process.env.PORT);
client.login(token);
