const firebase = require("firebase-admin");

var serviceAccount = require('../config/bikebump-ea3b1-firebase-adminsdk-ephgk-53ad7855df.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://bikebump-ea3b1.firebaseio.com"
});

const db = firebase.database()
const ref = db.ref()

module.exports = ref