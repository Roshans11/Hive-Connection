// === Dummy Users ===
const users = [
  { role: "alumni", email: "alumni@test.com", password: "1234", redirect: "alumni.html" },
  { role: "student", roll: "12345", password: "1234", redirect: "student.html" },
  { role: "admin", email: "admin@test.com", password: "1234", redirect: "admin.html" }
];

// === Show Selected Form ===
function showForm(role) {
  document.querySelectorAll(".login-form").forEach(f => f.classList.remove("active"));
  document.getElementById(role).classList.add("active");
}

// === Handle Login ===
function handleLogin(e, role) {
  e.preventDefault();

  let input, password;
  if (role === "student") {
    input = e.target.querySelector("input[name='roll']").value;
    password = e.target.querySelector("input[type='password']").value;
    var user = users.find(u => u.role === role && u.roll === input && u.password === password);
  } else {
    input = e.target.querySelector("input[type='email']").value;
    password = e.target.querySelector("input[type='password']").value;
    var user = users.find(u => u.role === role && u.email === input && u.password === password);
  }

  if (user) {
    alert(`Login successful as ${role}`);
    window.location.href = user.redirect;
  } else {
    alert(`Invalid credentials for ${role}`);
  }
}

// === Attach Listeners ===
document.getElementById("alumni").addEventListener("submit", (e) => handleLogin(e, "alumni"));
document.getElementById("student").addEventListener("submit", (e) => handleLogin(e, "student"));
document.getElementById("admin").addEventListener("submit", (e) => handleLogin(e, "admin"));

// Default form
showForm("alumni");
