<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>

<script>
const firebaseConfig = {
  apiKey: "AIzaSyC2MPagJSfgitEdpr_jKJ073MKLd7jjSNc",
  authDomain: "br-trip.firebaseapp.com",
  projectId: "br-trip",
  storageBucket: "br-trip.firebasestorage.app",
  messagingSenderId: "477570603875",
  appId: "1:477570603875:web:f371ec9a017f97f696d156"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
</script>
