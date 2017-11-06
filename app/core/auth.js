var user = require("./user");
var bcrypt = require('bcrypt');

// constructor for the authentication object.
function Auth ()
{
	this.last = 0;
	this.tokens = {};	 
}

// remove the token from the token list
Auth.prototype.remove = function(token){
	delete this.tokens[token]; 
};

// checks if the user is authorized, return undefinded if not.
// otherwise return the username of the assoc. token.
Auth.prototype.is_auth = function(token){
	return this.tokens[token];
};

// crpyt the username alogn with the salt generated from the last_id.
// return a hash value.
Auth.prototype.crypt = function(l, username) {
	var salt = bcrypt.genSaltSync(l);
	var hash = bcrypt.hashSync(username, salt);
	return hash;
};

// authenticate the user.
Auth.prototype.auth = function(userObj, callback){
	// create a token fot the user,
	var id = this.last;
	this.last ++; 

	var self = this;
	user.get_user(userObj, function (result) {
		if(!result.success)
			return callback({success: false, error: "could not authenticate user"});
		// write token
		var token = self.crypt(self.last, userObj.name);
		self.tokens[token] = userObj.name;
		return callback({success: true, token: token});
	});
};


module.exports = new Auth();