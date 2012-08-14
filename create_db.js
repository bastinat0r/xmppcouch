var http = require('http');
var util = require('util');

var opts = {
	host : 'localhost',
	port : 5984,
	method: 'PUT'
}

opts.path = '/xmpp';

var req = http.request(opts, function(res) {
	res.on('data', function(data) {
		util.puts(data);
	});
});

req.end();

