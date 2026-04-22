import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("jobForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: name.value,
    mobile: mobile.value,
    email: email.value,
    aadhar: aadhar.value,
    pan: pan.value,
    gender: gender.value,
    status: "pending",
    createdAt: new Date()
  };

  try {
    await addDoc(collection(db, "applications"), data);
    alert("✅ Application Submitted Successfully");
    form.reset();
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
});
