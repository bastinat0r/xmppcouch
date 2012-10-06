var xmpp = require('simple-xmpp');
var util = require('util');
var http = require('http');
var config = require('./config');
var message_hook = require('./prowl_hook.js');
var url = require('url');
var querystring = require('querystring');
var auth = require('http-digest-auth');

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
				util.puts(JSON.stringify(err));
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

function getConversation(jid, cb) {
	var opts = config.couch;
	opts.method = 'GET';
	opts.path = '/xmpp/_design/all/_view/json?' + querystring.stringify({
		"key" : '"'+jid+'"'
	});
	util.puts(opts.path);
	var conversation = "";
	var req = http.request(opts, function(res) {
		res.on('data', function(data) {
			conversation = conversation + data;
		});
		res.on('end', function() {
			cb(conversation);
		});
	});
	req.end();
}
xmpp.on('online', function() {
	util.puts('Online');
});

xmpp.on('chat', function(from, message) {
	util.puts(from);
	var dbObject = {
		'from' : from,
		'to' : config.xmpp.jid,
		'message' : message,
		'time' : new Date()
	}	
	util.puts(JSON.stringify(dbObject));
	message_hook.process(dbObject);	
	putDB(dbObject);
});

xmpp.on('buddy', function(jid, state) {
	util.puts(jid);
	util.puts(state);
});

xmpp.on('error', function(err) {
	util.puts(JSON.stringify(error));
});

xmpp.connect(config.xmpp);

var realm = 'xmpp-API';
var users = '{"' + config.user.name
								+ '" : "' + auth.passhash(realm, config.user.name, config.user.pass)
								+ '"}';
var users = JSON.parse(users);

var srv = http.createServer(function(req, res) {
	var username = auth.login(req, res, realm, users);
	if(username === false) {
		return;
	}
		req.on('error', function(err) {
			util.puts(JSON.stringify(err));
		});
		req.on('data', function(data) {
			if(req.method == 'PUT') {
					var requrl = url.parse(req.url);
					util.puts(JSON.stringify(requrl));
					var param = querystring.parse(requrl.query);
					
					var dbObject = {
						'from' : config.xmpp.jid,
						'to' : param.jid + '@' + param.host,
						'message' : ""+data,
						'time' : new Date()
					}
					putDB(dbObject);
					util.puts(JSON.stringify(dbObject));	
					util.puts(""+data);
					xmpp.send(param.jid+'@'+param.host, ""+data);
					
					res.writeHead(200);
					res.end("OK");
			}
		});
		req.on('end', function(){
			if(req.method == 'GET') {
				var requrl = url.parse(req.url);
				util.puts(JSON.stringify(requrl));
				var param = querystring.parse(requrl.query);
				getConversation(param.jid+'@'+param.host, function(conversation) {
					res.writeHead(200);
					res.end(conversation);
				});
			}
		});
});
srv.listen(6666, 'localhost');

