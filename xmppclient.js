var xmpp = require('simple-xmpp');
var util = require('util');
var http = require('http');
var config = require('./config');
var message_hook = require('./prowl_hook.js');
var url = require('url');
var querystring = require('querystring');

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
	util.puts(from);
	var dbObject = {
		'from' : from,
		'message' : message,
		'time' : new Date()
	}	
	util.puts(JSON.stringify(dbObject));
	message_hook.process(dbObject);	
	putDB(dbObject);
});

xmpp.on('error', function(err) {
	util.puts(error);
});

xmpp.connect(config.xmpp);

var srv = http.createServer(function(req, res) {
	req.on('error', function(err) {
		util.puts(err);
	});
	req.on('data', function(data) {
		if(req.method == 'PUT') {
				var requrl = url.parse(req.url);
				util.puts(requrl);
				var param = querystring.parse(requrl.query);
				xmpp.send(param.jid+'@'+param.host, ""+data);
				res.writeHead(200);
				res.end("OK");
		}
		if(req.method == 'GET') {
		}
	});
});
srv.listen(6666, 'localhost');

