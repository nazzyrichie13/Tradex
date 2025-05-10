
const api = "http://localhost:5000/api/auth";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch(`${api}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("tradex_token", data.token);
      showMessage("Login successful. Welcome, " + data.user.name);
    } else {
      showMessage(data.msg || "Login failed.");
    }
  } catch (err) {
    showMessage("Error logging in.");
  }
});

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const res = await fetch(`${api}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("tradex_token", data.token);
      showMessage("Registration successful. Welcome, " + data.user.name);
    } else {
      showMessage(data.msg || "Registration failed.");
    }
  } catch (err) {
    showMessage("Error registering.");
  }
});

function showForm(type) {
  document.getElementById("login-form").style.display = type === "login" ? "block" : "none";
  document.getElementById("register-form").style.display = type === "register" ? "block" : "none";
}

function showMessage(msg) {
  document.getElementById("message").innerText = msg;
}
