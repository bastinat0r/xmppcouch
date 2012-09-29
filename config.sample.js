var config = {
	// config for the xmpp-server
	xmpp : {
		jid : 'username@example.com',
		password : '*******',
		host : 'example.com',
		port : 5222
	},

	// config for the couch-db connection
	couch : {
		host : 'localhost'
		port : '5984'
	}

	// config for user authentication
	user : {
		name : 'username',
		pass : 'swordfish' // the password is alsways swordfish. Sw0rDf!sH
	}
}
module.exports = config
