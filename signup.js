// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyCF5JVRQimYnnBmhnFbpZUsoUKEgc4z_Ro",
  authDomain: "hive-connection-642d5.firebaseapp.com",
  projectId: "hive-connection-642d5",
  storageBucket: "hive-connection-642d5.firebasestorage.app",
  messagingSenderId: "305576264839",
  appId: "1:305576264839:web:ee9dda8bb20a2004812422",
  measurementId: "G-QJS9C06PY3"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// === Show Selected Form ===
function showForm(role) {
  document.querySelectorAll(".signup-form").forEach(f => f.classList.remove("active"));
  document.getElementById(role).classList.add("active");
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
document.getElementById("alumni").addEventListener("submit", (e) => handleSignup(e, "alumni"));
document.getElementById("student").addEventListener("submit", (e) => handleSignup(e, "student"));
document.getElementById("admin").addEventListener("submit", (e) => handleSignup(e, "admin"));

// Default form
showForm("alumni");
