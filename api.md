## Nachrichten Abfragen
GET /?jid='username'&host='host'
Antwort: Liste mit Nachrichtenobjekten

## Nachrichten Senden:
PUT /?jid='jid'&host='host'
Body: Nachricht

## Status Abfragen: 
GET /status?jid='username'&host='host'
Antwort: Aktueller Status

## Status setzen:
PUT /?status='status'
