const firebase = require('firebase-admin');
const credentials = require("./key.json");
//const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
//const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


// import { getFirestore } from "firebase/firestore";


 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCDqf1KgJPE8CkHzL3quKcILcRo6Xo_8XM",
    authDomain: "final-project-afe71.firebaseapp.com",
    projectId: "final-project-afe71",
    storageBucket: "final-project-afe71.appspot.com",
    messagingSenderId: "7143544341",
    appId: "1:7143544341:web:59d9d4eb128c77e3a0a01c",
    measurementId: "G-SSXQSXDBT6",
    credential: firebase.credential.cert(credentials)
  };
firebase.initializeApp(firebaseConfig);
//const app = initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({ ignoreUndefinedProperties: true })

  //const db = getFirestore(app);
const Items= db.collection("Items");
const Reservations = db.collection("Reservations");
const Transactions = db.collection("Transactions");
const Users = db.collection("Users");
const CurrentTime = firebase.firestore.FieldValue.serverTimestamp();
const FutureTime = firebase.firestore.Timestamp.fromMillis(Date.now() + 604800000);

module.exports = { Items, Reservations, Transactions, Users, CurrentTime, FutureTime };
