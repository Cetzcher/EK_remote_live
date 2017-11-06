function Chat(){
	this.users = {};
}

Chat.prototype.send = function(sender, msg){
	var keys = Object.keys(this.users);
	for (var k = 0; k < keys.length; k++){
		var key = keys[k];
		var ws = this.users[key];
		// send the msg to each user
		ws.send(sender + " said: " + msg);
	}
};

Chat.prototype.is_member = function(user){
	return this.users[user] !== undefined;
};

Chat.prototype.add_user = function(user, ws){
	console.log("adding user: " + user + "to the group, socket is: ");
	console.log(ws);	
	this.users[user] = ws;
};

Chat.prototype.remove = function(user){
	delete this.users[user];
};

module.exports = new Chat();
