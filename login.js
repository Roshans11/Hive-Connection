// === Firebase Config ===
 const firebaseConfig = {
    apiKey: "AIzaSyAWSnfnPvFLFnUh4KjM94jbYnj2aKY8FNc",
    authDomain: "hive-connection-3294d.firebaseapp.com",
    databaseURL: "https://hive-connection-3294d-default-rtdb.firebaseio.com",
    projectId: "hive-connection-3294d",
    storageBucket: "hive-connection-3294d.firebasestorage.app",
    messagingSenderId: "1050669847051",
    appId: "1:1050669847051:web:d2c502c30ada68e90aed0e",
    measurementId: "G-BNHH4DQWMS"
  };
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// === Show Selected Form ===
function showForm(role) {
  document.querySelectorAll(".login-form").forEach(f => f.classList.remove("active"));
  document.getElementById(role).classList.add("active");
}

// === Handle Login ===
async function handleLogin(e, role) {
  e.preventDefault();
  const email = e.target.querySelector("input[type='email']").value;
  const password = e.target.querySelector("input[type='password']").value;

  try {
    // Firebase Authentication
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Check Firestore Role
    const docRef = db.collection("users").doc(user.uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const userData = docSnap.data();

      if (userData.role === role) {
        // Redirect based on role
        if (role === "alumni") window.location.href = "alumni.html";
        if (role === "student") window.location.href = "student.html";
        if (role === "admin") window.location.href = "admin.html";
      } else {
        alert(`Role mismatch! You are registered as ${userData.role}`);
        auth.signOut();
      }
    } else {
      alert("No user profile found in Firestore!");
    }
  } catch (error) {
    alert(error.message);
  }
}

// === Attach Listeners ===
document.getElementById("alumni").addEventListener("submit", (e) => handleLogin(e, "alumni"));
document.getElementById("student").addEventListener("submit", (e) => handleLogin(e, "student"));
document.getElementById("admin").addEventListener("submit", (e) => handleLogin(e, "admin"));

// Default form
showForm("alumni");
