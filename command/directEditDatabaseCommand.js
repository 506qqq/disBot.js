const Discord = require('discord.js');

const queryDelDataOnTest = "DELETE FROM test";
const queryFindMaxIdonTest = "SELECT MAX(id) FROM test";

const msgOnDelDB = "どっかーん！\n(データベースを全削除しました)";
const msgNotFoundCommands = "えっ何そのコマンドは...(困惑)";

const makeGetDataOrder = function(arg) {
	var order = `SELECT * FROM test WHERE Key = '${arg}';`;
	return order;
}

const makeInsertDataOrder = function(id, key, txt) {
	var order = `INSERT INTO test VALUES ('${id}', '${key}', '${txt}')`;
	return order;
}

export function getDataFromDatabaseCommand(msg, args) {
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


export function addDataIntoDatabaseCommand(msg, args) {
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


export function delateDatabaseCommand(msg, args) {
		db.connect()
			.then(() => db.query(queryDelDataOnTest))
			.then(() => msg.channel.send(msgOnDelDB))
			.catch(e => msg.channel.send(`Database Error!\n\` ${e}\``));
		return;
	}

	
export function editDirectryDatabaseCommand(msg) {
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
