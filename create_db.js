var http = require('http');
var util = require('util');
var fs = require('fs');

var opts = {
	host : 'localhost',
	port : 5984,
	method: 'PUT',
	path : '/xmpp'
}

function createDB(opts, cb) {
	
	var req = http.request(opts, function(res) {
		res.on('data', function(data) {
			util.puts(data);
		});
	});

	req.end();
	cb();
};


function putDesign() {
	opts.path = opts.path + '/_design/all'
	var req = http.request(opts, function(res) {
		res.on('data', function(data) {
			util.puts(data);
		});
	});

	fs.readFile('db/_design/all.json', 'utf8', function(err, data) {
		if(err) {
			util.puts(err);
			req.end();
		}
		else {
			util.puts(data);
			req.write(data);
			req.end();
		}
	});
}

createDB(opts, putDesign);
