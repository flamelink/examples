# Flamelink in Firebase Cloud Functions

The Flamelink SDK works equally well on the server as in the browser. This also includes withing Firebase Cloud Functions.

## Basic example

```javascript
const functions = require('firebase-functions')
const flamelink = require('flamelink')
const admin = require('firebase-admin')

// Initialize your Firebase app using the convenient functions config helper
const firebaseApp = admin.initializeApp(functions.config().firebase)

// Initialize your Flamelink app like you would on any other server env (isAdminApp is important!)
const app = flamelink({ firebaseApp, isAdminApp: true })

// Example HTTPS request function - could be any other function handler
exports.addMessage = functions.https.onRequest((req, res) => {
  // Get all "messages" content from your DB
  return app.content.get('messages')
    .then(messages => res.status(200).json({ messages }))
    .catch(error => res.status(500).json({ error }))
});
```