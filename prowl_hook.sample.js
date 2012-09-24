var Prowl = require('./node_modules/node-prowl/lib/prowl.js');
prowl = new Prowl('Insert Your API-Key-Here');

module.exports.process = function(message) {
	prowl.push(message.message, message.from + ' ' + message.time.toGMTString(), function( err, remaining ){
		if( err ) throw err;
			console.log( 'I have ' + remaining + ' calls to the api during current hour. BOOM!' );
	});
}

