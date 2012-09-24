var https = require('https');

module.exports.process = function(message) {

    var data = {
        "registration_ids" : ["RECEIVER_APP_ID"],
        "data"    :   {
			"sender": message.from, 
			"message":message.message
			}
    }

    var post_options = {
      host: 'android.googleapis.com',
      path: '/gcm/send',
      port: 443,
      method: 'POST',
      headers: {
        "Content-Type"  :   "application/json",
        "Authorization" :   "key=YOUR_API_KEY"
      }
  }

    var post_req = https.request(post_options);
	post_req.write(JSON.stringify(data));
	post_req.end();
          
}
