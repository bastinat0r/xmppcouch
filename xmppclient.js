var xmpp = require('simple-xmpp');
var util = require('util');
var http = require('http');
var config = require('./config');

function putDB (dbObject) {
	var opts = config.couch;
	opts.method = 'GET';
	opts.path = '/_uuids';
	
	var req = http.request(opts, function(res) {
		res.on('data', function(data) {
			var uuid = JSON.parse(data).uuids[0];
		
			var opts = config.couch;
			opts.path = '/xmpp/'+ uuid;
			opts.method = 'PUT';
			var req = http.request(opts, function(res) {
			res.on('data', function(data) {
				util.puts(data);
				});
			});

			req.on('error', function (err) {
				util.puts(err);
			});
			req.write(JSON.stringify(dbObject));
			req.end();	
		});
	});

	req.on('error', function(err) {
		util.puts(err);
		util.puts('couchdb up and running?');
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
