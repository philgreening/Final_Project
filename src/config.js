const admin = require('firebase-admin');
const credentials = require('./key.json');
const { getStorage } = require('firebase-admin/storage');

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCDqf1KgJPE8CkHzL3quKcILcRo6Xo_8XM',
  authDomain: 'final-project-afe71.firebaseapp.com',
  projectId: 'final-project-afe71',
  storageBucket: 'final-project-afe71.appspot.com',
  messagingSenderId: '7143544341',
  appId: '1:7143544341:web:59d9d4eb128c77e3a0a01c',
  measurementId: 'G-SSXQSXDBT6',
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