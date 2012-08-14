var http = require('http');
var util = require('util');

var opts = {
	host : 'localhost',
	path : '/xmpp',
	port : 5984,
	method: 'DELETE'
}

var req = http.request(opts, function(res) {
	res.on('data', function(data) {
		util.puts(data);	
	});
});

req.end();
