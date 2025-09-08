// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyAWSnfnPvFLFnUh4KjM94jbYnj2aKY8FNc",
  authDomain: "hive-connection-3294d.firebaseapp.com",
  databaseURL: "https://hive-connection-3294d-default-rtdb.firebaseio.com",
  projectId: "hive-connection-3294d",
  storageBucket: "hive-connection-3294d.appspot.com", // fixed
  messagingSenderId: "1050669847051",
  appId: "1:1050669847051:web:d2c502c30ada68e90aed0e",
  measurementId: "G-BNHH4DQWMS"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// === Show Selected Form ===
function showForm(role) {
  document.querySelectorAll(".signup-form").forEach(f => f.classList.remove("active"));
  document.getElementById(role + "-signup").classList.add("active");
}

// === Handle Signup ===
async function handleSignup(e, role) {
  e.preventDefault();
  const email = e.target.querySelector("input[type='email']").value;
  const password = e.target.querySelector("input[type='password']").value;

  try {
    // Create user in Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Save role in Firestore
    await db.collection("users").doc(user.uid).set({
      email: email,
      role: role,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Signup successful as " + role);
    window.location.href = "login.html"; // Redirect to login
  } catch (error) {
    alert(error.message);
  }
}

// === Attach Listeners ===
document.getElementById("alumni-signup")?.addEventListener("submit", (e) => handleSignup(e, "alumni"));
document.getElementById("student-signup")?.addEventListener("submit", (e) => handleSignup(e, "student"));
document.getElementById("admin-signup")?.addEventListener("submit", (e) => handleSignup(e, "admin"));

// Default form
showForm("alumni");
