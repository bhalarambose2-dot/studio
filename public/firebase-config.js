// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyC2MPagJSfgitEdpr_jKJ073MKLd7jjSNc",
  authDomain: "br-trip.firebaseapp.com",
  databaseURL: "https://br-trip-default-rtdb.firebaseio.com",
  projectId: "br-trip",
  storageBucket: "br-trip.firebasestorage.app",
  messagingSenderId: "477570603875",
  appId: "1:477570603875:web:f371ec9a017f97f696d156",
  measurementId: "G-PJSNT1Q1LL"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
