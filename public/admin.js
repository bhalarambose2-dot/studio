import { auth, db, bhalarambose2@gmail.com } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection, getDocs, doc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user || user.email !== ADMIN_EMAIL) {
    alert("Admin access only.");
    window.location.href = "login.html";
    return;
  }

  loadUsers();
  loadProofs();
});

async function loadUsers() {
  const usersList = document.getElementById("usersList");
  usersList.innerHTML = "Loading...";

  const querySnap = await getDocs(collection(db, "users"));
  let html = "";

  querySnap.forEach((docSnap) => {
    const u = docSnap.data();
    html += `
      <div class="user-row">
        <p><strong>${u.name || "No Name"}</strong> (${u.email || ""})</p>
        <p>Referral: ${u.referralCode || ""}</p>
        <p>Wallet: ${u.walletPoints || 0} points</p>
        <p>Share: ${u.shareTask ? "Done" : "Pending"} | YouTube: ${u.youtubeTask ? "Done" : "Pending"} | Proof: ${u.proofUploaded ? "Uploaded" : "Pending"}</p>
        <button class="small-btn" onclick="approveUser('${docSnap.id}')">Approve +50</button>
        <button class="small-btn" onclick="rejectUser('${docSnap.id}')">Reject</button>
      </div>
    `;
  });

  usersList.innerHTML = html || "No users found.";
}

async function loadProofs() {
  const proofsList = document.getElementById("proofsList");
  proofsList.innerHTML = "Loading...";

  const querySnap = await getDocs(collection(db, "users"));
  let html = "";

  querySnap.forEach((docSnap) => {
    const u = docSnap.data();
    if (u.proofUploaded && u.proofUrl) {
      html += `
        <div class="proof-row">
          <p><strong>${u.name || "No Name"}</strong> (${u.email || ""})</p>
          <p><a href="${u.proofUrl}" target="_blank">View Screenshot</a></p>
          <button class="small-btn" onclick="approveUser('${docSnap.id}')">Approve +50</button>
        </div>
      `;
    }
  });

  proofsList.innerHTML = html || "No proofs uploaded yet.";
}

window.approveUser = async function (uid) {
  await updateDoc(doc(db, "users", uid), {
    walletPoints: increment(50),
    isEligible: true
  });
  alert("Approved. +50 points added.");
  loadUsers();
  loadProofs();
};

window.rejectUser = async function (uid) {
  await updateDoc(doc(db, "users", uid), {
    isEligible: false
  });
  alert("Marked as not eligible.");
  loadUsers();
  loadProofs();
};

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};
