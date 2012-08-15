var xmpp = require('simple-xmpp');
var util = require('util');
var http = require('http');
var config = require('./config');

var couchOpts = {
	host: 'localhost',
	port: '5984',
}

var srv = http.createServer(function(req){}, function(res){});

srv.listen('localhost', 1337);

function putDB (dbObject) {
	var opts = couchOpts;
	opts.method = 'GET';
	opts.path = '/_uuids';
	var req = http.request(opts, function(res) {
		res.on('data', function(data) {
		var uuid = JSON.parse(data).uuids[0];
		var opts = couchOpts;
			opts.path = '/xmpp/'+ uuid;
			opts.method = 'PUT';
			var req = http.request(opts, function(res) {
			res.on('data', function(data) {
				util.puts(data);
				});
			});
			req.write(JSON.stringify(dbObject));
			req.end();	
		});
	});
	req.end();
};

xmpp.on('online', function() {
	util.puts('Online');
});

xmpp.on('chat', function(from, message) {
	var dbObject = {
		'from' : from,
		'message' : message,
		'time' : new Date()
	}	
	util.puts(JSON.stringify(dbObject));
	xmpp.send(from, 'foo: ' + message);

	putDB(dbObject);
});

xmpp.on('error', function(err) {
	util.puts(error);
});


xmpp.connect(config.xmpp);
