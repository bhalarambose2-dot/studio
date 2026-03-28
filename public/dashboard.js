import { auth, db, storage } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

let currentUser = null;
let userData = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;
  userData = snap.data();

  document.getElementById("userName").innerText = userData.name || "User";
  document.getElementById("userEmail").innerText = userData.email || "";
  document.getElementById("refCode").innerText = userData.referralCode || "";
  document.getElementById("walletPoints").innerText = userData.walletPoints || 0;
  document.getElementById("shareTaskStatus").innerText = userData.shareTask ? "Done" : "Pending";
  document.getElementById("ytTaskStatus").innerText = userData.youtubeTask ? "Done" : "Pending";
  document.getElementById("proofStatus").innerText = userData.proofUploaded ? "Uploaded" : "Pending";
});

window.copyReferral = function () {
  const link = `${window.location.origin}/signup.html?ref=${userData.referralCode}`;
  navigator.clipboard.writeText(link);
  alert("Referral link copied!");
};

window.markShareDone = async function () {
  await updateDoc(doc(db, "users", currentUser.uid), { shareTask: true });
  alert("Share task marked as done. Admin will verify.");
  location.reload();
};

window.markYoutubeDone = async function () {
  await updateDoc(doc(db, "users", currentUser.uid), { youtubeTask: true });
  alert("YouTube task marked as done. Admin will verify.");
  location.reload();
};

window.uploadProof = async function () {
  const file = document.getElementById("proofFile").files[0];
  const uploadMsg = document.getElementById("uploadMsg");

  if (!file) {
    uploadMsg.innerText = "Please select a screenshot first.";
    return;
  }

  try {
    const storageRef = ref(storage, `proofs/${currentUser.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const proofUrl = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "users", currentUser.uid), {
      proofUploaded: true,
      proofUrl
    });

    uploadMsg.innerText = "Proof uploaded successfully!";
    setTimeout(() => location.reload(), 1000);
  } catch (error) {
    uploadMsg.innerText = error.message;
  }
};

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};
