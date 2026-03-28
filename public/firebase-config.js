import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const ADMIN_EMAIL = "bhalarambose2@gmail.com";
