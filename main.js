const Discord = require('discord.js');
const pg = require('pg');
var http = require('http');

const client = new Discord.Client();

const dbURI = process.env.DISCORD_BOT_DB_URI;
const token = process.env.DISCORD_BOT_TOKEN;

const msgInvailArgs = "つかいかたがちがいます！ｗｗｗｗｗｗｗｗｗｗ";
const msgNotEnoughPermission = "……………キミ…………ターゲットロック…………したから………エクスぺリエント…………するから………………キミを………………ずっと…………ァハッ……♪";

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

var msgReceiver = async function(msg) {
	var msgStr = msg.content;
	var args = msgStr.split(' ');
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
		if(args.length != 1) {
			msg.channel.send(msgInvailArgs);
			return;
		}
		console.log("シャットダウンします...");
		process.exit();
		return;
	}

	
	if(command === "!getdb") {
		if(args.length != 2) {
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
		if(args.length != 3) {
			msg.channel.send(msgInvailArgs);
			return;
		}
		db.connect()
		   .then(() => {
			   return db.query("SELECT MAX(id) FROM test");
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
	}

	
	if(command === "!deldb") {
		if(msg.author.id != 364699222706225156) {
			msg.channel.send(msgNotEnoughPermission);
			return;
		}
		if(args.length != 1) {
			msg.channel.send(msgInvailArgs);
			return;
		}
		db.connect()
			.then(() => db.query("DELETE FROM test"))
			.then(() => msg.channel.send("どっかーん！！\n(全データを削除しました)"))
			.catch(e => msg.channel.send(`Database Error!\n\` ${e}\``));
	}

	
	if(command === "!editdb") {
		if(msg.author.id != 364699222706225156) {
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
	}

	if(msgStr[0] === '!') {
		msg.channel.send("えっ何そのコマンドは...(困惑)");
	}
}

client.on('ready', () => {
	console.log(`${client.user.tag} でログインしています。`);
});

client.on('message', async msg => {
	msgReceiver(msg);	
});

var server = http.createServer();
server.listen(process.env.PORT);
client.login(token);
