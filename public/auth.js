import { auth, db, ADMIN_EMAIL } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc, setDoc, getDoc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.signup = async function () {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const referralInput = document.getElementById("referralInput").value.trim();
  const msg = document.getElementById("msg");

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const referralCode = "HAL" + Math.random().toString(36).substring(2, 8).toUpperCase();

    await setDoc(doc(db, "users", uid), {
      name,
      email,
      referralCode,
      referredBy: referralInput || "",
      walletPoints: 0,
      shareTask: false,
      youtubeTask: false,
      proofUploaded: false,
      isEligible: false,
      isAdmin: email bhalarambose2@gmail.com,
      createdAt: Date.now()
    });

    if (referralInput) {
      // reward referrer by code
      // simple scan-free approach: store code only for now
      // admin can verify and award manually
    }

    msg.innerText = "Signup successful! Redirecting...";
    setTimeout(() => {
      window.location.href = email === ADMIN_EMAIL ? "admin.html" : "dashboard.html";
    }, 1200);
  } catch (error) {
    msg.innerText = error.message;
  }
};

window.login = async function () {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const loginMsg = document.getElementById("loginMsg");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginMsg.innerText = "Login successful!";
    setTimeout(() => {
      window.location.href = email === ADMIN_EMAIL ? "admin.html" : "dashboard.html";
    }, 1000);
  } catch (error) {
    loginMsg.innerText = error.message;
  }
};

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;
});
