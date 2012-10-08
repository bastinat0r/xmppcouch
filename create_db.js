var http = require('http');
var util = require('util');
var fs = require('fs');
var timer = require('timers');

function createDB(opts, desginPath, cb) {
	util.puts('Creating DB: ' + opts.path);	
	util.puts(JSON.stringify(opts));
	var req = http.request(opts, function(res) {
		res.on('data', function(data) {
			util.puts(data);
		});
	});
	timer.setTimeout(cb(designPath), 100);
	req.end();
};


function putDesign(designPath) {
	opts.path = opts.path + designPath;
	util.puts(JSON.stringify(opts));
	var req = http.request(opts, function(res) {
		res.on('data', function(data) {
			util.puts(data);
		});
	});

	fs.readFile('db/'+designPath+'.json', 'utf8', function(err, data) {
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

var opts = {
	host : 'localhost',
	port : 5984,
	method: 'PUT',
	path : '/xmpp'
}
var designPath = '/_design/all';
createDB(opts, designPath, putDesign);

opts.path = '/status';
designPath = '/_design/status';
createDB(opts, designPath,  putDesign);
