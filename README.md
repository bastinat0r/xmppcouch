# Making XMPP aviable via REST-calls
* uses nodejs to handle xmpp
* uses couchdb to store messages and relay them to client

## node modules needed
npm install node-stringprep <br>
npm install simple-xmpp

## configuration
cp config.js.sample config.js # then edit config.js <br>
cp message_hook.js.sample message_hook.js # exampleconfig sending message via prowl
