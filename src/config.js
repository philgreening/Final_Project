const admin = require('firebase-admin');
const credentials = require('./key.json');
const { getStorage } = require('firebase-admin/storage');
require('dotenv').config();

//Firebase configuration
const firebaseConfig = {
  apiKey: process.env.LOT_API_FIREBASE_API_KEY,
  authDomain: process.env.LOT_API_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.LOT_API_FIREBASE__PROJECT_ID,
  storageBucket: process.env.LOT_API_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.LOT_API_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.LOT_API_FIREBASE_APP_ID,
  measurementId: process.env.LOT_API_FIREBASE_MEASUREMENT_ID,
  credential: admin.credential.cert(credentials),
};

// Initialize Firebase app
const app = admin.initializeApp(firebaseConfig);

// Initialize Firestore database and storage bucket
const db = admin.firestore();
const bucket = getStorage().bucket();

db.settings({ ignoreUndefinedProperties: true })

// Initialize collections
const Items = db.collection('Items');
const Reservations = db.collection('Reservations');
const Transactions = db.collection('Transactions');
const Users = db.collection('Users');

// Initialize timestamps
const CurrentTime = admin.firestore.FieldValue.serverTimestamp();
const FutureTime = admin.firestore.Timestamp.fromMillis(Date.now() + 604800000);

module.exports = {
  Items,
  Reservations,
  Transactions,
  Users,
  CurrentTime,
  FutureTime,
  admin,
  bucket,
  auth: admin.auth(app)
};