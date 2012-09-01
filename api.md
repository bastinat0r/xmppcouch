## Nachrichten Abfragen
GET /username@host (escaped) [urlparam: letzte Nachricht]
Antwort: Liste mit Nachrichtenobjekten

## Nachrichten Senden:
PUT /?jid='jid'&host='host'
Body: Nachricht

## Status Abfragen: 
GET /status/username@host (escaped)
Antwort: Aktueller Status

## Status setzen:
PUT /?status='status'
