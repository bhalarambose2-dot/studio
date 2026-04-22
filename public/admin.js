import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("data");

// 🔐 Simple Password Protection
const pass = prompt("Enter Admin Password");
if (pass !== "1234") {
  document.body.innerHTML = "<h2>Access Denied</h2>";
}

// 📥 Load Applications
async function loadData() {
  const querySnapshot = await getDocs(collection(db, "applications"));
  container.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const d = docSnap.data();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${d.name}</h3>
      <p><b>Mobile:</b> ${d.mobile}</p>
      <p><b>Email:</b> ${d.email}</p>
      <p><b>Status:</b> ${d.status}</p>

      <div class="actions">
        <button onclick="approve('${docSnap.id}')">Approve</button>
        <button onclick="deleteApp('${docSnap.id}')">Delete</button>
        <button onclick="whatsapp('${d.mobile}','${d.name}')">WhatsApp</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// ✅ Approve
window.approve = async (id) => {
  await updateDoc(doc(db, "applications", id), { status: "approved" });
  alert("Approved");
  loadData();
};

// ❌ Delete
window.deleteApp = async (id) => {
  await deleteDoc(doc(db, "applications", id));
  alert("Deleted");
  loadData();
};

// 📲 WhatsApp
window.whatsapp = (mobile, name) => {
  const msg = `Hello ${name}, your application is received - BR Trip`;
  window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`);
};

loadData();
